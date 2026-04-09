import { useState, useRef, useCallback } from 'react'
import { parseGeoJSON } from '../utils/geojsonParser'
import { getNextColor } from '../utils/layerStyling'
import type { GeoJSONLayer } from '../hooks/useGeoJSONLayers'

interface GeoJSONUploadProps {
  open: boolean
  onClose: () => void
  onLayerAdd: (layer: GeoJSONLayer) => void
}

export function GeoJSONUpload({ open, onClose, onLayerAdd }: GeoJSONUploadProps) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    async (file: File) => {
      setLoading(true)
      setError(null)
      try {
        if (!file.name.match(/\.(geojson|json)$/i)) {
          throw new Error('Please upload a .geojson or .json file')
        }
        const text = await file.text()
        const parsed = parseGeoJSON(text)
        const layer: GeoJSONLayer = {
          id: `layer-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name.replace(/\.(geojson|json)$/i, ''),
          featureCollection: parsed.featureCollection,
          color: getNextColor(),
          visible: true,
          geometryType: parsed.geometryType,
          featureCount: parsed.featureCount,
        }
        onLayerAdd(layer)
        onClose()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to parse GeoJSON')
      } finally {
        setLoading(false)
      }
    },
    [onLayerAdd, onClose],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
    },
    [processFile],
  )

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Upload GeoJSON"
      >
        <div className="modal-header">
          <h2 className="modal-title">Upload GeoJSON Layer</h2>
          <button className="modal-close-btn" onClick={onClose} id="upload-modal-close">
            ✕
          </button>
        </div>

        <div
          id="geojson-dropzone"
          className={`drop-zone ${dragging ? 'drop-zone--active' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="drop-zone-icon">📂</div>
          <p className="drop-zone-text">
            {loading ? 'Parsing...' : 'Drop your GeoJSON file here'}
          </p>
          <p className="drop-zone-sub">or click to browse</p>
          <p className="drop-zone-formats">Supports: .geojson, .json</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".geojson,.json"
            className="sr-only"
            onChange={handleFileChange}
            id="geojson-file-input"
          />
        </div>

        {error && (
          <div className="upload-error" role="alert">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  )
}
