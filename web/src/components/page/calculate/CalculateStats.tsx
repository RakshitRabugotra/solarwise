import Settings from "@/constants/Settings"
import { EnergyEstimation } from "@/types"
import { twMerge } from "tailwind-merge"

export default function CalculateStats({
  data,
}: {
  data: EnergyEstimation | null
}) {
  const greenFactor = data ? data.greenFactor : null
  // TODO: Can be improved
  const numYears = Settings.CALCULATION_VALUE.PREDICTION_YEAR_OFFSET
  // See if we can extract trees
  const trees = greenFactor ? Math.round(greenFactor.trees) : null

  const variableSpaceClass =
    "min-w-[200px] mx-2 border-b-green-600 border-b-4 italic text-green-600"

  if (!greenFactor || !trees) return null

  return (
    <div className="flex flex-col h-screen max-h-[1080px] md:flex-row gap-3 p-20">
      <div className="glass flex-1 flex items-center justify-center">
        <div className="max-w-[320px] flex flex-row flex-wrap justify-center items-center gap-3">
          <Hexagon
            title={"CO" + "\u2082" + " Offset"}
            colorClass="bg-amber-400"
            className="text-white shadow-sm"
            value={
              greenFactor.carbonEmission.co2Emissions.amount.toFixed(2) +
              " " +
              greenFactor.carbonEmission.co2Emissions.unit
            }
          />
          <Hexagon
            title={"Equivalent Trees"}
            colorClass="bg-green-600"
            className="text-white shadow-sm"
            value={trees.toString()}
          />
          <Hexagon
            title={"Equivalent Trees"}
            colorClass="bg-blue-600"
            className="text-white shadow-sm"
            value={trees.toString()}
          />
        </div>
        {/* <Hexagon />
        <Hexagon /> */}
      </div>

      <div className="basis-1/2 text-black justify-center items-center flex">
          <p>GRAPH</p>
      </div>
    </div>
    // <section className="m-4 mx-auto mt-6 w-full max-w-5xl rounded-md py-6 text-center font-mono text-5xl leading-relaxed">
    //   <h1>
    //     In the next <span className={variableSpaceClass}>{numYears}</span> years
    //   </h1>
    //   <h1>using solar panels,</h1>
    //   <h1>
    //     you would offset{" "}
    //     <span className={variableSpaceClass}>
    //       {greenFactor.carbonEmission.co2Emissions.amount.toFixed(2) +
    //         " " +
    //         greenFactor.carbonEmission.co2Emissions.unit}
    //       &nbsp;of CO<sub>2</sub>
    //     </span>
    //   </h1>
    //   <p className="my-6 text-7xl font-medium">
    //     {"That's"}&nbsp;
    //     <span className={twMerge(variableSpaceClass, "font-bold")}>
    //       {!trees ? "X" : trees}
    //     </span>
    //     &nbsp;
    //     {"trees!"}
    //   </p>
    // </section>
  )
}

const Hexagon = ({
  title,
  value,
  colorClass,
  className,
}: {
  title: string
  value: string
  colorClass?: string
  className?: string
}) => {
  return (
    <div
      className={twMerge(
        "hexagon shadow-lg flex aspect-square w-[150px] flex-col items-center justify-center",
        colorClass,
        className
      )}
    >
      <h4 className='opacity-70 font-medium text-xs lg:text-base'>{title}</h4>
      <p className='font-medium text-white text-base lg:text-lg'>{value}</p>
    </div>
  )
}
