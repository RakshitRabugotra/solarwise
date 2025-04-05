import { BreakEventPointEstimation, EnergyEstimation } from "@/types"
import { SolarEnergyEstimation } from "./SolarEnergyEstimation"
import { BreakEvenEstimation } from "./BreakEvenEstimation"

export interface EstimateCommonProps {
  isHidden?: boolean
  isLoading?: boolean
}

export const Loader = () => (
  <section className="flex min-h-screen flex-col items-center justify-center">
    <div className="loader"></div>
  </section>
)

const Estimation = {
  SolarEnergy: (
    props: EstimateCommonProps & { energyEstimateData: EnergyEstimation | null }
  ) => <SolarEnergyEstimation {...props} />,
  BreakEven: (
    props: EstimateCommonProps & {
      breakEvenData: BreakEventPointEstimation | null
    }
  ) => <BreakEvenEstimation {...props} />,
  Loader: () => <Loader />,
}

export default Estimation
