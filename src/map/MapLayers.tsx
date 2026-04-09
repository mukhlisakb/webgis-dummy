import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import bbox from '@turf/bbox'
import { useMapContext } from '../context/MapContext'
import type { GeoJSONLayer } from '../hooks/useGeoJSONLayers'
import { buildLayerStyle, getLayerIds } from '../utils/layerStyling'

interface MapLayersProps {
  layers: GeoJSONLayer[]
  onFeatureClick?: (properties: Record<string, string>, lngLat: maplibregl.LngLat) => void
}

export function MapLayers({ layers, onFeatureClick }: MapLayersProps) {
  const { map } = useMapContext()
  const prevLayerIds = useRef<Set<string>>(new Set())

  // Sync layers to map
  useEffect(() => {
    if (!map) return

    const currentIds = new Set(layers.map(l => l.id))

    // Remove layers that were deleted
    for (const prevId of prevLayerIds.current) {
      if (!currentIds.has(prevId)) {
        const layer = layers.find(l => l.id === prevId)
        const geometryType = layer?.geometryType ?? 'Polygon'
        const layerIds = getLayerIds(prevId, geometryType)
        for (const lid of layerIds) {
          if (map.getLayer(lid)) map.removeLayer(lid)
        }
        if (map.getSource(prevId)) map.removeSource(prevId)
      }
    }

    // Add or update layers
    for (const layer of layers) {
      // Add source if not present
      if (!map.getSource(layer.id)) {
        map.addSource(layer.id, {
          type: 'geojson',
          data: layer.featureCollection,
        })

        const specs = buildLayerStyle(layer.id, layer.color, layer.geometryType)
        for (const spec of specs) {
          map.addLayer(spec)
        }

        // Click handler
        const clickableLayerId =
          layer.geometryType === 'Polygon' ? `${layer.id}-fill` : layer.id
        map.on('click', clickableLayerId, (e) => {
          const feature = e.features?.[0]
          if (!feature) return
          const props: Record<string, string> = {}
          for (const [k, v] of Object.entries(feature.properties ?? {})) {
            props[k] = String(v)
          }
          if (onFeatureClick) {
            onFeatureClick(props, e.lngLat)
          }
        })
        map.on('mouseenter', clickableLayerId, () => {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', clickableLayerId, () => {
          map.getCanvas().style.cursor = ''
        })
      } else {
        // Update data
        const source = map.getSource(layer.id) as maplibregl.GeoJSONSource
        source.setData(layer.featureCollection)
      }

      // Visibility
      const layerIds = getLayerIds(layer.id, layer.geometryType)
      for (const lid of layerIds) {
        if (map.getLayer(lid)) {
          map.setLayoutProperty(lid, 'visibility', layer.visible ? 'visible' : 'none')
        }
      }
    }

    prevLayerIds.current = currentIds

    // Cleanup popup on re-render (optional)
    return () => {
      // no-op; popup managed by click handler
    }
  }, [map, layers, onFeatureClick])


  return null
}

export function useZoomToLayer(map: maplibregl.Map | null) {
  return (layer: GeoJSONLayer) => {
    if (!map) return
    try {
      const [minLng, minLat, maxLng, maxLat] = bbox(layer.featureCollection)
      map.fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        { padding: 60, maxZoom: 16, duration: 800 },
      )
    } catch {
      // fallback: center on Indonesia
      map.flyTo({ center: [118.0, -2.5], zoom: 5, duration: 800 })
    }
  }
}
