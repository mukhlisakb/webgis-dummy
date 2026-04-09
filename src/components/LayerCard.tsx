import { useMapContext } from '../context/MapContext'
import { useZoomToLayer } from '../map/MapLayers'
import type { GeoJSONLayer } from '../hooks/useGeoJSONLayers'

interface LayerCardProps {
  layer: GeoJSONLayer
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onColorChange: (id: string, color: string) => void
}

const GEOMETRY_ICONS: Record<string, string> = {
  Point: '●',
  LineString: '─',
  Polygon: '▬',
  Unknown: '?',
}

export function LayerCard({ layer, onToggle, onRemove, onColorChange }: LayerCardProps) {
  const { map } = useMapContext()
  const zoomToLayer = useZoomToLayer(map)

  return (
    <div className={`layer-card ${!layer.visible ? 'layer-card--hidden' : ''}`} id={`layer-card-${layer.id}`}>
      <div className="layer-card-header">
        <div className="layer-card-color-wrap">
          <label className="layer-card-color-label" title="Click to change color">
            <span
              className="layer-card-color-swatch"
              style={{ background: layer.color }}
            />
            <input
              type="color"
              value={layer.color}
              onChange={e => onColorChange(layer.id, e.target.value)}
              className="layer-card-color-input"
              id={`layer-color-${layer.id}`}
              title="Layer color"
            />
          </label>
        </div>

        <div className="layer-card-info">
          <span className="layer-card-name" title={layer.name}>{layer.name}</span>
          <div className="layer-card-meta">
            <span className="layer-card-badge">
              {GEOMETRY_ICONS[layer.geometryType]} {layer.geometryType}
            </span>
            <span className="layer-card-count">{layer.featureCount} ft</span>
          </div>
        </div>

        <div className="layer-card-actions">
          {/* Visibility toggle */}
          <button
            className={`layer-action-btn ${layer.visible ? 'layer-action-btn--active' : ''}`}
            onClick={() => onToggle(layer.id)}
            title={layer.visible ? 'Hide layer' : 'Show layer'}
            id={`layer-toggle-${layer.id}`}
          >
            {layer.visible ? '👁️' : '🙈'}
          </button>

          {/* Zoom to layer */}
          <button
            className="layer-action-btn"
            onClick={() => zoomToLayer(layer)}
            title="Zoom to layer"
            id={`layer-zoom-${layer.id}`}
          >
            🎯
          </button>

          {/* Remove layer */}
          <button
            className="layer-action-btn layer-action-btn--danger"
            onClick={() => onRemove(layer.id)}
            title="Remove layer"
            id={`layer-remove-${layer.id}`}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
