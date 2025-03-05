"use client"

import Strings from "@/constants/Strings"
import SwiperCarousel from "../SwiperCarousel"
import { twMerge } from "tailwind-merge"
import Image from "next/image"

export default function BenefitCarousel({ className }: { className?: string }) {
  return (
    <SwiperCarousel
      id={"benefits"}
      classNames={{
        base: className,
        buttons: {
          container: 'mb-4',
          next: "bg-black/80 text-white p-2 m-2 rounded-md px-4",
          prev: "bg-black/80 text-white p-2 m-2 rounded-md px-4",
        },
      }}
      items={Strings.BENEFITS.map((benefit, index) => ({
        ...benefit,
        id: benefit.imageSrc + "-" + index,
      }))}
      renderItem={(item, key) => <BenefitCard key={key} {...item} />}
    />
  )
}

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
        "flex flex-col items-center justify-center font-roboto",
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
