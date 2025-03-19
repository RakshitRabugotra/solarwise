"use client"

import { useMemo, useState } from "react"
// Custom Components
import CalculateHero from "./CalculateHero"
// Constants/Configs
import Settings from "@/constants/Settings"
// Type definitions
import { BreakEventPointEstimation, EnergyEstimation } from "@/types"
import { twMerge } from "tailwind-merge"
import Estimation from "./visuals"

import samplePrediction from "@/data/sample-prediction.json"
import sampleBreakEven from "@/data/sample-break-even.json"

export default function CalculateMainContent() {
  const [submitStatus, setSubmitStatus] = useState<
    "unset" | "loading" | "completed"
  >("unset")

  const [energyEstimateData, setEnergyEstimateData] =
    useState<EnergyEstimation | null>(
      samplePrediction
      // null
    )
  const [breakEvenData, setBreakEvenData] =
    useState<BreakEventPointEstimation | null>(
      sampleBreakEven
      // null
    )

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
      />

      {/* The hidden content */}
      <Estimation.SolarEnergy
        isHidden={submitStatus !== "unset"}
        isLoading={submitStatus === "loading"}
        energyEstimateData={energyEstimateData}
      />
      <Estimation.BreakEven
        isHidden={submitStatus !== "unset"}
        isLoading={submitStatus === "loading"}
        breakEvenData={breakEvenData}
      />
    </div>
  )
}


// {/* Add the background image and overlay */}
// <div className="absolute inset-0 z-0">
// <Image
//   src={Images.calculateHeroBackground}
//   alt="background-image"
//   width={1500}
//   height={1000}
//   className="h-full w-full object-cover"
// />
// </div>
// {/* The overlay of black color */}
// <div className="absolute inset-0 z-[5] bg-black/50"></div>

// {/* The big hero section */}
// <section className="absolute inset-0 z-10 flex h-screen flex-col items-stretch md:flex-row md:justify-between">
// <Map />
// <div className="flex w-full basis-full flex-col items-center justify-center md:basis-1/3 md:px-10">
//   <CalculateForm
//     onConfigChange={data => setConfig(data)}
//     // scrollTrigger={scrollToSavings}
//   />
// </div>
// {/* <FormSection onConfigChange={data => setConfig(data)} /> */}
// </section>

// {submitStatus !== "unset" && (
// <section className="container mx-auto bg-white">
//   {submitStatus === "loading" ? (
//     loader
//   ) : (
//     <>
//       {/* <div className="mx-auto max-w-5xl p-4">
//         <EstimationCarousel
//           data={energyEstimateData}
//           graphConfig={{
//             title: "Projected Energy Generation",
//             description: "",
//             footer: "",
//           }}
//         />
//       </div>
//       {energyEstimateData && (
//         <section className="mx-auto max-w-5xl p-6 font-mono text-3xl font-medium">
//           {`Total Energy: ${Math.round(energyEstimateData.total)} kWh`}
//         </section>
//       )} */}
//       <Section>
//         <Statistics data={energyEstimateData} />
//       </Section>
//       {/* <section className="bg-amber-100/60">
//         // The CO2 Emissions
//         <CO2Emissions data={energyEstimateData} />
//       </section> */}
//     </>
//   )}
//   {isBreakLoading ? (
//     loader
//   ) : (
//     <section className="bg-lime-100/60">
//       {/* The break even point */}
//       <BreakEvenPoint
//         data={energyEstimateData}
//         breakEvenData={breakEvenData}
//         config={config}
//       />
//     </section>
//   )}
// </section>
// )}

// const FormSection = ({
//   onConfigChange,
// }: {
//   onConfigChange: CalculateFormProps["onConfigChange"]
// }) => {
//   return (
//     <div className="relative w-full basis-full md:basis-1/3 md:px-10">
//       {/* Add the background image with some overlay */}

//       {/* The actual contents of the body */}
//       <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">

//       </div>
//     </div>
//   )
// }

interface Props {
  data: EnergyEstimation | null
}

function CO2Emissions({ data }: Props) {
  const greenFactor = useMemo(() => (data ? data.greenFactor : null), [data])
  // TODO: Can be improved
  const numYears = useMemo(
    () => Settings.CALCULATION_VALUE.PREDICTION_YEAR_OFFSET,
    []
  )
  // See if we can extract trees
  const trees = useMemo(
    () => (greenFactor ? Math.round(greenFactor.trees) : null),
    [data]
  )

  const variableSpaceClass =
    "min-w-[200px] mx-2 border-b-green-600 border-b-4 italic text-green-600"

  if (!greenFactor || !trees) return null

  return (
    <section className="m-4 mx-auto mt-6 w-full max-w-5xl rounded-md py-6 text-center font-mono text-5xl leading-relaxed">
      <h1>
        In the next <span className={variableSpaceClass}>{numYears}</span> years
      </h1>
      <h1>using solar panels,</h1>
      <h1>
        you would offset{" "}
        <span className={variableSpaceClass}>
          {greenFactor.carbonEmission.co2Emissions.amount.toFixed(2) +
            " " +
            greenFactor.carbonEmission.co2Emissions.unit}
          &nbsp;of CO<sub>2</sub>
        </span>
      </h1>
      <p className="my-6 text-7xl font-medium">
        {"That's"}&nbsp;
        <span className={twMerge(variableSpaceClass, "font-bold")}>
          {!trees ? "X" : trees}
        </span>
        &nbsp;
        {"trees!"}
      </p>
    </section>
  )
}

function BreakEvenPoint({
  data,
  breakEvenData,
}: Props & {
  breakEvenData: BreakEventPointEstimation | null
}) {
  const variableSpaceClass =
    "min-w-[200px] mx-2 border-b-amber-600 border-b-4 italic text-amber-600"

  const xYears = useMemo(
    () => (breakEvenData ? breakEvenData.breakEven.amount : null),
    [breakEvenData]
  )
  const formattedEnergyGenerated = useMemo(
    () => (breakEvenData ? breakEvenData.energyInCost.formatted : null),
    [breakEvenData]
  )
  const formattedInstallation = useMemo(
    () =>
      breakEvenData ? breakEvenData.adjustedCostToInstallation.formatted : null,
    [breakEvenData]
  )

  if (!breakEvenData || !data) {
    return null
  }

  return (
    <section className="mx-auto mt-6 flex w-full max-w-5xl flex-col items-center justify-between text-center font-mono leading-relaxed">
      <h1 className="py-6 text-4xl">
        The panel pays itself off in{" "}
        <span className={variableSpaceClass}>
          {!xYears ? "- years" : xYears + " years"}
        </span>
        <p className="my-4 text-lg">{`Assuming the cost per kWh energy is: ${breakEvenData ? breakEvenData.adjustedCostToUnit.formatted : "-"}`}</p>
      </h1>
      <section className="flex max-w-xl flex-col gap-8 p-6 md:flex-row">
        <div className="flex basis-full flex-col items-center justify-center rounded-sm border-4 border-green-600 bg-[#ccf8ce]/50 p-4">
          <p className="w-full max-w-full break-words text-base font-medium">
            Amount of energy generated by{" "}
            <span className="font-medium text-green-600 underline">Panel</span>
          </p>
          <div className="text-4xl font-extrabold leading-loose text-[#3b9e40]">
            {formattedEnergyGenerated}
          </div>
        </div>
        <div className="flex basis-full flex-col items-center justify-center rounded-sm border-4 border-amber-600 bg-amber-200/50 p-4">
          <p className="w-full max-w-full break-words text-base font-medium">
            Installation cost of panel&nbsp;{"(rough)"}
          </p>
          <div className="text-4xl font-extrabold leading-loose text-amber-700">
            {formattedInstallation}
          </div>
        </div>
      </section>
    </section>
  )
}
