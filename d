[1mdiff --git a/api/README.md b/api/README.md[m
[1mindex d218beb..6c2a934 100644[m
[1m--- a/api/README.md[m
[1m+++ b/api/README.md[m
[36m@@ -4,7 +4,100 @@[m
 [m
 ### Endpoints[m
 [m
[31m-### 1. `/api/<endpoint>`[m
[32m+[m[32m**Admin Routes**[m
[32m+[m
[32m+[m[32m#### 1. `/_/admin/`[m
[32m+[m[32m- Method - GET, POST[m
[32m+[m[32m- Description - Login Route[m
[32m+[m
[32m+[m[32m#### 2. `/_/admin/collections`[m
[32m+[m[32m- Method - GET[m
[32m+[m[32m- Description[m[41m [m
[32m+[m
[32m+[m[32m#### 3. `/_/admin/collections/users`[m
[32m+[m[32m- Method - GET[m
[32m+[m[32m- Description[m[41m [m
[32m+[m
[32m+[m[32m#### 4. `/_/admin/logs`[m
[32m+[m[32m- Method - GET[m
[32m+[m[32m- Description[m[41m [m
[32m+[m
[32m+[m[32m#### 5. `/_/admin/logout`[m
[32m+[m[32m- Method - GET[m
[32m+[m[32m- Description - Logout User[m
[32m+[m
[32m+[m[32m**Data Routes**[m
[32m+[m
[32m+[m[32m#### 1. `/api/data/sdlr`[m
[32m+[m[32m- Method - POST[m
[32m+[m[32m- Description - Provides SDLR data for the specified latitude and longitude for the years ranging from 1979 to 2024. (Dataset is being used.)[m
[32m+[m[32m```Json[m
[32m+[m[32m// Reqest BODY[m
[32m+[m[32m{[m
[32m+[m[32m  "lat" : 20, // Latitude of the location (in decimal degrees)[m
[32m+[m[32m  "lon" : 88, // Longitude of the location (in decimal degrees)[m
[32m+[m[32m  "year": 2023 // Accepts integer values only in the range from 1979 to August, 2024[m
[32m+[m[32m}[m
[32m+[m[32m```[m
[32m+[m[32m```Json[m
[32m+[m[32m// RESPONSE[m
[32m+[m[32m{[m
[32m+[m[32m    "code": 200,[m
[32m+[m[32m    "msg": "found SDLR data",[m
[32m+[m[32m    "payload": {[m
[32m+[m[32m        "sdlr": [[m
[32m+[m[32m            {[m
[32m+[m[32m                "month": "January",[m
[32m+[m[32m                "order": 0,[m
[32m+[m[32m                "sdlr": 354.4118957519531 // Unit - Watts per metre square[m
[32m+[m[32m            },[m
[32m+[m[32m        ....[m
[32m+[m[32m        ],[m
[32m+[m[32m    "year": 2023[m
[32m+[m[32m  },[m
[32m+[m[32m  "raw_msg": "found SDLR data"[m
[32m+[m[32m}[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m#### 2. `/api/data/energy`[m
[32m+[m[32m- Method - POST[m
[32m+[m[32m<!-- - Description -  -->[m
[32m+[m
[32m+[m[32m#### 3. `/api/data/energy/predict`[m
[32m+[m[32m- Method - POST[m
[32m+[m[32m- Description - Provides Energy consumption, peak-sunlight-hours and radiation for all the months in that year. (Uses model to do the predictions.)[m
[32m+[m[32m```Json[m
[32m+[m[32m// Request BODY[m
[32m+[m[32m{[m
[32m+[m[32m  "lat" : 20, // Accepts float values as well[m
[32m+[m[32m  "lon" : 88, // Accepts float values as well[m
[32m+[m[32m  "area" : 100, // Area of the solar panels (in square meters)[m
[32m+[m[32m  "efficiency" : 0.223, // Efficiency of the solar panels (between 0 and 1). Default Value = 0.223 (22.3%)[m
[32m+[m[32m  "to_year": 2025[m
[32m+[m[32m}[m
[32m+[m[32m```[m
[32m+[m[32m```Json[m
[32m+[m[32m// RESPONSE[m
[32m+[m[32m{[m
[32m+[m[32m    "code": 200,[m
[32m+[m[32m    "msg": "energy for the year",[m
[32m+[m[32m    "payload": {[m
[32m+[m[32m        "months": [[m
[32m+[m[32m            {[m
[32m+[m[32m                "energy": 2074.022198867862, // Unit - Kilowatt hour(Kwh)[m
[32m+[m[32m                "month": "SEP",[m
[32m+[m[32m                "order": 0,[m
[32m+[m[32m                "peak-sunlight-hours": 4.367532432302166, // Unit - Hours[m
[32m+[m[32m                "radiation": 425.8948557862693, // Unit - Watts per metre square[m
[32m+[m[32m                "year": 2024 // Accepts integer values only i.e. 2024 or onwards[m
[32m+[m[32m            },[m
[32m+[m[32m            ....[m
[32m+[m[32m        ],[m
[32m+[m[32m    "total": 32971.24704613135[m
[32m+[m[32m  },[m
[32m+[m[32m  "raw_msg": "energy for the year"[m
[32m+[m[32m}[m
[32m+[m[32m```[m
 [m
 ## Error Handling[m
 [m
[1mdiff --git a/api/app/lib/dataset.py b/api/app/lib/dataset.py[m
[1mindex 3375a1f..1711ca7 100644[m
[1m--- a/api/app/lib/dataset.py[m
[1m+++ b/api/app/lib/dataset.py[m
[36m@@ -1,11 +1,13 @@[m
 import netCDF4 as nc[m
 import numpy as np[m
[32m+[m[32mimport pickle[m
[32m+[m[32mimport datetime[m
 import csv[m
 import os[m
 [m
 [m
 # Custom modules[m
[31m-from app.utils.dates import is_valid_year, get_month, get_valid_year_range[m
[32m+[m[32mfrom app.utils.dates import is_valid_year, get_month[m
 [m
 """[m
 Constants[m
[36m@@ -23,6 +25,21 @@[m [mdef get_solar_decline(filename: str = "delta_table.csv"):[m
         return [line for line in reader][m
 [m
 [m
[32m+[m[32mdef get_model_files():[m
[32m+[m[32m    files = [][m
[32m+[m[32m    path = os.path.join(STATIC_FOLDER, "models")[m
[32m+[m
[32m+[m[32m    for filename in os.listdir(path):[m
[32m+[m[32m        files.append(filename)[m
[32m+[m[32m    return files[m
[32m+[m
[32m+[m
[32m+[m[32mdef fetch_model(file):[m
[32m+[m[32m    with open(os.path.join(STATIC_FOLDER, "models", file), "rb") as modelFile:[m
[32m+[m[32m        model = pickle.load(modelFile)[m
[32m+[m[32m        return model[m
[32m+[m
[32m+[m
 class NetCDFRetriever:[m
     """[m
     NetCDF file reading utility[m
[1mdiff --git a/api/app/lib/energy.py b/api/app/lib/energy.py[m
[1mindex f78758c..339e39a 100644[m
[1m--- a/api/app/lib/energy.py[m
[1m+++ b/api/app/lib/energy.py[m
[36m@@ -3,6 +3,7 @@[m [mimport math[m
 [m
 # Custom modules[m
 from app.utils.dates import date_range, get_month_abbr[m
[32m+[m[32mfrom .future import calculate_SDL[m
 from .dataset import NetCDFRetriever, NetCDFExtractor, get_solar_decline[m
 [m
 # The solar decline dataset[m
[36m@@ -171,6 +172,7 @@[m [mdef get_estimated_energy([m
     area: float,[m
     efficiency: float | None = 0.223,[m
     month: int | None = None,[m
[32m+[m[32m    to_year: int | None = None,[m
 ) -> float | None:[m
     """[m
     Estimate the energy output of a solar panel system for a given location and month.[m
[36m@@ -196,27 +198,35 @@[m [mdef get_estimated_energy([m
       and a class `NetCDFExtractor` to extract solar radiation data.[m
     - The sunlight hours are adjusted with an empirical factor of 0.6 to account for peak hours.[m
     """[m
[31m-    year = datetime.datetime.now().year - 1[m
[32m+[m[32m    current_year = datetime.datetime.now().year[m
[32m+[m[32m    year = year or current_year + 1[m
[32m+[m
     # Redefine efficiency with a constants[m
     efficiency = efficiency or 0.223[m
     # Round the month for inputs[m
     month = month % 12 if month is not None else None[m
[32m+[m[32m    SDLR = [][m
[32m+[m
[32m+[m[32m    if year < current_year:[m
[32m+[m[32m        # Retrieve for the last year[m
[32m+[m[32m        files = None[m
[32m+[m[32m        try:[m
[32m+[m[32m            retriever = NetCDFRetriever()[m
[32m+[m[32m            files = retriever.retrieve(year)[m
[32m+[m[32m        except ValueError:[m
[32m+[m[32m            print("The data is not up-to-date, for year:", year)[m
[32m+[m[32m            return None[m
 [m
[31m-    # Retrieve for the last year[m
[31m-    files = None[m
[31m-    try:[m
[31m-        retriever = NetCDFRetriever()[m
[31m-        files = retriever.retrieve(year)[m
[31m-    except ValueError:[m
[31m-        print("The data is not up-to-date, for year:", year)[m
[31m-        return None[m
[31m-[m
[31m-    # If the files aren't found, return None[m
[31m-    if files is None:[m
[31m-        return None[m
[32m+[m[32m        # If the files aren't found, return None[m
[32m+[m[32m        if files is None:[m
[32m+[m[32m            return None[m
 [m
[31m-    # Extract the SDLR data[m
[31m-    SDLR = list(map(lambda dt: dt["sdlr"], NetCDFExtractor.get_sdlr(files, lat, lon)))[m
[32m+[m[32m        # Extract the SDLR data[m
[32m+[m[32m        SDLR = list([m
[32m+[m[32m            map(lambda dt: dt["sdlr"], NetCDFExtractor.get_sdlr(files, lat, lon))[m
[32m+[m[32m        )[m
[32m+[m[32m    else:[m
[32m+[m[32m        raise "Cannot fetch for future dates, use prediction"[m
 [m
     total = 0[m
     # Return the energy for a particular month[m
[36m@@ -237,6 +247,7 @@[m [mdef get_estimated_energy([m
 [m
     # Else, return an average energy for the whole year[m
     month_energies = [][m
[32m+[m
     for i in range(1, 13):  # Corrected to loop through all months (1 to 12)[m
         # Average sunlight received for the particular month[m
         hours = get_sunlight_hours(lat, -1, get_month_abbr(i))[m
[36m@@ -244,9 +255,9 @@[m [mdef get_estimated_energy([m
         adjustment_factor = 0.6[m
         hours *= adjustment_factor[m
         # The SDLR radiation for this month[m
[31m-        radiation = SDLR[i - 1][m
[32m+[m[32m        radiation = SDLR[i][m
         energy = (radiation * area * hours) / 1000[m
[31m-        energy *= efficiency * date_range(i, year)[m
[32m+[m[32m        energy *= efficiency * date_range(i + 1, year)[m
         month_energies.append(energy)[m
 [m
     # Return an average, adjusted for efficiency[m
[36m@@ -257,6 +268,84 @@[m [mdef get_estimated_energy([m
     return month_energies, total[m
 [m
 [m
[32m+[m[32mdef get_estimated_energy_by_year([m
[32m+[m[32m    lat: float,[m
[32m+[m[32m    lon: float,[m
[32m+[m[32m    area: float,[m
[32m+[m[32m    to_year: int,[m
[32m+[m[32m    efficiency: float | None = 0.223,[m
[32m+[m[32m) -> float | None:[m
[32m+[m[32m    """[m
[32m+[m[32m    Estimate the energy output of a solar panel system for a given location and month.[m
[32m+[m
[32m+[m[32m    Parameters:[m
[32m+[m[32m    - lat (float): Latitude of the location (in decimal degrees).[m
[32m+[m[32m    - lon (float): Longitude of the location (in decimal degrees).[m
[32m+[m[32m    - area (float): Area of the solar panels (in square meters).[m
[32m+[m[32m    - to_year (int | None): The year up until which the prediction is needed[m
[32m+[m[32m    - panel_efficiency (float): Efficiency of the solar panels (between 0 and 1).[m
[32m+[m[32m      If None, defaults to 0.223 (22.3%).[m
[32m+[m
[32m+[m[32m    Returns:[m
[32m+[m[32m    - float | None: Estimated energy output in kWh for the specified month or average yearly output.[m
[32m+[m[32m      Returns None if data retrieval fails or if files are not found.[m
[32m+[m
[32m+[m[32m    Raises:[m
[32m+[m[32m    - ValueError: If data for the specified year is not available.[m
[32m+[m
[32m+[m[32m    Note:[m
[32m+[m[32m    - The function assumes the use of a class `NetCDFRetriever` to retrieve weather data,[m
[32m+[m[32m      and a class `NetCDFExtractor` to extract solar radiation data.[m
[32m+[m[32m    - The sunlight hours are adjusted with an empirical factor of 0.6 to account for peak hours.[m
[32m+[m[32m    """[m
[32m+[m[32m    current_year = datetime.datetime.now().year[m
[32m+[m[32m    to_year = to_year or current_year + 1[m
[32m+[m
[32m+[m[32m    # Redefine efficiency with a constants[m
[32m+[m[32m    efficiency = efficiency or 0.223[m
[32m+[m[32m    SDLR = [][m
[32m+[m
[32m+[m[32m    # Retrieve for the all year[m
[32m+[m[32m    date = datetime.datetime(to_year, 12, 31).strftime("%Y-%m-%d")[m
[32m+[m[32m    # Get the prediction for the SDLR[m
[32m+[m[32m    SDLR.extend(calculate_SDL(lat, lon, date))[m
[32m+[m
[32m+[m[32m    # Else, return an average energy for the whole year[m
[32m+[m[32m    yearly_energies = [][m
[32m+[m
[32m+[m[32m    # The starting date for the prediction[m
[32m+[m[32m    date = datetime.datetime(2024, 9, 1)  # Start month + 1[m
[32m+[m
[32m+[m[32m    total = 0[m
[32m+[m[32m    for i, radiation in enumerate(SDLR):[m
[32m+[m[32m        # Average sunlight received for the particular month[m
[32m+[m[32m        hours = get_sunlight_hours(lat, -1, get_month_abbr(date.month - 1))[m
[32m+[m[32m        # Adjustment factor for sunlight, accounting for peak hours[m
[32m+[m[32m        adjustment_factor = 0.6[m
[32m+[m[32m        hours *= adjustment_factor[m
[32m+[m[32m        # The SDLR radiation for this month[m
[32m+[m[32m        energy = (radiation * area * hours) / 1000[m
[32m+[m[32m        energy *= efficiency * date_range(date.month, date.year)[m
[32m+[m[32m        yearly_energies.append([m
[32m+[m[32m            {[m
[32m+[m[32m                "radiation": radiation,[m
[32m+[m[32m                "order": i,[m
[32m+[m[32m                "year": date.year,[m
[32m+[m[32m                "month": get_month_abbr(date.month - 1),[m
[32m+[m[32m                "energy": energy,[m
[32m+[m[32m                "peak-sunlight-hours": hours * 0.6,[m
[32m+[m[32m            }[m
[32m+[m[32m        )[m
[32m+[m[32m        # Increment the date[m
[32m+[m[32m        date += datetime.timedelta(days=date_range(date.month, date.year))[m
[32m+[m
[32m+[m[32m    # Return an average, adjusted for efficiency[m
[32m+[m[32m    for i, object in enumerate(yearly_energies):[m
[32m+[m[32m        total += object["energy"][m
[32m+[m
[32m+[m[32m    return yearly_energies, total[m
[32m+[m
[32m+[m
 if __name__ == "__main__":[m
 [m
     """[m
[36m@@ -276,7 +365,7 @@[m [mif __name__ == "__main__":[m
     # Convert the W/m^ to kWh based on the hours from sunlight[m
     radiation = 364.5896911621094  # in W/m^2[m
 [m
[31m-    area = 10  # in square metres, rought estimate[m
[32m+[m[32m    area = 10  # in square metres, rough estimate[m
     # Getting the hours estimation, and we'll use the peak hours[m
     hours = get_sunlight_hours(lat, 29, "OCT")[m
 [m
[1mdiff --git a/api/app/lib/future.py b/api/app/lib/future.py[m
[1mnew file mode 100644[m
[1mindex 0000000..056c512[m
[1m--- /dev/null[m
[1m+++ b/api/app/lib/future.py[m
[36m@@ -0,0 +1,68 @@[m
[32m+[m[32mfrom datetime import datetime[m
[32m+[m
[32m+[m[32m# Custom[m
[32m+[m[32mfrom .dataset import get_model_files, fetch_model[m
[32m+[m
[32m+[m[32mFILE_NAMES = get_model_files()[m
[32m+[m[32mLOCATIONS = [(float(i.split("_")[0]), float(i.split("_")[1])) for i in FILE_NAMES][m
[32m+[m
[32m+[m[32m# DON'T CHANGE, START DATE[m
[32m+[m[32mREFERENCE_DATE = datetime(2024, 8, 1)[m
[32m+[m
[32m+[m[32m"""[m
[32m+[m[32mUtilities[m
[32m+[m[32m"""[m
[32m+[m
[32m+[m
[32m+[m[32mdef find_closest_point(locations, latitude, longitude):[m
[32m+[m[32m    min_distance = float("inf")[m
[32m+[m[32m    closest_point = None[m
[32m+[m
[32m+[m[32m    for x, y in locations:[m
[32m+[m[32m        distance = (x - latitude) ** 2 + (y - longitude) ** 2[m
[32m+[m[32m        if distance < min_distance**2:[m
[32m+[m[32m            min_distance = distance[m
[32m+[m[32m            closest_point = (x, y)[m
[32m+[m
[32m+[m[32m    return closest_point[m
[32m+[m
[32m+[m
[32m+[m[32mdef months_from_august_2024(target_date):[m
[32m+[m[32m    # Constants for now[m
[32m+[m
[32m+[m[32m    # target_date = datetime.strptime(target_date, "%Y-%m-%d")[m
[32m+[m[32m    target_date = datetime.strptime(target_date, "%Y-%m-%d")[m
[32m+[m
[32m+[m[32m    year_diff = target_date.year - REFERENCE_DATE.year[m
[32m+[m[32m    month_diff = target_date.month - REFERENCE_DATE.month[m
[32m+[m
[32m+[m[32m    total_months = year_diff * 12 + month_diff[m
[32m+[m[32m    return total_months[m
[32m+[m
[32m+[m
[32m+[m[32mdef predict_SDL(file_name, date):[m
[32m+[m[32m    month_diff = months_from_august_2024(date)[m
[32m+[m[32m    loaded_model = fetch_model(file_name)[m
[32m+[m[32m    SDL = loaded_model.forecast(steps=month_diff)[m
[32m+[m[32m    return SDL.tolist()[m
[32m+[m
[32m+[m
[32m+[m[32m# Main function to be called[m
[32m+[m[32mdef calculate_SDL(latitude, longitude, date):[m
[32m+[m[32m    file_name = "_".join([m
[32m+[m[32m        [str(i) for i in find_closest_point(LOCATIONS, latitude, longitude)][m
[32m+[m[32m    )[m
[32m+[m[32m    SDL = predict_SDL(file_name, date)[m
[32m+[m[32m    return SDL[m
[32m+[m
[32m+[m
[32m+[m[32m"""[m
[32m+[m[32mCalculates SDL by prediction[m
[32m+[m[32m"""[m
[32m+[m
[32m+[m
[32m+[m[32mdef predict_SDL(file_name, date):[m
[32m+[m[32m    month_diff = months_from_august_2024(date)[m
[32m+[m[32m    loaded_model = fetch_model(file_name)[m
[32m+[m[32m    SDL = loaded_model.forecast(steps=month_diff)[m
[32m+[m[32m    return SDL.tolist()[m
[1mdiff --git a/api/app/routes/data.py b/api/app/routes/data.py[m
[1mindex c52a70f..db57cd3 100644[m
[1m--- a/api/app/routes/data.py[m
[1m+++ b/api/app/routes/data.py[m
[36m@@ -2,7 +2,7 @@[m [mfrom flask import Blueprint, request[m
 [m
 # Custom modules[m
 from app.lib.dataset import NetCDFExtractor, NetCDFRetriever[m
[31m-from app.lib.energy import get_estimated_energy[m
[32m+[m[32mfrom app.lib.energy import get_estimated_energy, get_estimated_energy_by_year[m
 from app.utils.validators import get_or_none[m
 from app.utils.dates import get_current_year[m
 [m
[36m@@ -59,11 +59,11 @@[m [mdef get_energy():[m
     json = request.get_json()[m
 [m
     # Get the required values[m
[31m-    month = get_or_none(json, "month")[m
     lat = get_or_none(json, "lat")[m
     lon = get_or_none(json, "lon")[m
     area = get_or_none(json, "area")[m
     efficiency = get_or_none(json, "efficiency")[m
[32m+[m[32m    month = get_or_none(json, "month")[m
 [m
     try:[m
         energy, total = get_estimated_energy(lat, lon, area, efficiency, month)[m
[36m@@ -75,3 +75,31 @@[m [mdef get_energy():[m
     return Success([m
         msg="energy for the year", payload={"months": energy, "total": total}[m
     ).response[m
[32m+[m
[32m+[m
[32m+[m[32m@data_bp.route("/energy/predict", methods=["POST"])[m
[32m+[m[32mdef get_energy_prediction():[m
[32m+[m[32m    """[m
[32m+[m[32m    Returns the prediction for generation of energy by the panels[m
[32m+[m[32m    """[m
[32m+[m[32m    json = request.get_json()[m
[32m+[m
[32m+[m[32m    # Get the required values[m
[32m+[m[32m    lat = get_or_none(json, "lat")[m
[32m+[m[32m    lon = get_or_none(json, "lon")[m
[32m+[m[32m    area = get_or_none(json, "area")[m
[32m+[m[32m    efficiency = get_or_none(json, "efficiency")[m
[32m+[m[32m    to_year = get_or_none(json, "to_year")[m
[32m+[m
[32m+[m[32m    try:[m
[32m+[m[32m        energy, total = get_estimated_energy_by_year([m
[32m+[m[32m            lat, lon, area, to_year, efficiency[m
[32m+[m[32m        )[m
[32m+[m[32m    except Exception as e:[m
[32m+[m[32m        return APIBaseException([m
[32m+[m[32m            msg="Internal Server error", code=500, payload={"error": str(e)}[m
[32m+[m[32m        ).response[m
[32m+[m
[32m+[m[32m    return Success([m
[32m+[m[32m        msg="energy for the year", payload={"months": energy, "total": total}[m
[32m+[m[32m    ).response[m
[1mdiff --git a/api/app/static/models/10.125_70.125 b/api/app/static/models/10.125_70.125[m
[1mnew file mode 100644[m
[1mindex 0000000..962f075[m
Binary files /dev/null and b/api/app/static/models/10.125_70.125 differ
[1mdiff --git a/api/app/static/models/10.375_70.375 b/api/app/static/models/10.375_70.375[m
[1mnew file mode 100644[m
[1mindex 0000000..e8f996c[m
Binary files /dev/null and b/api/app/static/models/10.375_70.375 differ
[1mdiff --git a/api/app/static/models/10.625_70.625 b/api/app/static/models/10.625_70.625[m
[1mnew file mode 100644[m
[1mindex 0000000..e81f96d[m
Binary files /dev/null and b/api/app/static/models/10.625_70.625 differ
[1mdiff --git a/api/app/static/models/10.875_70.875 b/api/app/static/models/10.875_70.875[m
[1mnew file mode 100644[m
[1mindex 0000000..be2c986[m
Binary files /dev/null and b/api/app/static/models/10.875_70.875 differ
[1mdiff --git a/api/app/static/models/11.125_71.125 b/api/app/static/models/11.125_71.125[m
[1mnew file mode 100644[m
[1mindex 0000000..9eaf64a[m
Binary files /dev/null and b/api/app/static/models/11.125_71.125 differ
[1mdiff --git a/api/app/static/models/11.375_71.375 b/api/app/static/models/11.375_71.375[m
[1mnew file mode 100644[m
[1mindex 0000000..f3d6ebc[m
Binary files /dev/null and b/api/app/static/models/11.375_71.375 differ
[1mdiff --git a/api/app/static/models/11.625_71.625 b/api/app/static/models/11.625_71.625[m
[1mnew file mode 100644[m
[1mindex 0000000..42601a6[m
Binary files /dev/null and b/api/app/static/models/11.625_71.625 differ
[1mdiff --git a/api/app/static/models/11.875_71.875 b/api/app/static/models/11.875_71.875[m
[1mnew file mode 100644[m
[1mindex 0000000..174ffbf[m
Binary files /dev/null and b/api/app/static/models/11.875_71.875 differ
[1mdiff --git a/api/app/static/models/12.125_72.125 b/api/app/static/models/12.125_72.125[m
[1mnew file mode 100644[m
[1mindex 0000000..b2e477a[m
Binary files /dev/null and b/api/app/static/models/12.125_72.125 differ
[1mdiff --git a/api/app/static/models/12.375_72.375 b/api/app/static/models/12.375_72.375[m
[1mnew file mode 100644[m
[1mindex 0000000..f36820a[m
Binary files /dev/null and b/api/app/static/models/12.375_72.375 differ
[1mdiff --git a/api/app/static/models/12.625_72.625 b/api/app/static/models/12.625_72.625[m
[1mnew file mode 100644[m
[1mindex 0000000..c94d657[m
Binary files /dev/null and b/api/app/static/models/12.625_72.625 differ
[1mdiff --git a/api/app/static/models/12.875_72.875 b/api/app/static/models/12.875_72.875[m
[1mnew file mode 100644[m
[1mindex 0000000..4f0929e[m
Binary files /dev/null and b/api/app/static/models/12.875_72.875 differ
[1mdiff --git a/api/app/static/models/13.125_73.125 b/api/app/static/models/13.125_73.125[m
[1mnew file mode 100644[m
[1mindex 0000000..610766c[m
Binary files /dev/null and b/api/app/static/models/13.125_73.125 differ
[1mdiff --git a/api/app/static/models/13.375_73.375 b/api/app/static/models/13.375_73.375[m
[1mnew file mode 100644[m
[1mindex 0000000..f73f4bc[m
Binary files /dev/null and b/api/app/static/models/13.375_73.375 differ
[1mdiff --git a/api/app/static/models/13.625_73.625 b/api/app/static/models/13.625_73.625[m
[1mnew file mode 100644[m
[1mindex 0000000..1d263d1[m
Binary files /dev/null and b/api/app/static/models/13.625_73.625 differ
[1mdiff --git a/api/app/static/models/13.875_73.875 b/api/app/static/models/13.875_73.875[m
[1mnew file mode 100644[m
[1mindex 0000000..a48d862[m
Binary files /dev/null and b/api/app/static/models/13.875_73.875 differ
[1mdiff --git a/api/app/static/models/14.125_74.125 b/api/app/static/models/14.125_74.125[m
[1mnew file mode 100644[m
[1mindex 0000000..0df0c79[m
Binary files /dev/null and b/api/app/static/models/14.125_74.125 differ
[1mdiff --git a/api/app/static/models/14.375_74.375 b/api/app/static/models/14.375_74.375[m
[1mnew file mode 100644[m
[1mindex 0000000..a1a85a3[m
Binary files /dev/null and b/api/app/static/models/14.375_74.375 differ
[1mdiff --git a/api/app/static/models/14.625_74.625 b/api/app/static/models/14.625_74.625[m
[1mnew file mode 100644[m
[1mindex 0000000..74e7e5d[m
Binary files /dev/null and b/api/app/static/models/14.625_74.625 differ
[1mdiff --git a/api/app/static/models/14.875_74.875 b/api/app/static/models/14.875_74.875[m
[1mnew file mode 100644[m
[1mindex 0000000..9ab718e[m
Binary files /dev/null and b/api/app/static/models/14.875_74.875 differ
[1mdiff --git a/api/app/static/models/15.125_75.125 b/api/app/static/models/15.125_75.125[m
[1mnew file mode 100644[m
[1mindex 0000000..05e1a28[m
Binary files /dev/null and b/api/app/static/models/15.125_75.125 differ
[1mdiff --git a/api/app/static/models/15.375_75.375 b/api/app/static/models/15.375_75.375[m
[1mnew file mode 100644[m
[1mindex 0000000..84e8aeb[m
Binary files /dev/null and b/api/app/static/models/15.375_75.375 differ
[1mdiff --git a/api/app/static/models/15.625_75.625 b/api/app/static/models/15.625_75.625[m
[1mnew file mode 100644[m
[1mindex 0000000..12463bd[m
Binary files /dev/null and b/api/app/static/models/15.625_75.625 differ
[1mdiff --git a/api/app/static/models/15.875_75.875 b/api/app/static/models/15.875_75.875[m
[1mnew file mode 100644[m
[1mindex 0000000..49f6f21[m
Binary files /dev/null and b/api/app/static/models/15.875_75.875 differ
[1mdiff --git a/api/app/static/models/16.125_76.125 b/api/app/static/models/16.125_76.125[m
[1mnew file mode 100644[m
[1mindex 0000000..3c224e9[m
Binary files /dev/null and b/api/app/static/models/16.125_76.125 differ
[1mdiff --git a/api/app/static/models/16.375_76.375 b/api/app/static/models/16.375_76.375[m
[1mnew file mode 100644[m
[1mindex 0000000..bb62dcd[m
Binary files /dev/null and b/api/app/static/models/16.375_76.375 differ
[1mdiff --git a/api/app/static/models/16.625_76.625 b/api/app/static/models/16.625_76.625[m
[1mnew file mode 100644[m
[1mindex 0000000..e0ca831[m
Binary files /dev/null and b/api/app/static/models/16.625_76.625 differ
[1mdiff --git a/api/app/static/models/16.875_76.875 b/api/app/static/models/16.875_76.875[m
[1mnew file mode 100644[m
[1mindex 0000000..d7dac7d[m
Binary files /dev/null and b/api/app/static/models/16.875_76.875 differ
[1mdiff --git a/api/app/static/models/17.125_77.125 b/api/app/static/models/17.125_77.125[m
[1mnew file mode 100644[m
[1mindex 0000000..4e9f08c[m
Binary files /dev/null and b/api/app/static/models/17.125_77.125 differ
[1mdiff --git a/api/app/static/models/17.375_77.375 b/api/app/static/models/17.375_77.375[m
[1mnew file mode 100644[m
[1mindex 0000000..b0426bf[m
Binary files /dev/null and b/api/app/static/models/17.375_77.375 differ
[1mdiff --git a/api/app/static/models/17.625_77.625 b/api/app/static/models/17.625_77.625[m
[1mnew file mode 100644[m
[1mindex 0000000..9e6c0e3[m
Binary files /dev/null and b/api/app/static/models/17.625_77.625 differ
[1mdiff --git a/api/app/static/models/17.875_77.875 b/api/app/static/models/17.875_77.875[m
[1mnew file mode 100644[m
[1mindex 0000000..85bd195[m
Binary files /dev/null and b/api/app/static/models/17.875_77.875 differ
[1mdiff --git a/api/app/static/models/18.125_78.125 b/api/app/static/models/18.125_78.125[m
[1mnew file mode 100644[m
[1mindex 0000000..ee3112c[m
Binary files /dev/null and b/api/app/static/models/18.125_78.125 differ
[1mdiff --git a/api/app/static/models/18.375_78.375 b/api/app/static/models/18.375_78.375[m
[1mnew file mode 100644[m
[1mindex 0000000..635e802[m
Binary files /dev/null and b/api/app/static/models/18.375_78.375 differ
[1mdiff --git a/api/app/static/models/18.625_78.625 b/api/app/static/models/18.625_78.625[m
[1mnew file mode 100644[m
[1mindex 0000000..164faad[m
Binary files /dev/null and b/api/app/static/models/18.625_78.625 differ
[1mdiff --git a/api/app/static/models/18.875_78.875 b/api/app/static/models/18.875_78.875[m
[1mnew file mode 100644[m
[1mindex 0000000..3fe271d[m
Binary files /dev/null and b/api/app/static/models/18.875_78.875 differ
[1mdiff --git a/api/app/static/models/19.125_79.125 b/api/app/static/models/19.125_79.125[m
[1mnew file mode 100644[m
[1mindex 0000000..390afbd[m
Binary files /dev/null and b/api/app/static/models/19.125_79.125 differ
[1mdiff --git a/api/app/static/models/19.375_79.375 b/api/app/static/models/19.375_79.375[m
[1mnew file mode 100644[m
[1mindex 0000000..463d5af[m
Binary files /dev/null and b/api/app/static/models/19.375_79.375 differ
[1mdiff --git a/api/app/static/models/19.625_79.625 b/api/app/static/models/19.625_79.625[m
[1mnew file mode 100644[m
[1mindex 0000000..fff27f7[m
Binary files /dev/null and b/api/app/static/models/19.625_79.625 differ
[1mdiff --git a/api/app/static/models/19.875_79.875 b/api/app/static/models/19.875_79.875[m
[1mnew file mode 100644[m
[1mindex 0000000..5128bfa[m
Binary files /dev/null and b/api/app/static/models/19.875_79.875 differ
[1mdiff --git a/api/app/static/models/20.125_80.125 b/api/app/static/models/20.125_80.125[m
[1mnew file mode 100644[m
[1mindex 0000000..67678cf[m
Binary files /dev/null and b/api/app/static/models/20.125_80.