// The configuration for the project

// Defines how many years ahead to predict
export const PREDICTION_YEAR_OFFSET = 6
// Defines till what year to predict
export const PREDICTION_TO_YEAR =
  new Date().getFullYear() + PREDICTION_YEAR_OFFSET
// Defines the cost per kWh energy from the grid
export const COST_TO_UNIT = 7
// The cost of installation of the panel
export const COST_TO_INSTALLATION = 1_50_000
// Do adjust for inflation?
export const ADJUST_FOR_INSTALLATION = false