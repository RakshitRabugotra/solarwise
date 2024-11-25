import { EnergyEstimation, APIResponse, BaseAPIRequestBody, BreakEventPointEstimation } from "@/types"

const API_URI = "/api"

export interface ServiceResponse<T> {
  response: T | null
  error: Error | null
}

export const calculateAction = async (props: BaseAPIRequestBody) => {
  const result = { response: null, error: null } as ServiceResponse<
    APIResponse<EnergyEstimation>
  >
  
  try {
    // Send a request to the backend for the SDLR
    const response = await fetch(API_URI + "/data/energy/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props),
    })
    if (!response.ok) {
      result.error = new Error(await response.text())
      return result
    }
    // Get the json data
    const json = await response.json()
    // Set the response data
    result.response = json
    return result
  } catch (error) {
    console.error("Error: ", error)
    result.error = error as Error
  }
  return result
}

export const calculateBreakEven = async (props: BaseAPIRequestBody) => {
  const result = { response: null, error: null } as ServiceResponse<
    APIResponse<BreakEventPointEstimation>
  >
  
  try {
    // Send a request to the backend for the SDLR
    const response = await fetch(API_URI + "/data/energy/break-even", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props),
    })
    if (!response.ok) {
      result.error = new Error(await response.text())
      return result
    }
    // Get the json data
    const json = await response.json()
    // Set the response data
    result.response = json
    return result
  } catch (error) {
    console.error("Error: ", error)
    result.error = error as Error
  }
  return result
}

