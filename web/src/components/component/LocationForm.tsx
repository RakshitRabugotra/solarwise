"use client"

import { useEffect, useState, useRef } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { OpenStreetMapProvider } from "leaflet-geosearch"
import { Button } from "../ui/button"
import { SearchResult } from "leaflet-geosearch/dist/providers/provider.js"
import { useRouter } from "next/navigation"
import "@/components/ui/form"
import { ArrowRight } from "lucide-react"
import Strings from "@/constants/Strings"
import { cn } from "@/lib/utils"
import Maps from "@/constants/Maps"

export default function LocationForm() {
  const [input, setInput] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const resultRefs = useRef<(HTMLLIElement | null)[]>([])

  const debouncedSetInput = useDebounceCallback(value => {
    setInput(value)
  }, 300)

  const router = useRouter()

  useEffect(() => {
    const provider = new OpenStreetMapProvider()
    const fetchResults = async () => {
      if (input) {
        const searchResults = await provider.search({ query: input })
        setResults(searchResults)
        setSelectedIndex(-1) // to make the selectedIndex -1 after search
      } else {
        setResults([])
        setSelectedIndex(-1)
      }
    }
    fetchResults()
  }, [input])

  const handleSelectResult = (index: number) => {
    setSelectedIndex(index)
    setInput(results[index].label)
    setResults([])
    handleSubmit(index)
  }

  //handle dropdown navigation with arrows
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % results.length
        resultRefs.current[newIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
        return newIndex
      })
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex(prevIndex => {
        const newIndex = (prevIndex - 1 + results.length) % results.length
        resultRefs.current[newIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
        return newIndex
      })
    } else if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit(selectedIndex)
    }
  }

  const handleSubmit = (index: number) => {
    // -1 for the case when using default location
    const selectedLocation = index === -1 ? {
      y: Maps.STARTING_COORDS.lat,
      x: Maps.STARTING_COORDS.lon,
    } : results[index >= 0 ? index : 0] // Pick the top result if nothing is selected

    if (selectedLocation) {
      console.log("Submitted Location:", selectedLocation)
      localStorage.setItem("user-location", JSON.stringify(selectedLocation))
      router.push("/calculate")
    }
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        handleSubmit(selectedIndex)
      }}
      className="flex w-full flex-col items-center justify-center bg-slate-200 max-w-screen-sm mx-auto"
    >
      <div className="flex w-screen max-w-screen-sm items-center justify-center p-3">
        <input
          type="text"
          onChange={e => debouncedSetInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={Strings.ADDRESS_BAR_PLACEHOLDER}
          className="h-full w-full p-3 text-sm sm:text-base rounded-sm shadow-md border-2 border-muted"
        />
        {/* <Button
          type="submit"
          size={"sm"}
          className="-mr-3 rounded-none border-none bg-transparent shadow-none hover:bg-transparent"
        >
          <span className="hidden bg-black p-2 sm:inline-block sm:text-base">
            {Strings.ADDRESS_BAR_SUBMIT_TEXT}
          </span>
          <span className="rounded-full bg-black p-2 sm:hidden">
            <ArrowRight size={16} />
          </span>
        </Button> */}
      </div>
      <ul className={cn("w-full overflow-y-auto rounded bg-white shadow-lg p-3 max-h-[25vh]", results?.length === 0 && "hidden")}>
        {results.map((result: SearchResult, index: number) => (
          <li
            key={index}
            ref={el => {
              resultRefs.current[index] = el
            }}
            onClick={() => handleSelectResult(index)}
            className={`cursor-pointer border-b p-2 last:border-none hover:bg-gray-100 ${
              selectedIndex === index ? "bg-gray-200" : ""
            }`}
          >
            {result.label}
          </li>
        ))}
      </ul>
      <button className='text-muted-foreground underline text-lg py-8' onClick={() => handleSubmit(-1)}>Or, drop a pin on the map?</button>
    </form>
  )
}
