import { useMemo, useState } from "react"
// ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Custom Components
import { EstimateCommonProps, Loader } from "."
// Type definitions
import { EnergyEstimation } from "@/types"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

interface ChartDatasets {
  [key: string]: {
    labels: string[]
    energy: number[]
    peakHours: number[]
    radiation: number[]
  }
}

// Chart options
const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const label = context.dataset.label || ""
          const value = context.parsed.y
          return `${label}: ${value.toFixed(2)}`
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: false,
    },
  },
}

// Process data for charts
const processChartDatasets = (solarData: EnergyEstimation): ChartDatasets => {
  // Flatten the years data for "all" view
  const allMonths = Object.keys(solarData.years).flatMap(year =>
    solarData.years[year].map(month => ({
      ...month,
      label: `${month.month} ${month.year}`,
    }))
  )

  // Sort by order
  allMonths.sort((a, b) => a.order - b.order)

  const datasets: ChartDatasets = {
    all: {
      labels: allMonths.map(month => month.label),
      energy: allMonths.map(month => month.energy),
      peakHours: allMonths.map(month => month.peakSunlightHours),
      radiation: allMonths.map(month => month.radiation),
    },
  }

  // Process individual years
  Object.keys(solarData.years).forEach(year => {
    const yearData = [...solarData.years[year]].sort(
      (a, b) => a.order - b.order
    )
    datasets[year] = {
      labels: yearData.map(month => month.month),
      energy: yearData.map(month => month.energy),
      peakHours: yearData.map(month => month.peakSunlightHours),
      radiation: yearData.map(month => month.radiation),
    }
  })

  return datasets
}

interface SolarEnergyEstimationProps extends EstimateCommonProps {
  energyEstimateData: EnergyEstimation | null
}

export const SolarEnergyEstimation = ({
  isHidden = false,
  isLoading = false,
  energyEstimateData,
}: SolarEnergyEstimationProps) => {
  // State variables
  const [activeYear, setActiveYear] = useState<string>("all")
  // Constants
  const solarData = useMemo(
    () =>
      energyEstimateData ? processChartDatasets(energyEstimateData) : null,
    [energyEstimateData]
  )

  if (isHidden) return null

  return (
    <section className="container mx-auto w-auto bg-white px-6">
      {isLoading || !energyEstimateData ? (
        <Loader />
      ) : (
        <>
          <section className="flex flex-col bg-white">
            <SummaryCardSection solarData={energyEstimateData} />
            {/* The chart section with knowledge */}
            <div className="my-auto mt-10 flex max-h-[700px] flex-1 flex-col text-black sm:flex-row">
              <div className="flex basis-2/5 flex-col items-center justify-center rounded-md border-2 border-solid bg-green-100/50 p-6 shadow-sm">
                <h2 className="text-center text-3xl font-medium">
                  Energy Predictions
                </h2>
                <p className="mt-10 text-black/80">
                  These graphs display data on Energy Production (in kWh), Peak
                  Sunlight Hours, and Solar Radiation based on your location.
                  Use the tab controls to adjust the snapshot duration as
                  needed.
                </p>
              </div>
              {/* The Solar Energy graph */}
              <div className="mx-0 mt-6 flex basis-3/5 flex-col rounded-md border-2 border-black/10 p-2 sm:ml-6 sm:mt-0 sm:p-6 xl:h-[600px]">
                {/* The tabs and tablist to control behavior */}
                <Tabs
                  defaultValue="all"
                  className="mt-2 p-2 sm:mt-10 sm:p-4 sm:px-8"
                  onValueChange={setActiveYear}
                >
                  <TabsList className="mb-4 grid grid-cols-4">
                    <TabsTrigger value="all">All Data</TabsTrigger>
                    <TabsTrigger value="2024">2024</TabsTrigger>
                    <TabsTrigger value="2025">2025</TabsTrigger>
                    <TabsTrigger value="2026">2026</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="mx-auto h-full">
                  <EnergyChart solarData={solarData} activeYear={activeYear} />
                </div>
              </div>
            </div>
          </section>
          <section className="mt-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <GenericChart
                type="bar"
                title="Peak Sunlight Hours"
                labels={solarData ? solarData[activeYear].labels : []}
                data={solarData ? solarData[activeYear].peakHours : null}
                backgroundColor="rgba(255, 102, 102, 0.6)"
              />
              <GenericChart
                type="line"
                title="Solar Radiation"
                labels={solarData ? solarData[activeYear].labels : []}
                data={solarData ? solarData[activeYear].radiation : null}
                borderColor="rgba(255, 159, 64, 1)"
                backgroundColor="rgba(255, 159, 64, 0.5)"
              />
            </div>
          </section>
        </>
      )}
    </section>
  )
}

const SummaryCardSection = ({ solarData }: { solarData: EnergyEstimation }) => {
  // Carbon offset stats
  const {
    trees,
    carbonEmission: { co2Emissions },
  } = useMemo(() => solarData.greenFactor, [solarData])

  return (
    <div className="mt-10 flex min-h-[200px] items-center justify-center rounded-md bg-purple-50 p-6">
      <div className="mb-6 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-blue-100 p-4 shadow-lg transition-all duration-200 ease-in-out hover:scale-105">
          <CardTitle className="text-lg">Total Energy Production</CardTitle>
          <p className="text-2xl font-bold">
            {Math.round(solarData.total)} kWh
          </p>
        </Card>
        <Card className="bg-green-100 p-4 shadow-lg transition-all duration-200 ease-in-out hover:scale-105">
          <CardTitle className="text-lg">CO₂ Emissions Saved</CardTitle>
          <p className="text-2xl font-bold">
            {Math.round(co2Emissions.amount)} kg
          </p>
        </Card>
        <Card className="bg-amber-100 p-4 shadow-lg transition-all duration-200 ease-in-out hover:scale-105">
          <CardTitle className="text-lg">Equivalent Trees Planted</CardTitle>
          <p className="text-2xl font-bold">{Math.round(trees)}</p>
        </Card>
      </div>
    </div>
  )
}

const EnergyChart = ({
  activeYear,
  solarData,
}: {
  solarData: ChartDatasets | null
  activeYear: string
}) => {
  // Chart data
  const energyChartData = useMemo(
    () =>
      solarData
        ? {
            labels: solarData[activeYear].labels,
            datasets: [
              {
                label: "Energy Production (kWh)",
                data: solarData[activeYear].energy,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.2,
              },
            ],
          }
        : null,
    [solarData, activeYear]
  )

  if (!energyChartData) return null

  return (
    <Line
      options={lineOptions}
      data={energyChartData}
      className="!h-full !w-full"
    />
  )
}

const GenericChart = ({
  type,
  title,
  borderColor = undefined,
  backgroundColor = undefined,
  data,
  labels,
}: {
  type: "bar" | "line"
  title: string
  borderColor?: string
  backgroundColor?: string
  data: any | null
  labels: string[]
}) => {
  // Chart data
  const chartData = useMemo(
    () =>
      data
        ? {
            labels: labels,
            datasets: [
              {
                data,
                borderColor,
                backgroundColor,
                label: title,
                tension: 0.2,
              },
            ],
          }
        : null,
    [data]
  )

  const chart = useMemo(() => {
    if (!chartData) return null

    switch (type) {
      case "bar":
        return <Bar options={lineOptions} data={chartData} />
      case "line":
        return <Line options={lineOptions} data={chartData} />
      default:
        return null
    }
  }, [type, lineOptions, chartData])

  return (
    <Card
      style={{
        borderColor: backgroundColor,
        borderWidth: 2,
      }}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex h-64 items-center justify-center p-3 [&>*]:h-full">
        {chart}
      </CardContent>
    </Card>
  )
}

// const radiationChartData = {
//   labels: data[activeYear].labels,
//   datasets: [
//     {
//       label: "Solar Radiation",
//       data: data[activeYear].radiation,
//       borderColor: "rgba(255, 159, 64, 1)",
//       backgroundColor: "rgba(255, 159, 64, 0.2)",
//       tension: 0.2,
//     },
//   ],
// }

// const peakHoursChartData = {
//   labels: data[activeYear].labels,
//   datasets: [
//     {
//       label: "Peak Sunlight Hours",
//       data: data[activeYear].peakHours,
//       backgroundColor: "rgba(153, 102, 255, 0.6)",
//     },
//   ],
// }
