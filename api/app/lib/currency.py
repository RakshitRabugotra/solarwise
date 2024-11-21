import locale

locale.setlocale(locale.LC_ALL, "")

# The inflation rates
INFLATION_CURRENCY_RATE = 6.21
INFLATION_ELECTRICITY_RATE = 5.45

# The currency formatter
format_currency = lambda string: locale.currency(string, grouping=True)


def inflation_adjusted_amount(P, R, T):
    # Calculate the inflation-adjusted amount
    A = P * (1 + R / 100) ** T
    return A
