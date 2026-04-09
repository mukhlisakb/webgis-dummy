import { useState } from 'react'
import { BASEMAPS } from '../utils/basemaps'
import { useMapContext } from '../context/MapContext'
import { useBasemapSwitcher } from '../map/MapContainer'
import { FiMap, FiGlobe, FiImage, FiSun, FiLayers } from 'react-icons/fi'

const BASEMAP_ICONS: Record<string, React.ReactNode> = {
  osm: <FiMap />,
  satellite: <FiGlobe />,
  terrain: <FiImage />,
  light: <FiSun />,
}

export function BasemapSwitcher() {
  const { map } = useMapContext()
  const { switchBasemap } = useBasemapSwitcher(map)
  const [activeId, setActiveId] = useState('osm')
  const [open, setOpen] = useState(false)

  const handleSwitch = (id: string) => {
    switchBasemap(id)
    setActiveId(id)
    setOpen(false)
  }

  return (
    <div className="basemap-switcher">
      <button
        className="basemap-toggle-btn"
        onClick={() => setOpen(o => !o)}
        title="Switch Basemap"
        id="basemap-toggle"
      >
        <FiLayers size={16} style={{ color: '#4DB6AC' }} />
        <span className="basemap-toggle-label">Basemap</span>
      </button>

      {open && (
        <div className="basemap-menu">
          <div className="basemap-menu-title">Basemap</div>
          <div className="basemap-grid">
            {BASEMAPS.map(bm => (
              <button
                key={bm.id}
                id={`basemap-${bm.id}`}
                className={`basemap-item ${activeId === bm.id ? 'basemap-item--active' : ''}`}
                onClick={() => handleSwitch(bm.id)}
              >
                <span className="basemap-item-icon">
                  {BASEMAP_ICONS[bm.id] || <FiMap />}
                </span>
                <span className="basemap-item-name">{bm.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
