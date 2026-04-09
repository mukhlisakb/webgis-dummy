import type { GeoJSON, FeatureCollection, Geometry } from 'geojson'

export type GeometryType = 'Point' | 'LineString' | 'Polygon' | 'Unknown'

export interface ParsedGeoJSON {
  featureCollection: FeatureCollection
  geometryType: GeometryType
  featureCount: number
}

export function parseGeoJSON(raw: string): ParsedGeoJSON {
  let data: GeoJSON
  try {
    data = JSON.parse(raw)
  } catch {
    throw new Error('Invalid JSON: cannot parse file content')
  }

  // Accept FeatureCollection or single Feature or Geometry
  let fc: FeatureCollection
  if (data.type === 'FeatureCollection') {
    fc = data as FeatureCollection
  } else if (data.type === 'Feature') {
    fc = { type: 'FeatureCollection', features: [data as never] }
  } else if (
    [
      'Point','MultiPoint','LineString','MultiLineString',
      'Polygon','MultiPolygon','GeometryCollection',
    ].includes(data.type)
  ) {
    fc = {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: data as Geometry, properties: {} }],
    }
  } else {
    throw new Error('Unsupported GeoJSON type: ' + (data as { type: string }).type)
  }

  if (!Array.isArray(fc.features)) {
    throw new Error('FeatureCollection must have a features array')
  }

  const geometryType = detectGeometryType(fc)
  return { featureCollection: fc, geometryType, featureCount: fc.features.length }
}

function detectGeometryType(fc: FeatureCollection): GeometryType {
  for (const feature of fc.features) {
    const type = feature.geometry?.type
    if (!type) continue
    if (type === 'Point' || type === 'MultiPoint') return 'Point'
    if (type === 'LineString' || type === 'MultiLineString') return 'LineString'
    if (type === 'Polygon' || type === 'MultiPolygon') return 'Polygon'
  }
  return 'Unknown'
}

export function extractProperties(feature: GeoJSON.Feature): Record<string, string> {
  if (!feature.properties) return {}
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(feature.properties)) {
    if (value !== null && value !== undefined) {
      result[key] = String(value)
    }
  }
  return result
}
