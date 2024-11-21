# SolarWise Backend API Documentation

## Overview

### Endpoints

**Data Routes**

### 1. `/api/data/sdlr`

### Endpoint

`POST /api/data/sdlr`

### Description

This API endpoint calculates and returns the Solar Diffuse-to-Global Radiation (SDLR) for a given geographic location (latitude and longitude) for a specified year.

### Request Body

The request must include the following parameters in JSON format:

| Field  | Type  | Description                                                                                   | Example     |
| ------ | ----- | --------------------------------------------------------------------------------------------- | ----------- |
| `year` | int   | The year for which the SDLR data is requested (defaults to the current year if not provided). | `2023`      |
| `lat`  | float | The latitude of the location for which SDLR is to be calculated.                              | `28.676226` |
| `lon`  | float | The longitude of the location for which SDLR is to be calculated.                             | `77.202619` |

#### Example Request Body:

```json
{
  "year": 2023,
  "lat": 28.676226,
  "lon": 77.202619
}
```

### Response

The response will return a JSON object containing the SDLR data for each month of the requested year.

#### Fields in the Response:

- `code`: The HTTP status code (200 indicates success).
- `msg`: A descriptive message about the request status.
- `payload`: Contains the SDLR data, including:
  - `year`: The year for which the SDLR data was retrieved.
  - `sdlr`: An array of objects representing the SDLR value for each month of the year.
- `raw_msg`: A raw version of the message, identical to `msg`.

#### Fields in the `sdlr` Array:

Each object in the `sdlr` array will contain the following fields:

- `month`: The name of the month.
- `order`: The order number of the month (starting from 0 for January).
- `sdlr`: The calculated Solar Diffuse-to-Global Radiation (SDLR) for the month.

#### Example Response Body:

```json
{
  "code": 200,
  "msg": "found SDLR data",
  "payload": {
    "year": 2023,
    "sdlr": [
      {
        "month": "January",
        "order": 0,
        "sdlr": 304.29290771484375
      },
      {
        "month": "February",
        "order": 1,
        "sdlr": 314.4196472167969
      },
      {
        "month": "March",
        "order": 2,
        "sdlr": 354.6959228515625
      },
      {
        "month": "April",
        "order": 3,
        "sdlr": 361.6449279785156
      },
      {
        "month": "May",
        "order": 4,
        "sdlr": 390.5420837402344
      },
      {
        "month": "June",
        "order": 5,
        "sdlr": 431.8319091796875
      },
      {
        "month": "July",
        "order": 6,
        "sdlr": 444.89727783203125
      },
      {
        "month": "August",
        "order": 7,
        "sdlr": 436.0389404296875
      },
      {
        "month": "September",
        "order": 8,
        "sdlr": 421.92901611328125
      },
      {
        "month": "October",
        "order": 9,
        "sdlr": 364.5896911621094
      },
      {
        "month": "November",
        "order": 10,
        "sdlr": 344.9591369628906
      },
      {
        "month": "December",
        "order": 11,
        "sdlr": 308.9911193847656
      }
    ]
  },
  "raw_msg": "found SDLR data"
}
```

### Error Handling

In case of errors, such as missing or invalid required parameters (`lat` or `lon`), the API will respond with a `400 Bad Request` status code and an error message:

#### Example Error Response:

```json
{
  "code": 400,
  "msg": "The data [lat, or lon] is null",
  "raw_msg": "The data [lat, or lon] is null"
}
```

### Notes

- The `year` parameter is optional. If not provided, the current year will be used.
- The `lat` and `lon` parameters are mandatory. If either of them is missing, a `400 Bad Request` error will be returned.
- The `sdlr` values represent the Solar Diffuse-to-Global Radiation ratio for each month, which can be useful for assessing solar energy potential at a given location.

<br/>

# 2. `/api/data/energy/predict`

### Endpoint

`POST /energy/predict`

### Description

This API endpoint calculates and returns the predicted energy generation for solar panels based on geographical location, area, efficiency, and target year.

### Request Body

The request must include the following parameters in JSON format:

| Field        | Type  | Description                                          | Example     |
| ------------ | ----- | ---------------------------------------------------- | ----------- |
| `lat`        | float | The latitude of the location for energy prediction.  | `28.670076` |
| `lon`        | float | The longitude of the location for energy prediction. | `77.203393` |
| `area`       | float | The area (in square meters) of the solar panels.     | `10`        |
| `efficiency` | float | The efficiency of the solar panels (optional).       | `0.18`      |
| `to_year`    | int   | The target year for the prediction.                  | `2026`      |

#### Example Request Body:

```json
{
  "lat": 28.670076,
  "lon": 77.203393,
  "to_year": 2026,
  "area": 10
}
```

## Response

The response will return a JSON object containing the prediction of energy generated by the solar panels for each month of the specified year, along with the total energy generated for the year.

### Fields in the Response:

- `code`: The HTTP status code (200 indicates success).
- `msg`: A descriptive message about the request status.
- `payload`: The energy data for each month, including:
  - `months`: An array containing the energy prediction for each month.
  - `total`: The total energy predicted for the entire year.
- `raw_msg`: A raw version of the message, identical to `msg`.

#### Energy Prediction for Each Month:

Each month in the `months` array will contain the following fields:

- `energy`: The estimated energy (in kWh) generated by the solar panels.
- `month`: The name of the month.
- `order`: The order number of the month (starting from 0 for January).
- `peak-sunlight-hours`: The average number of peak sunlight hours for the month.
- `radiation`: The total radiation in the region for the given month.
- `year`: The year of the prediction.

### Example Response Body:

```json
{
  "code": 200,
  "msg": "energy for the year",
  "payload": {
    "months": [
      {
        "energy": 208.53659320713197,
        "month": "SEP",
        "order": 0,
        "peak-sunlight-hours": 4.391420374628208,
        "radiation": 425.8948557862693,
        "year": 2024
      },
      {
        "energy": 200.95531154085944,
        "month": "OCT",
        "order": 1,
        "peak-sunlight-hours": 4.087260440332602,
        "radiation": 426.72871835697833,
        "year": 2024
      },
      {
        "energy": 182.75637901997814,
        "month": "NOV",
        "order": 2,
        "peak-sunlight-hours": 3.8188970871530126,
        "radiation": 429.2000089162479,
        "year": 2024
      },
      {
        "energy": 5790.772482461871,
        "month": "DEC",
        "order": 27,
        "peak-sunlight-hours": 3.676618690374464,
        "radiation": 429.78952280371186,
        "year": 2026
      }
    ],
    "total": 5790.772482461871
  },
  "raw_msg": "energy for the year"
}
```

### Error Handling

In case of errors, such as missing or invalid required parameters (`lat`, `lon`, `area`, or `to_year`), the API will respond with a `400 Bad Request` status code and an error message:

#### Example Error Response:

```json
{
  "code": 400,
  "msg": "The data [lat, lon, area, or to_year] is null",
  "raw_msg": "The data [lat, lon, area, or to_year] is null"
}
```

### Notes

- The `efficiency` parameter is optional. If not provided, a default value will be used for the energy calculation.
- The `to_year` parameter is mandatory and should be a valid future year for energy prediction.
- The endpoint is designed to handle solar panel energy predictions for future years, considering factors like peak sunlight hours and radiation for each month.

<br/>

# 3. `/api/data/energy/break-even`

## Endpoint

`POST /api/data/energy/break-even`

## Description

This API calculates the break-even point for solar panel installation, where the cumulative savings from electricity generation match or exceed the installation costs.

## Request Body

Provide the following parameters in the request body (JSON format):

| Parameter            | Type    | Description                                   | Required |
| -------------------- | ------- | --------------------------------------------- | -------- |
| `lat`                | float   | Latitude of the installation site.            | Yes      |
| `lon`                | float   | Longitude of the installation site.           | Yes      |
| `area`               | float   | Panel area in square meters.                  | Yes      |
| `efficiency`         | float   | Efficiency of the solar panel (0 to 1).       | Yes      |
| `costToUnit`         | float   | Cost per unit of electricity (currency/unit). | Yes      |
| `costToInstallation` | float   | Total installation cost (currency).           | Yes      |
| `adjustInflation`    | boolean | Adjust costs for inflation.                   | No       |

### Example Request

```json
{
  "lat": 28.670076,
  "lon": 77.203393,
  "area": 20,
  "efficiency": 0.223,
  "costToUnit": 7,
  "costToInstallation": 150000,
  "adjustInflation": true
}
```

---

## Response Body

The response contains the break-even year and detailed data for energy production and costs.

| Field                                          | Type    | Description                                                |
| ---------------------------------------------- | ------- | ---------------------------------------------------------- |
| `code`                                         | integer | HTTP response code.                                        |
| `msg`                                          | string  | Status message.                                            |
| `payload.adjustedCostToInstallation.amount`    | float   | Installation cost adjusted for inflation.                  |
| `payload.adjustedCostToInstallation.formatted` | string  | Formatted installation cost.                               |
| `payload.adjustedCostToUnit.amount`            | float   | Cost per unit of electricity adjusted for inflation.       |
| `payload.adjustedCostToUnit.formatted`         | string  | Formatted cost per unit.                                   |
| `payload.break_even.amount`                    | integer | Number of years to break even.                             |
| `payload.break_even.unit`                      | string  | Unit for break-even time (`year`).                         |
| `payload.total`                                | float   | Total energy produced over the break-even period.          |
| `payload.years`                                | object  | Detailed breakdown of energy production by month and year. |

### Example Response

```json
{
  "code": 200,
  "msg": "Found break even point for the data",
  "payload": {
    "adjustedCostToInstallation": {
      "amount": 202730.13204679682,
      "formatted": "₹ 2,02,730.13"
    },
    "adjustedCostToUnit": {
      "amount": 9.127061152967089,
      "formatted": "₹ 9.13"
    },
    "break_even": {
      "amount": 5,
      "unit": "year"
    },
    "total": 26761.92128124336,
    "years": {
      "2024": [
        {
          "energy": 417.07318641426394,
          "month": "SEP",
          "order": 0,
          "peak-sunlight-hours": 4.391420374628208,
          "radiation": 425.8948557862693,
          "year": 2024
        },
        ...
      ]
    }
  }
}
```

---

## Error Handling

The API returns the following error responses for invalid requests:

- **400 Bad Request**: Missing or invalid required parameters.
  ```json
  {
    "code": 400,
    "msg": "The data [lat, lon, or area] is null"
  }
  ```
- **500 Internal Server Error**: No break-even point could be calculated.
  ```json
  {
    "code": 500,
    "msg": "No break even point found for the given parameters"
  }
  ```

---

## Notes

- The break-even year is calculated using inflation-adjusted cost values when `adjustInflation` is set to `true`.
- For detailed monthly data, refer to the `years` field in the response payload.
