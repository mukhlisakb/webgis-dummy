import { useState } from 'react'
import { LayerCard } from './LayerCard'
import { GeoJSONUpload } from './GeoJSONUpload'
import type { GeoJSONLayer } from '../hooks/useGeoJSONLayers'

interface LayerManagerProps {
  layers: GeoJSONLayer[]
  onLayerAdd: (layer: GeoJSONLayer) => void
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onColorChange: (id: string, color: string) => void
}

export function LayerManager({
  layers,
  onLayerAdd,
  onToggle,
  onRemove,
  onColorChange,
}: LayerManagerProps) {
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <div className="layer-manager">
      <div className="layer-manager-header">
        <h3 className="layer-manager-title">Layers</h3>
        <button
          className="upload-btn"
          onClick={() => setUploadOpen(true)}
          id="upload-geojson-btn"
          title="Upload GeoJSON"
        >
          <span className="upload-btn-icon">+</span>
          Add Layer
        </button>
      </div>

      <div className="layer-manager-list">
        {layers.length === 0 ? (
          <div className="layer-manager-empty">
            <div className="empty-icon">🗂️</div>
            <p className="empty-text">No layers yet</p>
            <p className="empty-sub">Upload a GeoJSON file to get started</p>
          </div>
        ) : (
          layers.map(layer => (
            <LayerCard
              key={layer.id}
              layer={layer}
              onToggle={onToggle}
              onRemove={onRemove}
              onColorChange={onColorChange}
            />
          ))
        )}
      </div>

      <GeoJSONUpload
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onLayerAdd={onLayerAdd}
      />
    </div>
  )
}
