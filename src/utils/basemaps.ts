export interface BasemapConfig {
  id: string
  name: string
  url: string
  attribution: string
  type: 'raster'
  tileSize: number
}

export const BASEMAPS: BasemapConfig[] = [
  {
    id: 'osm',
    name: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    type: 'raster',
    tileSize: 256,
  },
  {
    id: 'satellite',
    name: 'Satellite',
    url: 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data',
    type: 'raster',
    tileSize: 256,
  },
  {
    id: 'terrain',
    name: 'Terrain',
    url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png',
    attribution: '© Stadia Maps, © Stamen Design, © OpenStreetMap contributors',
    type: 'raster',
    tileSize: 256,
  },
  {
    id: 'light',
    name: 'Light',
    url: 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    attribution: '© CartoDB, © OpenStreetMap contributors',
    type: 'raster',
    tileSize: 256,
  },
]

export const DEFAULT_BASEMAP_ID = 'osm'

export function getBasemapById(id: string): BasemapConfig {
  return BASEMAPS.find(b => b.id === id) ?? BASEMAPS[0]
}

export function buildMapStyle(basemap: BasemapConfig) {
  return {
    version: 8 as const,
    sources: {
      basemap: {
        type: 'raster' as const,
        tiles: [basemap.url],
        tileSize: basemap.tileSize,
        attribution: basemap.attribution,
      },
    },
    layers: [
      {
        id: 'basemap',
        type: 'raster' as const,
        source: 'basemap',
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  }
}
