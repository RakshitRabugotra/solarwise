"use client"

import SwiperCarousel from "../SwiperCarousel"
import Image from "next/image"
import Images from "@/constants/Images"

export default function PartnerCarousel({ className }: { className?: string }) {
  return (
    <SwiperCarousel
      id={"partners"}
      classNames={{
        base: className,
        buttons: { container: 'lg:flex'},
      }}
      items={Object.keys(Images.images.partners).map((partner, index) => ({
        imageSrc:
          Images.images.partners[
            partner as keyof typeof Images.images.partners
          ],
        id: partner + "-" + index,
      }))}
      renderItem={(item, key) => <PartnerCard key={key} {...item} />}
      swiperProps={{
        breakpoints: {
          390: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          450: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        },
      }}
    />
  )
}

const PartnerCard = ({ imageSrc }: { imageSrc: string }) => {
  return (
    <div className="mx-auto h-[90px] w-[170px]">
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
