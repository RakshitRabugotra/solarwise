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
  years: {
    [key: string]: {
      energy: number
      month: string
      order: number
      peakSunlightHours: number
      radiation: number
      year: number
    }[]
  }
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
    [key: string]: {
      energy: number
      month: string
      order: number
      peakSunlightHours: number
      radiation: number
      year: number
    }[]
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
  breakEven: { amount: number; unit: "year" | string }
}
