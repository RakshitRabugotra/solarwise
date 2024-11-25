export interface APIResponse<T> {
  code: number
  msg: string
  payload: T
  raw_msg: string
}

export interface BaseAPIRequestBody {
  lat: number
  lon: number
  area: number
  efficiency?: number
  to_year?: number
  [key: string]: any | undefined
}

export interface EnergyEstimation {
  months: {
    radiation: number
    order: number
    year: number
    month: string
    energy: number
    "peak-sunlight-hours": number
  }[]
  greenFactor: {
    trees: number
    carbonEmission: {
      co2Emissions: {
        amount: number
        unit: string
      }
    }
    factors: {
      carbonAbsorption: number
      emissionFactor: {
        amount: number
        unit: string
      }
    }
  }
  total: number
}

export interface BreakEventPointEstimation {
  years: {
    [key: string]: EnergyEstimation[]
  }
  total: number
  energyInCost: {
    formatted: string
    amount: number
  }
  adjustedCostToInstallation: {
    formatted: string
    amount: number
  }
  adjustedCostToUnit: {
    formatted: string
    amount: number
  }
  break_even: { amount: number; unit: "year" }
}
