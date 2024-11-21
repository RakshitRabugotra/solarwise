from flask import Blueprint, request
from datetime import datetime
import math

# Custom modules
from app.lib.dataset import NetCDFExtractor, NetCDFRetriever
from app.lib.energy import get_estimated_energy_by_year
from app.utils.validators import get_or_none
from app.utils.dates import get_current_year
from app.lib.num_methods import find_first

# For currency related operations
from app.lib.currency import (
    format_currency,
    INFLATION_CURRENCY_RATE,
    INFLATION_ELECTRICITY_RATE,
    inflation_adjusted_amount,
)

# Custom Responses
from app.utils.responses import APIBaseException, BadRequestException, Success

"""
The APIs for accessing data portal
"""
data_bp = Blueprint("data", __name__)


@data_bp.route("/sdlr", methods=["POST"])
def get_sdlr():
    """
    Returns the SDLR for the given lat, lon
    """
    json = request.get_json()

    # Get the required values
    year = get_or_none(json, "year", default=get_current_year())
    lat = get_or_none(json, "lat")
    lon = get_or_none(json, "lon")

    # Check if any of the above required are none
    check_list = [lat, lon]
    try:
        assert all(val is not None for val in check_list)
    except AssertionError:
        return BadRequestException("The data [lat, or lon] is null").response

    # Run through the extractor
    retriever = NetCDFRetriever()

    files = None
    try:
        # get the files, !throws exception
        files = retriever.retrieve(year)
    except Exception as e:
        return BadRequestException(msg=str(e)).response

    # Get the date for the files
    sdlr_data = None
    try:
        sdlr_data = NetCDFExtractor.get_sdlr(files, lat, lon)
    except Exception as e:
        return APIBaseException(
            msg="Internal Server error", code=500, payload={"error": str(e)}
        ).response

    return Success(
        msg="found SDLR data", payload={"year": year, "sdlr": sdlr_data}
    ).response


@data_bp.route("/energy/predict", methods=["POST"])
def get_energy_prediction():
    """
    Returns the prediction for generation of energy by the panels
    """
    json = request.get_json()

    # Get the required values
    lat = get_or_none(json, "lat")
    lon = get_or_none(json, "lon")
    area = get_or_none(json, "area")
    efficiency = get_or_none(json, "efficiency")
    to_year = get_or_none(json, "to_year")

    # Check if any of the above required are none
    check_list = [lat, lon, area, to_year]
    try:
        assert all(val is not None for val in check_list)
    except AssertionError:
        return BadRequestException(
            "The data [lat, lon, area, or to_year] is null"
        ).response

    try:
        energies_by_month, total_energy = get_estimated_energy_by_year(
            lat, lon, area, to_year, efficiency
        )
    except Exception as e:
        return APIBaseException(
            msg="Internal Server error", code=500, payload={"error": str(e)}
        ).response

    return Success(
        msg="energy for the year",
        payload={"months": energies_by_month, "total": total_energy},
    ).response


@data_bp.route("/energy/break-even", methods=["POST"])
def get_breakeven_point():
    """
    Returns the break even point where the cost of electricity generated
    outweighs the cost of installation of the panel
    """
    json = request.get_json()

    # Get the required values
    lat = get_or_none(json, "lat")
    lon = get_or_none(json, "lon")
    area = get_or_none(json, "area")
    efficiency = get_or_none(json, "efficiency")

    # Check if any of the above required are none
    check_list = [lat, lon, area]
    try:
        assert all(val is not None for val in check_list)
    except AssertionError:
        return BadRequestException("The data [lat, lon, or area] is null").response

    # The cost of energy unit and installation of panel
    cost_to_unit = get_or_none(json, "costToUnit")
    cost_to_installation = get_or_none(json, "costToInstallation")

    # The other parameters (for inflation)
    adjust_inflation = get_or_none(json, "adjustInflation") or False

    # Check if any of the required values are None
    check_list = [cost_to_unit, cost_to_installation, adjust_inflation]
    try:
        assert all(val is not None for val in check_list)
    except AssertionError:
        return BadRequestException(
            "The data [cost_to_unit, cost_to_installation, or adjust_inflation] is null"
        ).response

    # Convert the query to optimization problem on a time function
    # The function will give the difference in amount of energy generation and installation cost
    # for a particular year

    # Functions to adjust for inflation

    # Cost of installation of the panel
    adjusted_installation_amount = lambda year: (
        inflation_adjusted_amount(
            cost_to_installation, INFLATION_CURRENCY_RATE, math.ceil(year)
        )
        if adjust_inflation
        else cost_to_installation
    )

    # Cost per unit for electricity
    adjusted_cost_to_unit = lambda year: (
        inflation_adjusted_amount(
            cost_to_unit, INFLATION_ELECTRICITY_RATE, math.ceil(year)
        )
        if adjust_inflation
        else cost_to_unit
    )

    # Start from the next year to solve for this
    start_year = datetime.now().year

    def time_function(year: int):
        year = math.ceil(year)
        # Get the estimated energy for the future year
        _, total_energy_kwh = get_estimated_energy_by_year(
            lat, lon, area, to_year=start_year + year, efficiency=efficiency
        )

        # Return the difference between the two values
        return max(
            0,
            math.ceil(
                adjusted_installation_amount(year)
                - total_energy_kwh * adjusted_cost_to_unit(year)
            ),
        )

    break_even = -1
    try:
        break_even = find_first(time_function, 0, 100)
        assert break_even != -1
    except AssertionError:
        return APIBaseException(
            "No break even point found for the given parameters", 500
        ).response

    # Return the break_even point and the data associated with it in progression
    # Generate the report for all the months till the break even year
    to_year = start_year + break_even
    energies_by_month, total = get_estimated_energy_by_year(
        lat, lon, area, to_year, efficiency
    )

    # Group the energy by year
    grouped_by_year = dict()
    for d in energies_by_month:
        t = grouped_by_year.setdefault(d["year"], [])
        t.append(d)

    # The adjusted amounts for the final year
    final_installation_amount = adjusted_installation_amount(break_even)
    final_cost_to_unit = adjusted_cost_to_unit(break_even)

    return Success(
        msg="Found break even point for the data",
        payload={
            "years": grouped_by_year,
            "total": total,
            "adjustedCostToInstallation": {
                "formatted": format_currency(final_installation_amount),
                "amount": final_installation_amount,
            },
            "adjustedCostToUnit": {
                "formatted": format_currency(final_cost_to_unit),
                "amount": final_cost_to_unit,
            },
            "break_even": {"amount": break_even, "unit": "year"},
        },
    ).response


if __name__ == "__main__":

    parameters = {"lat": 28.670076, "lon": 77.203393, "area": 10, "efficiency": 0.223}

    cost_parameters = {
        "costToUnit": 7,
        "costToInstallation": 1_50_000,
        "adjustInflation": True,
    }
