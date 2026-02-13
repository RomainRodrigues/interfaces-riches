"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { POI } from "@/types/film"

// Configure default Leaflet icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

interface MapProps {
  pois: POI[]
  onTimestampClick?: (time: string) => void
}

export default function Map({ pois, onTimestampClick }: MapProps) {
  // Calculate bounds to center the map
  const getBounds = () => {
    if (pois.length === 0) return { center: [40.7, -80.1] as [number, number], zoom: 9 }

    const latitudes = pois.map((p) => p.latitude)
    const longitudes = pois.map((p) => p.longitude)

    const minLat = Math.min(...latitudes)
    const maxLat = Math.max(...latitudes)
    const minLng = Math.min(...longitudes)
    const maxLng = Math.max(...longitudes)

    const centerLat = (minLat + maxLat) / 2
    const centerLng = (minLng + maxLng) / 2

    return { center: [centerLat, centerLng] as [number, number], zoom: 9 }
  }

  const bounds = getBounds()

  return (
    <MapContainer
      center={bounds.center}
      zoom={bounds.zoom}
      className="h-full w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pois.map((poi) => (
        <Marker key={poi.id} position={[poi.latitude, poi.longitude]}>
          <Popup>
            <h2 className="font-semibold text-base">{poi.title}</h2>
            <p className="text-sm text-gray-700">{poi.description}</p>
            {poi.timestamps && poi.timestamps.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <h3 className="text-xs font-semibold mb-2">Scenes:</h3>
                <ul 
                  className="space-y-1 max-h-25 overflow-y-auto"
                  aria-label="List of available scenes"
                >
                  {poi.timestamps.map((ts, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => onTimestampClick?.(ts.time)}
                        className="block w-full text-left px-2 py-1 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors text-xs"
                        aria-label={`Scene: ${ts.scene} at ${ts.time}`}
                      >
                        <span className="font-mono text-blue-700">{ts.time}</span>
                        <span className="text-gray-900 ml-2">{ts.scene}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}