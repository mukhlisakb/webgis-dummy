import type { GeometryType } from './geojsonParser'
import type { LayerSpecification } from 'maplibre-gl'

// Curated wetland-inspired color palette
const WETLAND_PALETTE = [
  '#4DB6AC', // teal
  '#F4A443', // amber
  '#EF5350', // red
  '#AB47BC', // purple
  '#42A5F5', // blue
  '#66BB6A', // green
  '#FF7043', // deep orange
  '#26C6DA', // cyan
  '#D4E157', // lime
  '#8D6E63', // brown
  '#EC407A', // pink
  '#FFA726', // orange
]

let colorIdx = 0

export function getNextColor(): string {
  const color = WETLAND_PALETTE[colorIdx % WETLAND_PALETTE.length]
  colorIdx++
  return color
}

export function resetColorIndex() {
  colorIdx = 0
}

export interface LayerStyleSpec {
  layers: LayerSpecification[]
}

export function buildLayerStyle(
  sourceId: string,
  color: string,
  geometryType: GeometryType,
): LayerSpecification[] {
  switch (geometryType) {
    case 'Point':
      return [
        {
          id: sourceId,
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-radius': 6,
            'circle-color': color,
            'circle-opacity': 0.85,
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#ffffff',
          },
        },
      ]

    case 'LineString':
      return [
        {
          id: sourceId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': color,
            'line-width': 2.5,
            'line-opacity': 0.9,
          },
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
        },
      ]

    case 'Polygon':
    default:
      return [
        {
          id: `${sourceId}-fill`,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': color,
            'fill-opacity': 0.35,
          },
        },
        {
          id: `${sourceId}-outline`,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': color,
            'line-width': 1.5,
            'line-opacity': 0.85,
          },
        },
      ]
  }
}

export function getLayerIds(layerId: string, geometryType: GeometryType): string[] {
  if (geometryType === 'Polygon') {
    return [`${layerId}-fill`, `${layerId}-outline`]
  }
  return [layerId]
}
