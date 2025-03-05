"use client"

import Strings from "@/constants/Strings"
import SwiperCarousel from "../SwiperCarousel"
import { twMerge } from "tailwind-merge"
import Image from "next/image"

export default function FeatureCarousel({ className }: { className?: string }) {
  return (
    <SwiperCarousel
      id={"features"}
      classNames={{ base: className }}
      items={Strings.FEATURES.map(feature => ({
        ...feature,
        id: feature.title,
      }))}
      renderItem={(item, key) => <FeatureCard key={key} {...item} />}
    />
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
        "flex flex-col items-center rounded-md !bg-black/20 p-6 shadow-sm md:min-h-[430px] lg:min-h-[410px]",
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
      <h3 className="font-roboto text-xl font-medium sm:mt-2 sm:text-2xl">
        {title}
      </h3>

      <p className="max-w-full text-wrap pt-5 text-justify font-roboto text-xs sm:pt-10 sm:text-base">
        {description}
      </p>
    </div>
  )
}
