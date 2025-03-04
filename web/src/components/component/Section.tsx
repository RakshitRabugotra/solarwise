import Image from "next/image"
import { PropsWithChildren } from "react"
import { twMerge } from "tailwind-merge"

export interface SectionProps extends PropsWithChildren {
  imageSrc?: string
  separatorTop?: boolean
  separatorBottom?: boolean
  className?: string
  containerClassName?: string
}

export default function Section({
  imageSrc,
  children,
  separatorTop = false,
  className,
  containerClassName,
}: SectionProps) {
  return (
    <div className={twMerge("relative flex h-screen max-h-[1080px] flex-col overflow-hidden", containerClassName)}>
      {separatorTop && (
        <div className="absolute left-0 right-0 top-0 z-[5]">
          <Image
            src="/assets/horizontal-sep.svg"
            alt="separator"
            width={1500}
            height={500}
            className="w-full"
          />
        </div>
      )}
      {imageSrc && (
        <div className="absolute inset-0 z-0">
          <Image
            src={imageSrc}
            alt="background-image"
            width={1500}
            height={1500}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div
        className={twMerge(
          "absolute inset-0 z-[5] flex flex-col",
          separatorTop && "mt-[200px]",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
