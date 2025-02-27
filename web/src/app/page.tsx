import Strings from "@/constants/Strings"
import dynamic from "next/dynamic"

// Do a dynamic import to avoid (location is undefined) error
const LocationForm = dynamic(
  () => import("@/components/component/LocationForm"),
  { ssr: false }
)

export default function Home() {
  return (
    <main className="container mx-auto flex h-screen w-full flex-col bg-muted bg-slate-200 pt-[18vh]">
      <h2 className="black my-10 text-center text-5xl font-extrabold md:text-7xl">
        {Strings.APP.SHORT_TITLE}
      </h2>
      <LocationForm />
    </main>
  )
}
