import { useEffect, useRef, useState } from 'react'
import * as L from 'leaflet'
import { mantovaPoints, type MantovaPoint } from './main'
import { PointIcon, getPointIconSvg } from './icons'

export default function MapPage({ initialPoint, onOpenHistory }: { initialPoint: MantovaPoint | null; onOpenHistory: (point: MantovaPoint) => void }) {
  const [selectedPoint, setSelectedPoint] = useState<MantovaPoint | null>(initialPoint)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const matchingPoints = mantovaPoints.filter((point) => `${point.name} ${point.id}`.toLowerCase().includes(searchQuery.toLowerCase().trim()))

  return (
    <div className="page map-screen-page">
      <div className="map-layout mantova-map-layout">
        <div className="map-panel mantova-map-panel">
          <div className="map-search-control">
            <button className="map-search-toggle" onClick={() => setSearchOpen((open) => !open)} aria-label="Cerca un punto sulla mappa" aria-expanded={searchOpen}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.4"></circle><path d="m16 16 5 5"></path></svg>
            </button>
            {searchOpen && <div className="map-search-panel"><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Cerca un punto" aria-label="Cerca un punto" />{searchQuery && <div className="map-search-results">{matchingPoints.length ? matchingPoints.map((point) => <button key={point.id} onClick={() => { setSelectedPoint(point); setSearchOpen(false) }}><strong>{point.name}</strong><small>{point.id} · {point.livelloIdrometrico}</small></button>) : <span>Nessun punto trovato</span>}</div>}</div>}
          </div>

          <div className="mantova-map-frame">
            <LeafletMantovaMap points={mantovaPoints} selectedPoint={selectedPoint} onSelect={setSelectedPoint} />
          </div>

        </div>

        {selectedPoint ? <div className="selected-point-card">
          <div>
            <p className="eyebrow">PUNTO SELEZIONATO</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`list-marker ${selectedPoint.status === 'Attenzione' ? 'caution' : ''}`} style={{ width: '22px', height: '22px', flexShrink: 0 }}>
                <PointIcon icon={selectedPoint.icon} size={14} />
              </span>
              <h3 style={{ margin: 0 }}>{selectedPoint.name}</h3>
            </div>
            <p>{selectedPoint.id}</p>
            <p className="selected-point-description">{selectedPoint.description}</p>
          </div>
          <button className="history-button" onClick={() => onOpenHistory(selectedPoint)}>Vai allo storico <span>→</span></button>
        </div> : <aside className="sensor-list mantova-list">
          <div className="list-header">
            <div>
              <p className="eyebrow">PUNTI DEMO</p>
            </div>
          </div>

          {mantovaPoints.map((point) => (
            <button
              className="sensor-row"
              key={point.id}
              onClick={() => setSelectedPoint(point)}
            >
              <span className={`list-marker ${point.status === 'Attenzione' ? 'caution' : ''}`}>
                <PointIcon icon={point.icon} size={15} />
              </span>
              <span className="sensor-info">
                <strong>{point.name} <small>{point.id}</small></strong>
                <span>Livello idrometrico: {point.livelloIdrometrico}</span>
              </span>
              <span className="sensor-level">
                <strong>{point.status}</strong>
                <small>{point.livelloIdrometrico}</small>
              </span>
            </button>
          ))}
        </aside>}
      </div>
    </div>
  )
}

function LeafletMantovaMap({ points, selectedPoint, onSelect, compact }: { points: MantovaPoint[]; selectedPoint: MantovaPoint | null; onSelect: (point: MantovaPoint | null) => void; compact?: boolean }) {
  const mapElementRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRefs = useRef<Record<string, L.Marker>>({})

  const createPointIcon = (point: MantovaPoint, selected: boolean) => L.divIcon({
    className: 'mantova-marker-icon',
    html: `<div class="mantova-pin ${point.status === 'Attenzione' ? 'warning' : ''} ${selected ? 'selected' : ''}">${getPointIconSvg(point.icon, 15)}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  })

  const popupHtml = (point: MantovaPoint) => `
    <div class="mantova-popup">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
        <span class="list-marker ${point.status === 'Attenzione' ? 'caution' : ''}" style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center;">${getPointIconSvg(point.icon, 14)}</span>
        <h3 style="margin:0;">${point.name}</h3>
      </div>
      <p class="eyebrow">${point.id}</p>
      <p>${point.description}</p>
      <strong>Lat ${point.lat.toFixed(4)} · Lng ${point.lng.toFixed(4)}</strong>
      <p>Livello idrometrico: ${point.livelloIdrometrico}</p>
      <span class="popup-tag ${point.status === 'Attenzione' ? 'warning' : ''}">${point.status}</span>
    </div>
  `

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return

    const map = L.map(mapElementRef.current, {
      zoomControl: true,
      scrollWheelZoom: !compact,
      dragging: !compact,
      doubleClickZoom: !compact,
      boxZoom: !compact,
      keyboard: !compact,
    }).setView([45.156, 10.792], compact ? 12 : 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    points.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], {
        icon: createPointIcon(point, selectedPoint?.id === point.id),
      })

      marker.bindPopup(popupHtml(point))
      marker.on('click', () => onSelect(point))
      marker.addTo(map)
      markerRefs.current[point.id] = marker
    })

    mapRef.current = map
    map.on('click', () => {
      map.closePopup()
      onSelect(null)
    })

    return () => {
      map.remove()
      mapRef.current = null
      markerRefs.current = {}
    }
  }, [onSelect, points])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    points.forEach((point) => {
      const marker = markerRefs.current[point.id]
      if (!marker) return
      marker.setIcon(createPointIcon(point, selectedPoint?.id === point.id))
    })

    if (!selectedPoint) return
    map.flyTo([selectedPoint.lat, selectedPoint.lng], 15.5, { duration: 0.8 })
    markerRefs.current[selectedPoint.id]?.openPopup()
  }, [points, selectedPoint])

  return <div ref={mapElementRef} className={`mantova-map ${compact ? 'compact' : ''}`} />
}

export { LeafletMantovaMap }


