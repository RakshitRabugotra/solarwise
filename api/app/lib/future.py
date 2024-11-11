from .dataset import get_model_files, fetch_model


FILE_NAMES = get_model_files()
LOCATIONS = [(float(i.split("_")[0]), float(i.split("_")[1])) for i in FILE_NAMES]


"""
Utilities
"""


def find_closest_point(locations, latitude, longitude):
    min_distance = float("inf")
    closest_point = None

    for x, y in locations:
        distance = ((x - latitude) ** 2 + (y - longitude) ** 2) ** (1 / 2)
        if distance < min_distance:
            min_distance = distance
            closest_point = (x, y)

    return closest_point


"""
Calculates SDL by prediction
"""


def predict_SDL(lat, lon, years: int = 1):
    file_name = "_".join([str(i) for i in find_closest_point(LOCATIONS, lat, lon)])
    model = fetch_model(file_name)
    date = date[-4:] + date[3:5]
    SDL = model.forecast(steps=years * 12)
    return SDL
