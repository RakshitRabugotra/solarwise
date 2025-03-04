import BenefitsSection from "@/components/component/home/BenefitsSection"
import FeaturesSection from "@/components/component/home/FeaturesSection"
import Footer from "@/components/component/home/Footer"
import Section from "@/components/component/Section"
import Images from "@/constants/Images"
import dynamic from "next/dynamic"

// Do a dynamic import to avoid (location is undefined) error
const LocationForm = dynamic(
  () => import("@/components/component/LocationForm"),
  { ssr: false }
)

export default function Home() {
  return (
    <main className="container mx-auto h-screen w-full">
      {/* Hero Section */}
      <Section
        imageSrc={Images.heroBackground}
        className="absolute left-0 top-1/2 ml-20 -translate-y-1/4"
      >
        <h2 className="black my-10 max-w-2xl text-wrap text-left text-3xl font-medium text-white md:text-5xl">
          Experience The Future Of Solar Energy
        </h2>
        <LocationForm />
      </Section>

      {/* Features section */}
      <FeaturesSection separatorTop />
      {/* Benefits Sections */}
      <BenefitsSection />
      {/* The footer/newsletter */}
      <Footer/>
    </main>
  )
}
