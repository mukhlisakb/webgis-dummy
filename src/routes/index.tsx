import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { MapContainer } from '../map/MapContainer'
import { MapLayers } from '../map/MapLayers'
import { Legend } from '../components/Legend'
import { BasemapSwitcher } from '../components/BasemapSwitcher'
import { useGeoJSONLayers } from '../hooks/useGeoJSONLayers'
import { useMapContext } from '../context/MapContext'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { layers, addLayer, removeLayer, toggleVisibility, setColor } = useGeoJSONLayers()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="app-layout">
      <Navbar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(c => !c)}
      />

      <div className="app-body">
        <Sidebar
          layers={layers}
          onLayerAdd={addLayer}
          onToggle={toggleVisibility}
          onRemove={removeLayer}
          onColorChange={setColor}
          collapsed={sidebarCollapsed}
        />

        <main className="map-area" id="map-area">
          <MapContainer>
            <MapInner layers={layers} />

            {/* Floating controls */}
            <div className="map-overlay map-overlay--top-left">
              <BasemapSwitcher />
            </div>

            <div className="map-overlay map-overlay--bottom-right">
              <Legend layers={layers} />
            </div>
          </MapContainer>
        </main>
      </div>
    </div>
  )
}

// Inner component rendered inside MapContainer so it has access to MapContext
function MapInner({ layers }: { layers: ReturnType<typeof useGeoJSONLayers>['layers'] }) {
  const { map } = useMapContext()
  const popupRef = useRef<maplibregl.Popup | null>(null)

  const handleFeatureClick = useCallback(
    (properties: Record<string, string>, lngLat: maplibregl.LngLat) => {
      if (!map) return

      // Close existing popup
      if (popupRef.current) {
        popupRef.current.remove()
      }

      const entries = Object.entries(properties).filter(([k]) => !k.startsWith('_'))

      const html = `
        <div class="feature-popup">
          <div class="feature-popup-title">🌿 Feature Properties</div>
          ${
            entries.length === 0
              ? '<p class="feature-popup-empty">No properties</p>'
              : `<div class="feature-popup-table">
              ${entries
                .slice(0, 12)
                .map(
                  ([k, v]) => `
                <div class="feature-popup-row">
                  <span class="feature-popup-key">${escapeHtml(k)}</span>
                  <span class="feature-popup-val">${escapeHtml(v)}</span>
                </div>`,
                )
                .join('')}
              ${entries.length > 12 ? `<div class="feature-popup-more">+${entries.length - 12} more</div>` : ''}
            </div>`
          }
        </div>
      `

      const popup = new maplibregl.Popup({ maxWidth: '320px' })
        .setLngLat(lngLat)
        .setHTML(html)
        .addTo(map)

      popupRef.current = popup
    },
    [map],
  )

  // Cleanup popup when layers change
  useEffect(() => {
    return () => {
      popupRef.current?.remove()
    }
  }, [])

  return <MapLayers layers={layers} onFeatureClick={handleFeatureClick} />
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
