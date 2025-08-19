from datetime import datetime
from huggingface_hub import snapshot_download
# from .dataset import get_model_files
import tensorflow as tf
import numpy as np
import pandas as pd
import pickle
import json
import os
import json



# Downloading model from Hugging Face
repo_id = "Subhajit42/SDL-Prediction-Model"
# Define the local directory where you want to download the files
local_dir = "app/static/sdl-prediction-model"

os.makedirs(local_dir, exist_ok=True)
num_files = sum([len(files) for r, d, files in os.walk(local_dir)])

if num_files == 0:
    snapshot_download(repo_id=repo_id, local_dir=local_dir)
# print(f"Files downloaded to {local_dir}")


# FILE_NAMES = get_model_files()
# LOCATIONS = [(float(i.split("_")[0]), float(i.split("_")[1])) for i in FILE_NAMES]

# DON'T CHANGE, START DATE
REFERENCE_DATE = datetime(2025, 6, 1)

"""
Utilities
"""

def find_closest_point(locations, latitude, longitude):
    min_distance = float("inf")
    closest_point = None

    for x, y in locations:
        distance = (x - latitude) ** 2 + (y - longitude) ** 2
        if distance < min_distance**2:
            min_distance = distance
            closest_point = (x, y)

    return closest_point


def months_from_june_2025(target_date):
    # Constants for now

    # target_date = datetime.strptime(target_date, "%Y-%m-%d")
    target_date = datetime.strptime(target_date, "%Y-%m-%d")

    year_diff = target_date.year - REFERENCE_DATE.year
    month_diff = target_date.month - REFERENCE_DATE.month

    total_months = year_diff * 12 + month_diff
    return total_months


ARTIFACTS_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'sdl-prediction-model')
# print("Loading model and pre-processing artifacts...")


# Load the Keras model
model_path = os.path.join(ARTIFACTS_PATH, 'model.keras')
# print(f"Model loaded from: {model_path}")
model = tf.keras.models.load_model(model_path)

# Load the y_scaler (for inverse transforming predictions)
y_scaler_path = os.path.join(ARTIFACTS_PATH, 'scalers/y_scaler.pkl')
with open(y_scaler_path, 'rb') as f:
    y_scaler = pickle.load(f)

# Load the input_scalers dictionary (for scaling future input features)
input_scalers_path = os.path.join(ARTIFACTS_PATH, 'scalers/input_scalers.pkl')
with open(input_scalers_path, 'rb') as f:
    scalers = pickle.load(f)

# Load the initial X sequence for forecasting
initial_X_sequence_path = os.path.join(ARTIFACTS_PATH, 'metadata/initial_X_sequence_for_forecast.npy')
initial_X_sequence_for_forecast = np.load(initial_X_sequence_path)

# Load metadata
metadata_path = os.path.join(ARTIFACTS_PATH, 'metadata/model_metadata.json')
with open(metadata_path, 'r') as f:
    metadata = json.load(f)
# Convert lists back to numpy arrays and string to datetime object
lats_grid = np.array(metadata['lats_grid'])
lons_grid = np.array(metadata['lons_grid'])
last_known_date = pd.to_datetime(metadata['last_known_date'])
height = metadata['height']
width = metadata['width']
n_channels = metadata['n_channels']
TIMESTEPS = metadata['TIMESTEPS']
channel_names = metadata['channel_names']

def predict_SDL(model, initial_X_sequence, forecast_months, y_scaler, scalers, height, width, n_channels, last_known_date, TIMESTEPS, lats_grid, lons_grid, channel_names):
    """
    Predicts future SDL values in a rolling forecast manner.

    Args:
        model: The trained Keras model.
        initial_X_sequence: The last TIMESTEPS (12-month) sequence of scaled X_4d_data
                            (TIMESTEPS, height, width, n_channels)
                            to start the forecast. This sequence must end right before
                            the first month you want to predict.
        forecast_months: The number of future months to predict.
        y_scaler: The MinMaxScaler for inverse transforming predicted SDL.
        scalers: Dictionary of scalers for 'sdlr_value', 'year_channel', 'month_sin_channel', 'month_cos_channel'.
        height, width, n_channels, TIMESTEPS: Model/data dimensions.
        last_known_date: The pandas Timestamp of the last month in your initial_X_sequence.
        lats_grid, lons_grid: Grid coordinates for specific point extraction.
        channel_names: List of channel names, e.g., ['sdlr_value', 'year_channel', 'month_sin_channel', 'month_cos_channel']

    Returns:
        A dictionary containing:
            'forecast_dates': List of pandas Timestamps for predicted months.
            'predicted_sdl_scaled': List of predicted scaled SDL 2D grids.
            'predicted_sdl_original': List of predicted original SDL 2D grids.
    """
    current_X_sequence = initial_X_sequence.copy() # Make a copy to avoid modifying original array
    
    forecast_dates = []
    predicted_sdl_scaled = []
    predicted_sdl_original = []

    for i in range(forecast_months):
        # 1. Predict the next month's SDL (scaled)
        # Model expects a batch, so expand dims: (1, TIMESTEPS, height, width, n_channels)
        next_sdl_scaled_pred = model.predict(np.expand_dims(current_X_sequence, axis=0), verbose=0)[0]
        
        predicted_sdl_scaled.append(next_sdl_scaled_pred)

        # Inverse transform to original units for interpretation
        next_sdl_original_pred = y_scaler.inverse_transform(next_sdl_scaled_pred.reshape(-1, 1)).reshape(height, width)
        predicted_sdl_original.append(next_sdl_original_pred)

        # Determine the date of the predicted month
        predicted_date = last_known_date + pd.DateOffset(months=i+1)
        forecast_dates.append(predicted_date)

        # 2. Prepare the input sequence for the *next* prediction
        # Get year and month for the predicted_date
        next_year = predicted_date.year
        next_month = predicted_date.month

        # Scale the year and month using the *same scalers* fitted on training data
        scaled_next_year = scalers['year_channel'].transform(np.array([[next_year]]))
        scaled_next_month_sin = scalers['month_sin_channel'].transform(np.array([[np.sin(2 * np.pi * next_month / 12)]]))
        scaled_next_month_cos = scalers['month_cos_channel'].transform(np.array([[np.cos(2 * np.pi * next_month / 12)]]))

        # Create a new 'X' data point for the predicted month
        new_X_point = np.zeros((height, width, n_channels), dtype=np.float32)
        
        # Assign values to channels based on their names/indices
        # Ensure 'sdlr_value' is the first channel (index 0) if that was its position during training
        new_X_point[:, :, channel_names.index('sdlr_value')] = next_sdl_scaled_pred
        new_X_point[:, :, channel_names.index('year_channel')] = scaled_next_year[0, 0]
        new_X_point[:, :, channel_names.index('month_sin_channel')] = scaled_next_month_sin[0, 0]
        new_X_point[:, :, channel_names.index('month_cos_channel')] = scaled_next_month_cos[0, 0]


        # Update the current_X_sequence by removing the oldest month and adding the new predicted month
        current_X_sequence = np.roll(current_X_sequence, shift=-1, axis=0) # Shift all months one position left
        current_X_sequence[-1] = new_X_point # Place the new month at the end

    return {
        'forecast_dates': forecast_dates,
        'predicted_sdl_scaled': predicted_sdl_scaled,
        'predicted_sdl_original': predicted_sdl_original
    }




# Main function to be called
def calculate_SDL(target_lat_plot, target_lon_plot, date):

    num_forecast_months = months_from_june_2025(date)

    forecast_results = predict_SDL(
        model,
        initial_X_sequence_for_forecast,
        num_forecast_months,
        y_scaler,
        scalers,
        height, width, n_channels,
        last_known_date, # Pass the last known date from metadata
        TIMESTEPS,
        lats_grid, lons_grid,
        channel_names # Pass channel names for accurate indexing
    )

    lat_idx_plot = np.argmin(np.abs(lats_grid - target_lat_plot))
    lon_idx_plot = np.argmin(np.abs(lons_grid - target_lon_plot))

    forecasted_point_series = np.array(forecast_results['predicted_sdl_original'])[:, lat_idx_plot, lon_idx_plot]

    SDL_values = []
    for i in range(len(forecast_results['forecast_dates'])):
        # date = forecast_results['forecast_dates'][i].strftime('%Y-%m')
        sdl_value = forecasted_point_series[i]
        # Convert numpy float32 to Python float for JSON serialization
        SDL_values.append(float(sdl_value))
        # print(f"  {date}: {sdl_value:.2f} W/m2")
    
    return SDL_values