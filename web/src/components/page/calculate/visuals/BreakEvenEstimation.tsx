import { useEffect, useMemo, useState } from "react"
import clsx from "clsx"

// ui
import { Card, CardTitle } from "@/components/ui/card"
// Custom Components
import { EstimateCommonProps, Loader } from "."
// Type definitions
import { BreakEventPointEstimation } from "@/types"

const processBreakEvenSummary = (solarData: BreakEventPointEstimation) => {
  // Calculate yearly totals
  const yearlyTotals = Object.keys(solarData.years).map(year => {
    const totalEnergy = solarData.years[year].reduce(
      (sum, month) => sum + month.energy,
      0
    )
    return { year, totalEnergy }
  })

  const yearlyTotalsData = {
    labels: yearlyTotals.map(item => item.year),
    datasets: [
      {
        label: "Yearly Energy Production (kWh)",
        data: yearlyTotals.map(item => item.totalEnergy),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  }

  // Calculate finances
  const energyProduced = yearlyTotals.reduce(
    (sum, year) => sum + year.totalEnergy,
    0
  )
  const costPerUnit = solarData.adjustedCostToUnit.amount
  const installationCost = solarData.adjustedCostToInstallation.amount
  const estimatedSavings = energyProduced * costPerUnit
  const breakEvenYears = solarData.breakEven.amount

  return {
    yearlyTotals,
    yearlyTotalsData,
    energyProduced,
    installationCost,
    estimatedSavings,
    breakEvenYears,
  }
}

export const BreakEvenEstimation = ({
  isHidden = false,
  isLoading = false,
  breakEvenData,
}: EstimateCommonProps & {
  breakEvenData: BreakEventPointEstimation | null
}) => {
  const [breakEven, setBreakEven] = useState(
    breakEvenData as BreakEventPointEstimation | null
  )
  const [isFetching, setFetching] = useState(false)

  // On submit send a request to the backend api
  // to get the break even data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const costToUnit = Number(formData.get("costToUnit"))
    const costToInstallation = Number(formData.get("costToInstallation"))
    const adjustInflation = Boolean(formData.get("adjustInflation"))

    // Get the latitude and longitude from the localstorage
    const storedLocation = JSON.parse(
      localStorage.getItem("user-location") || "null"
    )

    // Send a request to the backend api
    setFetching(true)
    const response = await fetch("/api/data/energy/break-even", {
      method: "POST",
      body: JSON.stringify({
        lon: storedLocation.y,
        lat: storedLocation.x,
        area: 20, // TODO: Get the area from the user
        costToUnit,
        costToInstallation,
        adjustInflation,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Get the response from the backend api
    const data = await response.json()

    if (response.ok && data?.code === 200) {
      setBreakEven(data?.payload)
    } else {
      console.error("Error fetching break even data:", data)
    }
    setFetching(false)
  }

  // Update the break even data from props
  useEffect(() => {
    if (breakEvenData) {
      setBreakEven(breakEvenData)
    }
  }, [breakEvenData])

  if (isHidden) return null

  /**
   * Required params
   "lat": 28.670076,
  "lon": 77.203393,
  "area": 20,
  "efficiency": 0.223,
  "costToUnit": 7,
  "costToInstallation": 150000,
  "adjustInflation": true
   */

  return (
    <section className="container mx-auto mb-28 bg-transparent">
      {isLoading ? (
        <Loader />
      ) : (
        // {/* The starter content for context */}
        <div className="mt-10 flex flex-1 flex-col items-stretch rounded-md bg-purple-50 p-6 text-black sm:flex-row-reverse xl:max-h-[600px]">
          <div className="flex basis-2/5 flex-col items-center justify-around rounded-md border-2 border-solid bg-white/90 p-6 shadow-sm">
            <div className="max-w-md">
              <h2 className="text-center font-mono text-3xl font-bold">
                Break Even Predictions
              </h2>
              <p className="mt-6 italic text-black/80">
                You can tune the break even point by adjusting the cost of the
                installation and the cost per unit of energy. The break even
                point is the time it takes to recover the cost of the
                installation through savings on energy bills.
              </p>
            </div>

            <form
              className="flex w-full max-w-md flex-col items-center"
              onSubmit={handleSubmit}
            >
              <div className="flex w-full flex-col gap-4">
                <label htmlFor="costToUnit" className="text-sm font-medium">
                  Cost per unit of energy (in ₹):
                </label>
                <input
                  type="number"
                  id="costToUnit"
                  name="costToUnit"
                  placeholder="7"
                  defaultValue={Number(
                    breakEven?.adjustedCostToUnit.amount.toFixed(0)
                  )}
                  className="rounded-md border-2 border-gray-300 p-2 text-black"
                />

                <label
                  htmlFor="costToInstallation"
                  className="text-sm font-medium"
                >
                  Cost of installation (in ₹):
                </label>
                <input
                  type="number"
                  id="costToInstallation"
                  name="costToInstallation"
                  placeholder="150000"
                  defaultValue={Number(
                    breakEven?.adjustedCostToInstallation.amount.toFixed(0)
                  )}
                  className="rounded-md border-2 border-gray-300 p-2 text-black"
                />

                <div className="flex flex-row items-center">
                  <input
                    type="checkbox"
                    id="adjustInflation"
                    name="adjustInflation"
                    defaultChecked={false}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label
                    htmlFor="adjustInflation"
                    className="ml-2 text-sm font-medium"
                  >
                    Adjust for inflation
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 w-full max-w-xs rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
              >
                Calculate
              </button>
            </form>
          </div>

          <div
            className={clsx(
              "mx-0 mt-6 flex basis-3/5 flex-col justify-between rounded-md border-2 border-black/10 bg-white/80 p-6 sm:mr-6 sm:mt-0 xl:max-h-[600px]",
              isFetching && "items-center"
            )}
          >
            <BreakEvenSummary
              breakEvenData={breakEven}
              isFetching={isFetching}
            />
          </div>
        </div>
      )}
    </section>
  )
}

const BreakEvenSummary = ({
  breakEvenData,
  isFetching,
}: {
  breakEvenData: BreakEventPointEstimation | null
  isFetching: boolean
}) => {
  const { energyProduced, estimatedSavings, breakEvenYears } = useMemo(
    () =>
      breakEvenData
        ? processBreakEvenSummary(breakEvenData!)
        : {
            energyProduced: undefined,
            estimatedSavings: undefined,
            breakEvenYears: undefined,
          },
    [breakEvenData]
  )

  if (!breakEvenData || isFetching) return <Loader />

  if (energyProduced === undefined || estimatedSavings === undefined) {
    return <Loader />
  }

  return (
    <>
      <div className="flex h-full flex-col justify-around gap-4">
        <div>
          <Card className="p-4">
            <CardTitle className="text-lg xl:text-center">
              Estimated Savings
            </CardTitle>
            <p className="text-2xl font-bold text-green-600 xl:text-center xl:text-6xl">
              ₹ {estimatedSavings.toFixed(2)}
            </p>
          </Card>
        </div>
        <div className="flex w-full flex-col gap-4 xl:flex-row">
          <Card className="basis-1/2 bg-blue-50 p-4">
            <CardTitle className="text-lg">Total Energy</CardTitle>
            <p className="text-2xl font-bold">
              {energyProduced.toFixed(2)} kWh
            </p>
          </Card>

          <Card className="basis-1/2 bg-amber-50 p-4">
            <CardTitle className="text-lg">Break Even</CardTitle>
            <p className="text-2xl font-bold">{breakEvenYears} years</p>
          </Card>
        </div>
      </div>

      <div className="mt-2 font-mono text-sm italic text-gray-500">
        Installation Cost: {breakEvenData?.adjustedCostToInstallation.formatted}
        &nbsp; | Cost per Unit: {breakEvenData.adjustedCostToUnit.formatted}
      </div>
    </>
  )
}
