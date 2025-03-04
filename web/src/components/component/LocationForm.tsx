"use client"

import "@/components/ui/form"
import { useEffect, useState, useRef } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { OpenStreetMapProvider } from "leaflet-geosearch"
import { SearchResult } from "leaflet-geosearch/dist/providers/provider.js"
import { useRouter } from "next/navigation"
import Strings from "@/constants/Strings"
import { cn } from "@/lib/utils"
import Maps from "@/constants/Maps"
import { twMerge } from "tailwind-merge"

export default function LocationForm({ className }: { className?: string }) {
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
    const selectedLocation =
      index === -1
        ? {
            y: Maps.STARTING_COORDS.lat,
            x: Maps.STARTING_COORDS.lon,
          }
        : results[index >= 0 ? index : 0] // Pick the top result if nothing is selected

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
      className={twMerge(
        "flex w-full max-w-screen-sm flex-col items-center sm:items-start justify-center",
        className
      )}
    >
      <div className="glass flex w-screen max-w-full justify-center p-3">
        <input
          type="text"
          onChange={e => debouncedSetInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={Strings.ADDRESS_BAR_PLACEHOLDER}
          className="h-full w-full rounded-sm border-2 border-muted p-3 text-sm shadow-md sm:text-base"
        />
      </div>
      <div className="relative w-full">
        <ul
          className={cn(
            "max-h-[25vh] absolute top-0 z-20 w-full overflow-y-auto rounded bg-white p-3 shadow-lg",
            results?.length === 0 && "hidden"
          )}
        >
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
        <button
          className="mt-4 absolute top-0 px-6 py-2 text-lg text-white/85 underline"
          onClick={() => handleSubmit(-1)}
        >
          Or, drop a pin on the map?
        </button>
      </div>
    </form>
  )
}
