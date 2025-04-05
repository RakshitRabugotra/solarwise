"use client"

import { useCallback } from "react"
import dynamic from "next/dynamic"

// Custom Components
import CalculateForm from "@/components/component/CalculateForm"
// Services
import { calculateAction, calculateBreakEven } from "@/service"
// Constants/Configs
import Images from "@/constants/Images"
// Type definitions
import {
  BaseAPIRequestBody,
  BreakEventPointEstimation,
  EnergyEstimation,
} from "@/types"

// Dynamic Imports
const Map = dynamic(() => import("@/components/component/Map"), {
  loading: () => (
    <div className="h-full w-full basis-full bg-black md:basis-2/3">
      <div className="h-full w-full animate-pulse bg-white/40"></div>
    </div>
  ),
  ssr: false,
})

interface CalculateHeroMiscProps {
  showTooltip?: boolean
  toolTipText?: string
}

export interface CalculateHeroProps extends CalculateHeroMiscProps {
  // Data fulfillment events
  onEnergyEstimation: (energyEstimates: EnergyEstimation) => void
  onBreakEvenEstimation: (breakEven: BreakEventPointEstimation) => void
  // Request events
  onRequestInit?: () => void
  onRequestEnd?: () => void
  onRequestError?: (error: Error) => void
}

export default function CalculateHero({
  showTooltip = false,
  toolTipText = "Enter the roof area to get started",
  onEnergyEstimation,
  onBreakEvenEstimation,
  onRequestInit,
  onRequestEnd,
  onRequestError,
}: CalculateHeroProps) {
  const fetchPrediction = useCallback(async (apiConfig: BaseAPIRequestBody) => {
    const { response, error } = await calculateAction(apiConfig)
    if (!response || error) {
      return Promise.resolve(error)
    }
    return response.payload as EnergyEstimation
  }, [])

  const fetchBreakEven = useCallback(async (apiConfig: BaseAPIRequestBody) => {
    const { response, error } = await calculateBreakEven(apiConfig)
    if (!response || error) {
      return Promise.reject(error)
    }
    return response.payload as BreakEventPointEstimation
  }, [])

  const onSubmit = (config: BaseAPIRequestBody) => {
    onRequestInit && onRequestInit()
    // Request for all the things
    Promise.all([fetchPrediction(config), fetchBreakEven(config)])
      .then(([energyEstimates, breakEvenData]) => {
        // Fulfill the callbacks
        if (!energyEstimates || energyEstimates instanceof Error) {
          return Promise.reject(
            "Couldn't get energy estimate" + energyEstimates
          )
        }
        // Check the promise for other
        if (!breakEvenData || breakEvenData instanceof Error) {
          return Promise.reject(
            "Couldn't get break even estimate" + breakEvenData
          )
        }
        // Call the callbacks :)
        onEnergyEstimation(energyEstimates)
        onBreakEvenEstimation(breakEvenData)
      })
      .catch(error => onRequestError && onRequestError(error))
      .finally(() => onRequestEnd && onRequestEnd())
  }

  // The big hero section
  return (
    <section
      className="flex h-screen flex-col items-stretch bg-cover bg-center md:flex-row md:justify-between"
      style={{ backgroundImage: `url(${Images.calculateHeroBackground})` }}
    >
      {/* The map on the left side */}
      <Map className="basis-full md:basis-2/3" />
      {/* The form on the right side */}
      <div className="relative flex w-full basis-full flex-col items-center justify-center md:basis-1/3 md:px-10">
        {/* The overlay of black color */}
        <div className="absolute inset-0 bg-black/50"></div>
        <ConfigForm onSubmit={onSubmit} />

        {/* Show the tooltip in the bottom center of this section */}
        {/* <div
          className={`absolute bottom-4 left-0 right-0 z-10 flex h-16 items-center justify-center ${
            showTooltip ? "visible block" : "invisible hidden"
          }`}
        >
          <div className="flex h-full w-full max-w-xs items-center justify-center rounded-lg bg-black p-4 text-center text-lg font-bold text-white shadow-md">
            {toolTipText}
          </div>
        </div> */}
      </div>
    </section>
  )
}

const ConfigForm = ({
  onSubmit,
}: {
  onSubmit: (config: BaseAPIRequestBody) => void
}) => {
  const onConfigChange = (config: BaseAPIRequestBody | null) => {
    if (!config) return
    return onSubmit(config)
  }

  return <CalculateForm onConfigChange={onConfigChange} className="z-10" />
}
