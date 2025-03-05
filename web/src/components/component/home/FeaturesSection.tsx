import FeatureCarousel from "../carousel/FeatureCarousel"
import Section, { SectionProps } from "../Section"

export default function FeaturesSection({ ...rest }: SectionProps) {
  return (
    <Section {...rest}>
      <h2 className="-translate-y-full bg-transparent text-center font-roboto text-3xl md:text-5xl">
        The Solar Difference
      </h2>

      <FeatureCarousel className="mx-12 my-auto pb-20" />
    </Section>
  )
}
