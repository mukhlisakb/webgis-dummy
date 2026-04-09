import { createContext, useContext } from 'react'
import type { Map } from 'maplibre-gl'

interface MapContextValue {
  map: Map | null
  setMap: (map: Map | null) => void
}

export const MapContext = createContext<MapContextValue>({
  map: null,
  setMap: () => {},
})

export const useMapContext = () => {
  const ctx = useContext(MapContext)
  return ctx
}
