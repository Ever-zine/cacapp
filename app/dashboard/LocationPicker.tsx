'use client'

import { CircleMarker, MapContainer, TileLayer, useMapEvents } from 'react-leaflet'

interface LocationPickerProps {
  latitude: number | null
  longitude: number | null
  onChange: (latitude: number, longitude: number) => void
}

const FRANCE_CENTER: [number, number] = [46.603354, 1.888334]

function MapClickHandler({ onChange }: Pick<LocationPickerProps, 'onChange'>) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat, event.latlng.lng)
    },
  })

  return null
}

export default function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  const selectedPosition: [number, number] | null = latitude !== null && longitude !== null
    ? [latitude, longitude]
    : null
  const center = selectedPosition ?? FRANCE_CENTER

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-600">
      <MapContainer
        center={center}
        zoom={selectedPosition ? 15 : 5}
        style={{ height: '260px', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onChange={onChange} />
        {selectedPosition && (
          <CircleMarker
            center={selectedPosition}
            radius={10}
            pathOptions={{ color: '#d97706', fillColor: '#f59e0b', fillOpacity: 0.85, weight: 3 }}
          />
        )}
      </MapContainer>
    </div>
  )
}
