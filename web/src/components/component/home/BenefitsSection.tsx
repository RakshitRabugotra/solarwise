import Images from "@/constants/Images"
import Section, { SectionProps } from "../Section"
import Image from "next/image"
import { twMerge } from "tailwind-merge"
import Strings from "@/constants/Strings"

export default function BenefitsSection({ ...props }: SectionProps) {
  return (
    <Section
      containerClassName="!max-h-[2160px] h-[200vh] font-roboto"
      imageSrc={Images.longBackground}
    >
      {/* Create two sections with 100vh height */}
      <SubSection1 />
      <SubSection2 />
    </Section>
  )
}

const SubSection1 = () => (
  <section className="relative !max-h-[1080px] h-screen">
    <div className="absolute left-16 top-1/2 -translate-y-1/2">
      <p className="mb-4 text-lg font-medium text-white/80">Go Solar</p>
      <h2 className="max-w-xl text-wrap text-left text-6xl text-white">
        Energy Savings Made Easy with Solarwise
      </h2>
    </div>
  </section>
)

const SubSection2 = () => (
  <section className="flex !max-h-[1080px] h-screen flex-col justify-between">
    <h2 className="mx-auto max-w-xl text-wrap text-center text-6xl text-white">
      Discover the benefits
    </h2>
    {/* The benefit cards */}
    <div className="mt-20 flex flex-row items-stretch justify-around gap-8">
      {Strings.BENEFITS.map((benefit, index) => (
        <BenefitCard
          {...benefit}
          className="basis-1/3"
          key={index + benefit.imageSrc}
        />
      ))}
    </div>
    {/* Show the current solar panel partners */}
    <div className="flex flex-row flex-wrap justify-around bg-white py-10">
      {Object.keys(Images.images.partners).map((partner, index) => (
        <PartnerCard
          imageSrc={
            Images.images.partners[
              partner as keyof typeof Images.images.partners
            ]
          }
          key={partner + index}
        />
      ))}
    </div>
  </section>
)

const BenefitCard = ({
  description,
  imageSrc,
  className,
}: {
  description: string
  imageSrc: string
  className?: string
}) => {
  return (
    <div
      className={twMerge(
        "flex max-w-xs flex-col items-center justify-center font-roboto",
        className
      )}
    >
      <div className="glass rounded-md p-3">
        <Image
          src={imageSrc}
          alt={"benefit-" + description}
          width={100}
          height={100}
          className="h-[100px] w-[100px] rounded-xl object-cover"
        />
      </div>
      <p className="mt-4 max-w-xs text-wrap text-center text-lg text-white">
        {description}
      </p>
    </div>
  )
}

const PartnerCard = ({ imageSrc }: { imageSrc: string }) => {
  return (
    <div className="h-[90px] w-[170px]">
      <Image
        src={imageSrc}
        alt={imageSrc}
        width={170}
        height={90}
        className="object-fit h-full w-full"
      />
    </div>
  )
}
