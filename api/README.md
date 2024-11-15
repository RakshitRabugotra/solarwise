# SolarWise Backend API Documentation

## Overview

### Endpoints

**Admin Routes**

#### 1. `/_/admin/`
- Method - GET, POST
- Description - Login Route

#### 2. `/_/admin/collections`
- Method - GET
- Description 

#### 3. `/_/admin/collections/users`
- Method - GET
- Description 

#### 4. `/_/admin/logs`
- Method - GET
- Description 

#### 5. `/_/admin/logout`
- Method - GET
- Description - Logout User

**Data Routes**

#### 1. `/api/data/sdlr`
- Method - POST
- Description - Provides SDLR data for the specified latitude and longitude for the years ranging from 1979 to 2024. (Dataset is being used.)
```Json
// Reqest BODY
{
  "lat" : 20, // Latitude of the location (in decimal degrees)
  "lon" : 88, // Longitude of the location (in decimal degrees)
  "year": 2023 // Accepts integer values only in the range from 1979 to August, 2024
}
```
```Json
// RESPONSE
{
    "code": 200,
    "msg": "found SDLR data",
    "payload": {
        "sdlr": [
            {
                "month": "January",
                "order": 0,
                "sdlr": 354.4118957519531 // Unit - Watts per metre square
            },
        ....
        ],
    "year": 2023
  },
  "raw_msg": "found SDLR data"
}
```

#### 2. `/api/data/energy`
- Method - POST
<!-- - Description -  -->

#### 3. `/api/data/energy/predict`
- Method - POST
- Description - Provides Energy consumption, peak-sunlight-hours and radiation for all the months in that year. (Uses model to do the predictions.)
```Json
// Request BODY
{
  "lat" : 20, // Accepts float values as well
  "lon" : 88, // Accepts float values as well
  "area" : 100, // Area of the solar panels (in square meters)
  "efficiency" : 0.223, // Efficiency of the solar panels (between 0 and 1). Default Value = 0.223 (22.3%)
  "to_year": 2025
}
```
```Json
// RESPONSE
{
    "code": 200,
    "msg": "energy for the year",
    "payload": {
        "months": [
            {
                "energy": 2074.022198867862, // Unit - Kilowatt hour(Kwh)
                "month": "SEP",
                "order": 0,
                "peak-sunlight-hours": 4.367532432302166, // Unit - Hours
                "radiation": 425.8948557862693, // Unit - Watts per metre square
                "year": 2024 // Accepts integer values only i.e. 2024 or onwards
            },
            ....
        ],
    "total": 32971.24704613135
  },
  "raw_msg": "energy for the year"
}
```

## Error Handling

All errors are handled internally within the routes, and appropriate responses are returned based on the exceptions encountered.

## Versioning

The API starts at version 0.0.1. No versioning system is implemented for now.
