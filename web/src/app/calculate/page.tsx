import dynamic from "next/dynamic"

// Do a dynamic import to avoid (location is undefined) error
const CalculatePage = dynamic(
  () => import("@/components/page/calculate"),
  { ssr: false }
)


export default function Calculate() {
  return <CalculatePage/>
}