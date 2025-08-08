import Images from "@/constants/Images"
import Section, { SectionProps } from "../../component/Section"
import BenefitCarousel from "../../component/carousel/BenefitCarousel"
import PartnerCarousel from "../../component/carousel/PartnerCarousel"

export default function BenefitsSection({ ...props }: SectionProps) {
  return (
    <Section
      containerClassName="!max-h-[2160px] h-[200vh] font-roboto"
      imageSrc={Images.longBackground}
      {...props}
    >
      {/* Create two sections with 100vh height */}
      <SubSection1 />
      <SubSection2 />
    </Section>
  )
}

const SubSection1 = () => (
  <section className="relative !max-h-[1080px] h-screen">
    <div className="absolute left-0 sm:left-16 top-1/2 -translate-y-1/2">
      <p className="mb-4 text-lg font-medium ml-8 sm:ml-0 text-white/80">Go Solar</p>
      <h2 className="max-w-xl text-4xl text-wrap text-center md:text-left md:text-6xl text-white">
        Energy Savings Made Easy with Solarwise
      </h2>
    </div>
  </section>
)

const SubSection2 = () => (
  <section className="flex !max-h-[1080px] h-screen flex-col justify-between">
    <h2 className="mx-auto px-16 max-w-xl text-wrap text-center text-4xl md:text-6xl text-white">
      Discover the benefits
    </h2>
    {/* The benefit cards */}
    <BenefitCarousel className="mt-20"/>
    {/* Show the current solar panel partners */}
    <PartnerCarousel className="py-10 bg-white"/>
  </section>
)



