import { useEffect, useRef, useState, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { DEFAULT_BASEMAP_ID, getBasemapById, buildMapStyle } from '../utils/basemaps'
import { MapContext } from '../context/MapContext'

interface MapContainerProps {
  children?: React.ReactNode
}

export function MapContainer({ children }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [map, setMap] = useState<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const basemap = getBasemapById(DEFAULT_BASEMAP_ID)
    const style = buildMapStyle(basemap)

    const m = new maplibregl.Map({
      container: containerRef.current,
      style,
      center: [118.0, -2.5],
      zoom: 5,
      attributionControl: false,
    })

    m.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right')
    m.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right')
    m.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-left')

    m.on('load', () => {
      mapRef.current = m
      setMap(m)
    })

    return () => {
      m.remove()
      mapRef.current = null
      setMap(null)
    }
  }, [])

  return (
    <MapContext.Provider value={{ map, setMap }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
        {map && children}
      </div>
    </MapContext.Provider>
  )
}

// Hook for switching basemaps — updates only the raster source to preserve user layers
export function useBasemapSwitcher(map: maplibregl.Map | null) {
  const switchBasemap = useCallback(
    (basemapId: string) => {
      if (!map) return
      const basemap = getBasemapById(basemapId)

      // Remove old basemap layer & source, then add new one
      if (map.getLayer('basemap')) {
        map.removeLayer('basemap')
      }
      if (map.getSource('basemap')) {
        map.removeSource('basemap')
      }
      map.addSource('basemap', {
        type: 'raster',
        tiles: [basemap.url],
        tileSize: basemap.tileSize,
        attribution: basemap.attribution,
      })
      map.addLayer(
        {
          id: 'basemap',
          type: 'raster',
          source: 'basemap',
          minzoom: 0,
          maxzoom: 22,
        },
        map.getStyle().layers.find(l => l.id !== 'basemap')?.id, // insert before first non-basemap layer
      )
    },
    [map],
  )
  return { switchBasemap }
}
