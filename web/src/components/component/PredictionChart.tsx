"use client"

import React, { useState } from "react"
import { Line, Bar } from "react-chartjs-2"
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
  Filler,
} from "chart.js"

import examplePredictionData from "@/data/sample-prediction.json"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Define TypeScript interfaces for our data structure
interface Co2Emissions {
  amount: number
  unit: string
}

interface EmissionFactor {
  amount: number
  unit: string
}

interface Factors {
  carbonAbsorption: number
  emissionFactor: EmissionFactor
}

interface CarbonEmission {
  co2Emissions: Co2Emissions
}

interface GreenFactor {
  carbonEmission: CarbonEmission
  factors: Factors
  trees: number
}

interface MonthData {
  energy: number
  month: string
  order: number
  peakSunlightHours: number
  radiation: number
  year: number
}

interface SolarData {
  greenFactor: GreenFactor
  months: MonthData[]
  total: number
}

interface YearlyAggregatedData {
  energy: number
  radiation: number
  peakSunlightHours: number
  count: number
}

interface ProcessedData {
  labels: string[]
  values: number[]
  averageSunlight: number[]
  radiationData: number[]
}

type ViewMode = "monthly" | "yearly"
type MetricType = "energy" | "sunlight"

const data = examplePredictionData

export default function PredictionChart() {
  const [viewMode, setViewMode] = useState<ViewMode>("monthly")
  const [metricType, setMetricType] = useState<MetricType>("energy")

  // Process the data for charts
  const processData = (): ProcessedData => {
    const months = data.months

    // Group data by year for yearly view
    const yearlyData: Record<number, YearlyAggregatedData> = {}
    months.forEach(month => {
      if (!yearlyData[month.year]) {
        yearlyData[month.year] = {
          energy: 0,
          radiation: 0,
          peakSunlightHours: 0,
          count: 0,
        }
      }
      yearlyData[month.year].energy += month.energy
      yearlyData[month.year].radiation += month.radiation
      yearlyData[month.year].peakSunlightHours += month.peakSunlightHours
      yearlyData[month.year].count += 1
    })

    // Calculate averages for peakSunlightHours and radiation in yearly view
    Object.keys(yearlyData).forEach(year => {
      const yearNum = parseInt(year)
      yearlyData[yearNum].peakSunlightHours /= yearlyData[yearNum].count
      yearlyData[yearNum].radiation /= yearlyData[yearNum].count
    })

    // Format labels based on view mode
    let labels: string[] = []
    let values: number[] = []
    let averageSunlight: number[] = []
    let radiationData: number[] = []

    if (viewMode === "yearly") {
      labels = Object.keys(yearlyData).sort()
      values = labels.map(year => yearlyData[parseInt(year)].energy)
      averageSunlight = labels.map(
        year => yearlyData[parseInt(year)].peakSunlightHours
      )
      radiationData = labels.map(
        year => yearlyData[parseInt(year)].radiation / 10
      ) // Scaled for visualization
    } else {
      // For monthly view, take the first 36 months for readability
      const displayMonths = months.slice(0, 36)
      labels = displayMonths.map(m => `${m.month} ${m.year}`)
      values = displayMonths.map(m => m.energy)
      averageSunlight = displayMonths.map(m => m.peakSunlightHours)
      radiationData = displayMonths.map(m => m.radiation / 10) // Scaled for visualization
    }

    return { labels, values, averageSunlight, radiationData }
  }

  const { labels, values, averageSunlight, radiationData } = processData()

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text:
          metricType === "energy"
            ? "Solar Energy Production"
            : "Peak Sunlight Hours",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: metricType === "energy" ? "Energy (kWh)" : "Hours",
        },
      },
      x: {
        title: {
          display: true,
          text: viewMode === "yearly" ? "Year" : "Month-Year",
        },
      },
    },
  }

  // Prepare chart data based on selected metric
  const chartData = {
    labels,
    datasets:
      metricType === "energy"
        ? [
            {
              label: "Energy Production (kWh)",
              data: values,
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
              tension: 0.2,
              fill: true,
            },
            {
              label: "Solar Radiation (W/m² ÷ 10)",
              data: radiationData,
              borderColor: "rgb(255, 159, 64)",
              backgroundColor: "rgba(255, 159, 64, 0.2)",
              tension: 0.2,
              borderDash: [5, 5],
              fill: false,
            },
          ]
        : [
            {
              label: "Peak Sunlight Hours",
              data: averageSunlight,
              borderColor: "rgb(255, 205, 86)",
              backgroundColor: "rgba(255, 205, 86, 0.5)",
              tension: 0.2,
              fill: true,
            },
          ],
  }

  // Carbon offset stats
  const {
    trees,
    carbonEmission: { co2Emissions },
  } = data.greenFactor

  return (
    <div className="flex flex-col rounded-lg bg-gray-50 p-6 shadow">
      <h1 className="mb-4 text-center text-2xl font-bold">
        Solar Energy Production Dashboard
      </h1>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow">
          <p className="mb-1 text-gray-500">Total Energy Production</p>
          <p className="text-3xl font-bold">{Math.round(data.total)} kWh</p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow">
          <p className="mb-1 text-gray-500">CO₂ Emissions Saved</p>
          <p className="text-3xl font-bold">
            {Math.round(co2Emissions.amount)} kg
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow">
          <p className="mb-1 text-gray-500">Equivalent Trees Planted</p>
          <p className="text-3xl font-bold">{Math.round(trees)}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-4">
        <div className="flex rounded-lg bg-white shadow">
          <button
            className={`rounded-l-lg px-4 py-2 ${viewMode === "monthly" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            onClick={() => setViewMode("monthly")}
          >
            Monthly View
          </button>
          <button
            className={`rounded-r-lg px-4 py-2 ${viewMode === "yearly" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            onClick={() => setViewMode("yearly")}
          >
            Yearly View
          </button>
        </div>

        <div className="flex rounded-lg bg-white shadow">
          <button
            className={`rounded-l-lg px-4 py-2 ${metricType === "energy" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            onClick={() => setMetricType("energy")}
          >
            Energy
          </button>
          <button
            className={`rounded-r-lg px-4 py-2 ${metricType === "sunlight" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            onClick={() => setMetricType("sunlight")}
          >
            Sunlight Hours
          </button>
        </div>
      </div>

      <div className="h-64 rounded-lg bg-white p-4 shadow md:h-96">
        <Line options={options} data={chartData} />
      </div>

      <div className="mt-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">Environmental Impact</h2>
        <Bar
          data={{
            labels: ["CO₂ Emissions Saved (tons)", "Equivalent Trees"],
            datasets: [
              {
                label: "Environmental Impact",
                data: [co2Emissions.amount / 1000, trees],
                backgroundColor: [
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(34, 139, 34, 0.6)",
                ],
              },
            ],
          }}
          options={{
            indexAxis: "y" as const,
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>
    </div>
  )
}
