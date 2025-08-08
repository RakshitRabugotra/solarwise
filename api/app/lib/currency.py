import locale

# The inflation rates
INFLATION_CURRENCY_RATE = 6.21
INFLATION_ELECTRICITY_RATE = 5.45


def format_currency_inr(val: str) -> str:
    # Try to cast to float, else return 0
    try:
        val = float(val)
    except ValueError:
        return "₹0.00"

    return f"₹{round(val, 2):,.2f}"


try:
    locale.setlocale(locale.LC_ALL, "en_IN.UTF-8")
    # The currency formatter
    format_currency = lambda string: locale.currency(string, grouping=True)
except locale.Error:
    # This local isn't supported so we will be using a custom
    # formatter
    format_currency = lambda string: format_currency_inr(string)


def inflation_adjusted_amount(P, R, T):
    # Calculate the inflation-adjusted amount
    A = P * (1 + R / 100) ** T
    return A
