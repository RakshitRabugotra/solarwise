import Image from "next/image"
import Section, { SectionProps } from "../Section"
import Strings from "@/constants/Strings"
import { twMerge } from "tailwind-merge"

export default function FeaturesSection({ ...rest }: SectionProps) {
  return (
    <Section {...rest}>
      <h2 className="-translate-y-full font-roboto text-center bg-transparent text-3xl md:text-5xl">
        The Solar Difference
      </h2>

      <section className="mx-12 flex flex-row gap-8 items-stretch pb-20 my-auto">
        {Strings.FEATURES.map((feature, index) => (
          <FeatureCard
            className="flex-1 basis-1/3"
            {...feature}
            key={feature.title + "-" + index}
          />
        ))}
      </section>
    </Section>
  )
}

const FeatureCard = ({
  title,
  imageSrc,
  description,
  className,
}: {
  title: string
  imageSrc: string
  description: string
  className?: string
}) => {
  return (
    <div
      className={twMerge(
        "glass flex flex-col items-center rounded-full !bg-black/20 p-6",
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={"icon-" + title}
        width={86}
        height={86}
        className="h-[86px] w-[86px] object-cover"
      />
      <h3 className='text-2xl font-roboto font-medium mt-2'>{title}</h3>

      <p className="max-w-full font-roboto text-wrap pt-10 text-justify text-base">
        {description}
      </p>
    </div>
  )
}
