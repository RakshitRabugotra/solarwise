"use client"
import Map from "@/components/component/Map"
import CalculateForm, {
  CalculateFormProps,
} from "@/components/component/savings/common/CalculateForm"
import { useEffect, useMemo, useState } from "react"
import {
  BaseAPIRequestBody,
  BreakEventPointEstimation,
  EnergyEstimation,
} from "@/types"
import EstimationCarousel from "@/components/component/savings/common/EstimationCarousel"

import samplePrediction from "@/sample-prediction.json"
import { twMerge } from "tailwind-merge"
import * as CONFIG from "@/lib/constants"
import { calculateAction, calculateBreakEven } from "@/actions/actions"
import Section from "@/components/component/Section"
import Image from "next/image"
import Images from "@/constants/Images"
import Statistics from "@/components/component/calculate/Statistics"

// import { Parallax, ParallaxLayer } from "@react-spring/parallax"

export default function CalculatePage() {

  const [ isMounted, setMounted ] = useState(false);
  const [formStatus, setFormStatus] = useState<
    "loading" | "unset" | "completed"
  >("completed")

  const [isBreakLoading, setBreakLoading] = useState(false)
  const [config, setConfig] = useState<BaseAPIRequestBody | null>(null)

  const [predictionData, setPredictionData] = useState<EnergyEstimation | null>(
    samplePrediction
  )
  const [breakEven, setBreakEven] = useState<BreakEventPointEstimation | null>(
    null
  )

  const loader = useMemo(
    () => (
      <section className="flex min-h-screen flex-col items-center justify-center">
        <div className="loader"></div>
      </section>
    ),
    []
  )

  console.log("data:", predictionData)

  useEffect(() => {
    setMounted(true);
  }, [])

  // fire to api results for the prediction
  // useEffect(() => {
  //   if (!config) return setFormStatus("unset")
  //   const fetchPrediction = async () => {
  //     setFormStatus("loading")
  //     if (!config) {
  //       setFormStatus("completed")
  //       return
  //     }
  //     const { response, error } = await calculateAction(config)
  //     if (!response || error) {
  //       setFormStatus("completed")
  //       return
  //     }
  //     setPredictionData(response.payload)
  //     setFormStatus("completed")
  //   }
  //   fetchPrediction()
  // }, [config])

  // fire to api to get the results for the break even
  // useEffect(() => {
  //   if (!config) return setFormStatus("unset")
  //   const fetchBreakEven = async () => {
  //     setBreakLoading(true)
  //     if (!config) {
  //       setBreakLoading(false)
  //       return
  //     }
  //     const { response, error } = await calculateBreakEven(config)
  //     if (!response || error) {
  //       setBreakLoading(false)
  //       return
  //     }
  //     setBreakEven(response.payload)
  //     setBreakLoading(false)
  //   }
  //   fetchBreakEven()
  // }, [config])

  if(!isMounted) return null;

  return (
    <main className="relative h-screen w-full">
      {/* Add the background image and overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={Images.calculateHeroBackground}
          alt="background-image"
          width={1500}
          height={1000}
          className="h-full w-full object-cover"
        />
      </div>
      {/* The overlay of black color */}
      <div className="absolute inset-0 z-[5] bg-black/50"></div>

      {/* The main content starts */}
      <div className="absolute inset-0 z-10 text-white">
        {/* Show the actual hero section */}
        <HeroLayer onConfigChange={data => setConfig(data)} />
        {formStatus !== "unset" && (
          <section className="container mx-auto bg-white">
            {formStatus === "loading" ? (
              loader
            ) : (
              <>
                {/* <div className="mx-auto max-w-5xl p-4">
        <EstimationCarousel
          data={predictionData}
          graphConfig={{
            title: "Projected Energy Generation",
            description: "",
            footer: "",
          }}
        />
      </div>
      {predictionData && (
        <section className="mx-auto max-w-5xl p-6 font-mono text-3xl font-medium">
          {`Total Energy: ${Math.round(predictionData.total)} kWh`}
        </section>
      )} */}
                <EfficiencyLayer predictionData={predictionData}/>
                {/* <section className="bg-amber-100/60">
        // The CO2 Emissions
        <CO2Emissions data={predictionData} />
      </section> */}
              </>
            )}
            {isBreakLoading ? (
              loader
            ) : (
              <section className="bg-lime-100/60">
                {/* The break even point */}
                <BreakEvenPoint
                  data={predictionData}
                  breakEven={breakEven}
                  config={config}
                />
              </section>
            )}
          </section>
        )}

        {/* <Parallax pages={2} style={{ top: 0, left: 0}}>
          <ParallaxLayer offset={0} speed={0.5}>
            <div className="bg-red-600 w-full h-full"></div>
          </ParallaxLayer>
          <ParallaxLayer offset={1} speed={2.5}>
            <div className='bg-lime-600 w-full h-full'></div>
          </ParallaxLayer>
        </Parallax> */}
      </div>
    </main>
  )
}

const HeroLayer = ({
  onConfigChange,
}: {
  onConfigChange: CalculateFormProps["onConfigChange"]
}) => {
  // The big hero section
  return (
    <section className="flex h-screen flex-col items-stretch md:flex-row md:justify-between">
      <Map />
      <div className="flex w-full basis-full flex-col items-center justify-center md:basis-1/3 md:px-10">
        <CalculateForm
          onConfigChange={onConfigChange}
          // scrollTrigger={scrollToSavings}
        />
      </div>
    </section>
  )
}

const EfficiencyLayer = ({
  predictionData,
}: {
  predictionData: EnergyEstimation | null
}) => {
  return (
    <Section className="justify-center">
      <Statistics data={predictionData} />
    </Section>
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

// {formStatus !== "unset" && (
// <section className="container mx-auto bg-white">
//   {formStatus === "loading" ? (
//     loader
//   ) : (
//     <>
//       {/* <div className="mx-auto max-w-5xl p-4">
//         <EstimationCarousel
//           data={predictionData}
//           graphConfig={{
//             title: "Projected Energy Generation",
//             description: "",
//             footer: "",
//           }}
//         />
//       </div>
//       {predictionData && (
//         <section className="mx-auto max-w-5xl p-6 font-mono text-3xl font-medium">
//           {`Total Energy: ${Math.round(predictionData.total)} kWh`}
//         </section>
//       )} */}
//       <Section>
//         <Statistics data={predictionData} />
//       </Section>
//       {/* <section className="bg-amber-100/60">
//         // The CO2 Emissions
//         <CO2Emissions data={predictionData} />
//       </section> */}
//     </>
//   )}
//   {isBreakLoading ? (
//     loader
//   ) : (
//     <section className="bg-lime-100/60">
//       {/* The break even point */}
//       <BreakEvenPoint
//         data={predictionData}
//         breakEven={breakEven}
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
  const numYears = useMemo(() => CONFIG.PREDICTION_YEAR_OFFSET, [CONFIG])
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
  config,
  data,
  breakEven,
}: Props & {
  config: BaseAPIRequestBody | null
  breakEven: BreakEventPointEstimation | null
}) {
  const variableSpaceClass =
    "min-w-[200px] mx-2 border-b-amber-600 border-b-4 italic text-amber-600"

  const xYears = useMemo(
    () => (breakEven ? breakEven.break_even.amount : null),
    [breakEven]
  )
  const formattedEnergyGenerated = useMemo(
    () => (breakEven ? breakEven.energyInCost.formatted : null),
    [breakEven]
  )
  const formattedInstallation = useMemo(
    () => (breakEven ? breakEven.adjustedCostToInstallation.formatted : null),
    [breakEven]
  )

  if (!breakEven || !data) {
    return null
  }

  return (
    <section className="mx-auto mt-6 flex w-full max-w-5xl flex-col items-center justify-between text-center font-mono leading-relaxed">
      <h1 className="py-6 text-4xl">
        The panel pays itself off in{" "}
        <span className={variableSpaceClass}>
          {!xYears ? "- years" : xYears + " years"}
        </span>
        <p className="my-4 text-lg">{`Assuming the cost per kWh energy is: ${breakEven ? breakEven.adjustedCostToUnit.formatted : "-"}`}</p>
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
