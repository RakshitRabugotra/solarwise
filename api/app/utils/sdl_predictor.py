import os
import pickle
from datetime import datetime

def get_file_names_in_path(path):
  file_names = []
  for _, _, files in os.walk(path):
    for file in files:
          file_names.append(file)
  return file_names

def find_closest_point(locations, latitude, longitude):
    min_distance = float('inf')
    closest_point = None

    for x, y in locations:
        distance = ((x - latitude) ** 2 + (y - longitude) ** 2)**(1/2)
        if distance < min_distance:
            min_distance = distance
            closest_point = (x, y)

    return closest_point


def months_from_august_2024(target_date):
  reference_date = datetime(2024, 8, 1)
  
  # target_date = datetime.strptime(target_date, "%Y-%m-%d")
  target_date = datetime.strptime(target_date, "%Y-%m-%d")
  
  year_diff = target_date.year - reference_date.year
  month_diff = target_date.month - reference_date.month
  
  total_months = year_diff * 12 + month_diff
  return total_months


def predict_SDL(file_name, date):

    month_diff = months_from_august_2024(date)
    print(month_diff)

    with open(f'app/static/models/{file_name}', 'rb') as f:
      loaded_model = pickle.load(f)
      
    SDL = loaded_model.forecast(steps=month_diff)
    return SDL.tolist()
    

# main function to be called
def calculate_SDL(latitude, longitude, date):
    file_name = "_".join([ str(i) for i in find_closest_point(locations, latitude, longitude)])
    SDL = predict_SDL(file_name, date)
    return SDL


file_names = get_file_names_in_path('app/static/models')
print(file_names)
locations = [ (float(i.split('_')[0]), float(i.split('_')[1])) for i in file_names]