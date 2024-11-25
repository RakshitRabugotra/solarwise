"use client"

import { useMemo } from "react"
import { twMerge } from "tailwind-merge"
// UI
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import NumberedChart, {
  NumberedChartData,
  NumberedChartProps,
} from "../../charts/NumberedChart"
import { EnergyEstimation } from "@/types"

export interface EstimationCarouselProps {
  data: EnergyEstimation | null
  graphConfig: NumberedChartProps["config"]
  classNames?: {
    carouselContainer?: string
  }
}

export default function EstimationCarousel({
  data,
  graphConfig,
  classNames,
}: EstimationCarouselProps) {
  // Get the data to show from the energy production
  const formattedData = useMemo(
    () =>
      data === null
        ? []
        : (data.months.map(({ energy, month, year }) => ({
            label: month + "-" + year,
            value: energy,
          })) as NumberedChartData),
    [data]
  )

  // Decides the total number of slides
  const numSlices = useMemo(() => formattedData.length / 12, [formattedData])

  if (!data) return null

  return (
    <Carousel className={twMerge("w-full max-w-4xl mx-auto", classNames?.carouselContainer)}>
      <CarouselContent>
        {Array.from({ length: numSlices }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <NumberedChart
                data={formattedData.slice(index * 12, (index + 1) * 12)}
                config={graphConfig}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
