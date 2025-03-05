"use client"

import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet"
import { Icon } from "leaflet"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { LocateFixed } from "lucide-react"
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch"
import "leaflet/dist/leaflet.css"
import "leaflet-geosearch/dist/geosearch.css"
import "./style.css"
import L from "leaflet"
import Maps from "@/constants/Maps"

const pinIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  iconSize: [25, 41],
})

const icon = L.icon({
  iconSize: [0, 0],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
})

export default function Map() {
  const storedLocation = JSON.parse(
    localStorage.getItem("user-location") || "null"
  )

  const [position, setPosition] = useState<[number, number]>([
    storedLocation.y ?? Maps.STARTING_COORDS.lon,
    storedLocation.x ?? Maps.STARTING_COORDS.lat,
  ])

  console.log("position: ", position)

  const [error, setError] = useState<string | null>(null)

  const handleSuccess = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords
    // Update the local storage
    localStorage.setItem(
      "user-location",
      JSON.stringify({
        y: longitude,
        x: latitude,
      })
    )
    // Update the current state
    setPosition([longitude, latitude])
  }

  const handleError = (error: GeolocationPositionError) => {
    setError(error.message)
  }

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError)
    } else {
      setError("Geolocation is not supported by this browser.")
    }
  }

  return (
    <div className="relative md:basis-2/3 basis-full h-full">
      <MapContainer center={position} zoom={15} scrollWheelZoom={false} className="!w-full !h-full" >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={pinIcon}></Marker>
        <CenterMapOnPosition position={position} />
        <MapClickHandler onPositionChange={setPosition} />
        <LeafletGeoSearch onPositionChange={setPosition} />
      </MapContainer>
      <Button
        size="sm"
        onClick={handleLocationClick}
        className="absolute top-5 lg:top-auto lg:bottom-5 lg:right-5 right-2 aspect-square lg:aspect-auto z-50 space-x-2 py-2"
      >
        <LocateFixed />
        <p className="hidden lg:inline-block">Use Current Location</p>
      </Button>
      {error && <div className="error">{error}</div>}
    </div>
  )
}

const MapClickHandler = ({
  onPositionChange,
}: {
  onPositionChange: (position: [number, number]) => void
}) => {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

const CenterMapOnPosition = ({ position }: { position: [number, number] }) => {
  const map = useMap()
  map.setView(position, map.getZoom())
  return null
}

function LeafletGeoSearch({
  onPositionChange,
}: {
  onPositionChange: (position: [number, number]) => void
}) {
  const map = useMap()
  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      style: "bar",
      marker: {
        icon,
        draggable: true,
      },
    })
    map.addControl(searchControl)

    // Add event listener for geosearch/showlocation
    map.on("geosearch/showlocation", (result: any) => {
      const { location } = result
      onPositionChange([location.y, location.x])
    })

    // Add event listener for geosearch/marker/dragend
    map.on("geosearch/marker/dragend", event => {
      const { lat, lng } = (event as any).location
      onPositionChange([lng, lat])
    })

    return () => {
      map.removeControl(searchControl)
      map.off("geosearch/showlocation")
      map.off("geosearch/marker/dragend")
    }
  }, [map])

  return null
}
