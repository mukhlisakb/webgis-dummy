import { LayerManager } from './LayerManager'
import type { GeoJSONLayer } from '../hooks/useGeoJSONLayers'

interface SidebarProps {
  layers: GeoJSONLayer[]
  onLayerAdd: (layer: GeoJSONLayer) => void
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onColorChange: (id: string, color: string) => void
  collapsed: boolean
}

export function Sidebar({
  layers,
  onLayerAdd,
  onToggle,
  onRemove,
  onColorChange,
  collapsed,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`} id="sidebar">
      {/* Sidebar Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">🌿</div>
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-name">Wetland GIS</div>
          <div className="sidebar-brand-sub">Indonesia</div>
        </div>
      </div>

      {/* Layer count summary */}
      <div className="sidebar-stats">
        <div className="stat-item">
          <span className="stat-value">{layers.length}</span>
          <span className="stat-label">Layers</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">{layers.filter(l => l.visible).length}</span>
          <span className="stat-label">Visible</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">{layers.reduce((acc, l) => acc + l.featureCount, 0)}</span>
          <span className="stat-label">Features</span>
        </div>
      </div>

      <LayerManager
        layers={layers}
        onLayerAdd={onLayerAdd}
        onToggle={onToggle}
        onRemove={onRemove}
        onColorChange={onColorChange}
      />
    </aside>
  )
}
