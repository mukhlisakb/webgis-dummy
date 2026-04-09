import { useReducer, useCallback } from 'react'
import type { FeatureCollection } from 'geojson'
import type { GeometryType } from '../utils/geojsonParser'

export interface GeoJSONLayer {
  id: string
  name: string
  featureCollection: FeatureCollection
  color: string
  visible: boolean
  geometryType: GeometryType
  featureCount: number
}

type Action =
  | { type: 'ADD_LAYER'; payload: GeoJSONLayer }
  | { type: 'REMOVE_LAYER'; id: string }
  | { type: 'TOGGLE_VISIBILITY'; id: string }
  | { type: 'SET_COLOR'; id: string; color: string }

function reducer(state: GeoJSONLayer[], action: Action): GeoJSONLayer[] {
  switch (action.type) {
    case 'ADD_LAYER':
      return [...state, action.payload]
    case 'REMOVE_LAYER':
      return state.filter(l => l.id !== action.id)
    case 'TOGGLE_VISIBILITY':
      return state.map(l =>
        l.id === action.id ? { ...l, visible: !l.visible } : l,
      )
    case 'SET_COLOR':
      return state.map(l =>
        l.id === action.id ? { ...l, color: action.color } : l,
      )
    default:
      return state
  }
}

export function useGeoJSONLayers() {
  const [layers, dispatch] = useReducer(reducer, [])

  const addLayer = useCallback((layer: GeoJSONLayer) => {
    dispatch({ type: 'ADD_LAYER', payload: layer })
  }, [])

  const removeLayer = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_LAYER', id })
  }, [])

  const toggleVisibility = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_VISIBILITY', id })
  }, [])

  const setColor = useCallback((id: string, color: string) => {
    dispatch({ type: 'SET_COLOR', id, color })
  }, [])

  return { layers, addLayer, removeLayer, toggleVisibility, setColor }
}
