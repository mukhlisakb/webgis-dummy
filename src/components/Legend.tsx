import { useState } from 'react'
import type { GeoJSONLayer } from '../hooks/useGeoJSONLayers'

interface LegendProps {
  layers: GeoJSONLayer[]
}

const GEOMETRY_ICONS: Record<string, string> = {
  Point: '●',
  LineString: '─',
  Polygon: '▬',
  Unknown: '?',
}

export function Legend({ layers }: LegendProps) {
  const [collapsed, setCollapsed] = useState(false)
  const visible = layers.filter(l => l.visible)

  if (visible.length === 0) return null

  return (
    <div className="legend-panel" id="legend-panel">
      <button
        className="legend-header"
        onClick={() => setCollapsed(c => !c)}
        id="legend-toggle"
      >
        <span className="legend-title">Legend</span>
        <span className="legend-chevron">{collapsed ? '▲' : '▼'}</span>
      </button>

      {!collapsed && (
        <div className="legend-items">
          {visible.map(layer => (
            <div key={layer.id} className="legend-item">
              <span
                className="legend-swatch"
                style={{ background: layer.color }}
                title={layer.geometryType}
              >
                {GEOMETRY_ICONS[layer.geometryType]}
              </span>
              <div className="legend-info">
                <span className="legend-name">{layer.name}</span>
                <span className="legend-meta">{layer.featureCount} features</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
