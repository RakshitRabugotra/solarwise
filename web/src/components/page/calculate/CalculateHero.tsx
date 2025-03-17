"use client"

import CalculateForm, {
  CalculateFormProps,
} from "@/components/component/savings/common/CalculateForm"
import { calculateAction, calculateBreakEven } from "@/service"
import {
  BaseAPIRequestBody,
  BreakEventPointEstimation,
  EnergyEstimation,
} from "@/types"
import dynamic from "next/dynamic"
import { useCallback, useEffect, useState } from "react"

// Dynamic Imports
const Map = dynamic(() => import("@/components/component/Map"), {
  loading: () => (
    <div className="h-full w-full basis-full animate-pulse rounded-lg bg-gray-300 md:basis-2/3"></div>
  ),
  ssr: false,
})

export interface CalculateHeroProps {
  // Data fulfillment events
  onEnergyEstimation: (energyEstimates: EnergyEstimation) => void
  onBreakEvenEstimation: (breakEven: BreakEventPointEstimation) => void
  // Request events
  onRequestInit?: () => void
  onRequestEnd?: () => void
  onRequestError?: (error :Error) => void
}

export default function CalculateHero({
  onEnergyEstimation,
  onBreakEvenEstimation,
  onRequestInit,
  onRequestEnd,
  onRequestError
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
    onRequestInit && onRequestInit();
    // Request for all the things
    Promise.all([fetchPrediction(config), fetchBreakEven(config)])
    .then(([energyEstimates, breakEvenData]) => {
      // Fulfill the callbacks
      if(!energyEstimates || energyEstimates instanceof Error) {
        return Promise.reject("Couldn't get energy estimate" + energyEstimates)
      } 
      // Check the promise for other
      if(!breakEvenData || breakEvenData instanceof Error) {
        return Promise.reject("Couldn't get break even estimate" + breakEvenData)
      }
      // Call the callbacks :)
      onEnergyEstimation(energyEstimates)
      onBreakEvenEstimation(breakEvenData);
    })
    .catch(error => onRequestError && onRequestError(error))
    .finally(() => onRequestEnd && onRequestEnd())
  }

  // The big hero section
  return (
    <section className="flex h-screen flex-col items-stretch md:flex-row md:justify-between">
      <Map className="basis-full md:basis-2/3" />

      <div className="flex w-full basis-full flex-col items-center justify-center md:basis-1/3 md:px-10">
        <ConfigForm onSubmit={onSubmit} />
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

  return <CalculateForm onConfigChange={onConfigChange} />
}
