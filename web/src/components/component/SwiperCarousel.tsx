"use client"

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation, Autoplay } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import { twMerge } from "tailwind-merge"

export interface SwiperCarouselProps<T> {
  id: string
  items: (T & { id: React.Key })[]
  renderItem: (item: T & { id: React.Key }, key: React.Key) => React.ReactNode,
  classNames?: {
    base?: string
    buttons?: {
      container?: string,
      next?: string,
      prev?: string
    }
  }
  autoplay?: boolean
  swiperProps?: any
}

export default function SwiperCarousel<T>({
  id,
  items,
  renderItem,
  autoplay,
  swiperProps,
  classNames
}: SwiperCarouselProps<T>) {
  return (
    <div className={twMerge(classNames?.base)}>
      <Swiper
        modules={autoplay ? [Navigation, Pagination, Autoplay]: [Navigation, Pagination]}
        speed={500}
        spaceBetween={10}
        breakpoints={{
          390: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
        navigation={{
          nextEl: ".swiper-button-next-" + id,
          prevEl: ".swiper-button-prev-" + id,
        }}
        {...swiperProps}
      >
        {items.map((item, index) => (
          <SwiperSlide>
            {renderItem(item, item.id.toString() + index)}
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={twMerge("flex w-full flex-row items-center justify-center gap-3 pt-4 lg:hidden", classNames?.buttons?.container)}>
        <button className={twMerge("swiper-button-prev-"+id, classNames?.buttons?.prev)}>{"\u2190"}</button>
        <button className={twMerge("swiper-button-next-"+id, classNames?.buttons?.next)}>{"\u2192"}</button>
      </div>
    </div>
  )
}
