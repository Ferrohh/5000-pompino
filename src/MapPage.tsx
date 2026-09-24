import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import * as L from 'leaflet'
import { mantovaPoints, type MantovaPoint } from './main'

function PageIntro({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: ReactNode }) {
  return <div className="page-intro"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="intro-copy">{copy}</p></div>{action}</div>
}

export default function MapPage() {
  const [selectedPoint, setSelectedPoint] = useState<MantovaPoint | null>(null)

  return (
    <div className="page">
      <PageIntro
        eyebrow="MANTOVA IN MAPPA"
        title="La città, punto per punto."
        copy="Una mappa reale di Mantova con punti demo cliccabili: ogni marker apre un popup e i dati si modificano facilmente a mano dall'array dei punti."
        action={<button className="outline-button"><span className="refresh">↻</span> Aggiornata ora</button>}
      />

      <div className="map-layout mantova-map-layout">
        <div className="map-panel mantova-map-panel">
          <div className="map-toolbar">
            <div className="map-search">⌕ <span>Mantova, Lombardia</span></div>
            <div className="map-legend">
              <span><i className="legend-dot good"></i> Ottimale</span>
              <span><i className="legend-dot caution"></i> Attenzione</span>
            </div>
          </div>

          <div className="mantova-map-frame">
            <LeafletMantovaMap points={mantovaPoints} selectedPoint={selectedPoint} onSelect={setSelectedPoint} />
          </div>

          {selectedPoint && (
            <div className="selected-point-card">
              <div>
                <p className="eyebrow">PUNTO SELEZIONATO</p>
                <h3>{selectedPoint.name}</h3>
                <p>{selectedPoint.id}</p>
              </div>
              <p>Lat {selectedPoint.lat.toFixed(4)} · Lng {selectedPoint.lng.toFixed(4)} · Livello idrometrico {selectedPoint.livelloIdrometrico}</p>
            </div>
          )}
        </div>

        <aside className="sensor-list mantova-list">
          <div className="list-header">
            <div>
              <p className="eyebrow">PUNTI DEMO</p>
              <h3>{mantovaPoints.length} punti attivi</h3>
            </div>
            <span className="filter-button">Mantova⌄</span>
          </div>

          {mantovaPoints.map((point) => (
            <button
              className={`sensor-row ${selectedPoint?.id === point.id ? 'selected' : ''}`}
              key={point.id}
              onClick={() => setSelectedPoint(point)}
            >
              <span className={`list-marker ${point.status === 'Attenzione' ? 'caution' : ''}`}>⌁</span>
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
        </aside>
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
    html: `<span class="mantova-pin ${point.status === 'Attenzione' ? 'warning' : ''} ${selected ? 'selected' : ''}"></span>`,
    iconSize: [22, 30],
    iconAnchor: [11, 30],
    popupAnchor: [0, -24],
  })

  const popupHtml = (point: MantovaPoint) => `
    <div class="mantova-popup">
      <p class="eyebrow">${point.id}</p>
      <h3>${point.name}</h3>
      <strong>Lat ${point.lat.toFixed(4)} · Lng ${point.lng.toFixed(4)}</strong>
      <p>Livello idrometrico: ${point.livelloIdrometrico}</p>
      <span class="popup-tag ${point.status === 'Attenzione' ? 'warning' : ''}">${point.status}</span>
    </div>
  `

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return

    const map = L.map(mapElementRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: !compact,
      doubleClickZoom: !compact,
      boxZoom: !compact,
      keyboard: !compact,
    }).setView([45.156, 10.792], 14)

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

    return () => {
      map.remove()
      mapRef.current = null
      markerRefs.current = {}
    }
  }, [onSelect, points, selectedPoint?.id])

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


