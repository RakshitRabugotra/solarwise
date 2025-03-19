import { BreakEventPointEstimation } from "@/types"
import { EstimateCommonProps, Loader } from "."
import Section from "@/components/component/Section"

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
  if (isHidden) return null

  return (
    <section className="container mx-auto bg-transparent">
      {isLoading ? <Loader /> : <Section className="justify-center"></Section>}
    </section>
  )
}
