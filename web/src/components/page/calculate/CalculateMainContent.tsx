"use client"

import { useEffect, useState } from "react"
// Custom Components
import CalculateHero from "./CalculateHero"
// Type definitions
import { BreakEventPointEstimation, EnergyEstimation } from "@/types"

import Estimation from "./visuals"

export default function CalculateMainContent() {
  const [submitStatus, setSubmitStatus] = useState<
    "unset" | "loading" | "completed"
  >("unset")

  const [energyEstimateData, setEnergyEstimateData] =
    useState<EnergyEstimation | null>(
      // samplePrediction
      null
    )
  const [breakEvenData, setBreakEvenData] =
    useState<BreakEventPointEstimation | null>(
      // sampleBreakEven
      null
    )

  useEffect(() => {
    // Scroll to the estimation section when the status is "completed"
    if (submitStatus === "completed") {
      const element = document.getElementById("estimation-section")
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  }, [submitStatus])

  // {/* The main content starts */}
  return (
    <div className="relative z-10 text-white">
      {/* Show the actual hero section */}
      <CalculateHero
        onBreakEvenEstimation={data => setBreakEvenData(data)}
        onEnergyEstimation={data => setEnergyEstimateData(data)}
        onRequestInit={() => setSubmitStatus("loading")}
        onRequestEnd={() => setSubmitStatus("completed")}
        onRequestError={() => setSubmitStatus("completed")}
        showTooltip={submitStatus === "unset"}
        toolTipText="Enter the roof area to get started"
      />

      {/* The hidden content */}
      {submitStatus === "loading" && (
        <div className="absolute inset-0 z-20 flex h-screen items-center justify-center bg-black/50">
          <Estimation.Loader />
        </div>
      )}
      {submitStatus === "unset" && (
        <div className="flex h-screen items-center justify-center bg-black">
          <div className="text-3xl font-bold text-white">
            {/* The main content */}
            <h1>Get started by entering the roof area</h1>
          </div>
        </div>
      )}

      <section id="estimation-section" className="container mx-auto bg-white">
        <Estimation.SolarEnergy
          isHidden={submitStatus === "unset"}
          isLoading={submitStatus === "loading"}
          energyEstimateData={energyEstimateData}
        />
        <Estimation.BreakEven
          isHidden={submitStatus === "unset"}
          isLoading={submitStatus === "loading"}
          breakEvenData={breakEvenData}
        />
      </section>
    </div>
  )
}
