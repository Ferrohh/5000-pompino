import { useState } from 'react'
import type { ReactNode } from 'react'

export type Sensor = {
  name: string
  place: string
  level: string
  flow: string
  time: string
  status: 'Ottimale' | 'Attenzione'
  x: string
  y: string
}

const sensors: Sensor[] = [
  { name: 'MC-01', place: 'Ponte vecchio', level: '1,84 m', flow: '42,6 m³/s', time: '2 min fa', status: 'Ottimale', x: '29%', y: '67%' },
  { name: 'MC-02', place: 'Borgo alto', level: '2,12 m', flow: '56,1 m³/s', time: '5 min fa', status: 'Attenzione', x: '47%', y: '46%' },
  { name: 'MC-03', place: 'Diga Nord', level: '1,67 m', flow: '38,9 m³/s', time: '3 min fa', status: 'Ottimale', x: '69%', y: '27%' },
  { name: 'MC-04', place: 'Piana agricola', level: '1,52 m', flow: '34,2 m³/s', time: '8 min fa', status: 'Ottimale', x: '77%', y: '70%' },
]

function PageIntro({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: ReactNode }) {
  return <div className="page-intro"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="intro-copy">{copy}</p></div>{action}</div>
}

export default function MapPage() {
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null)

  return <div className="page"><PageIntro eyebrow="RETE DI MONITORAGGIO" title="Il fiume, punto per punto." copy="Esplora i rilevatori lungo il corso del Mincio e consulta l'ultima lettura disponibile." action={<button className="outline-button"><span className="refresh">↻</span> Aggiornato 2 min fa</button>} /><div className="map-layout"><div className="map-panel"><div className="map-toolbar"><div className="map-search">⌕ <span>Cerca una località</span></div><div className="map-legend"><span><i className="legend-dot good"></i> Normale</span><span><i className="legend-dot caution"></i> Attenzione</span></div></div><div className="river-map"><div className="map-grid"></div><div className="map-water"></div><div className="map-road road-one"></div><div className="map-road road-two"></div><span className="town town-one">Borgo alto</span><span className="town town-two">Piana</span><span className="town town-three">Ponte vecchio</span>{sensors.map((sensor) => <button key={sensor.name} className={`sensor-marker ${sensor.status === 'Attenzione' ? 'caution' : ''} ${selectedSensor?.name === sensor.name ? 'selected' : ''}`} style={{ left: sensor.x, top: sensor.y }} onClick={() => setSelectedSensor(sensor)} aria-label={`Apri dati ${sensor.name}`}><span className="pulse"></span><span className="marker-core">⌁</span></button>)}{selectedSensor && <div className="sensor-popup"><button className="close-popup" onClick={() => setSelectedSensor(null)}>×</button><p className="eyebrow">RILEVATORE {selectedSensor.name}</p><h3>{selectedSensor.place}</h3><div className="popup-values"><div><span>Livello acqua</span><strong>{selectedSensor.level}</strong></div><div><span>Portata</span><strong>{selectedSensor.flow}</strong></div></div><div className="popup-footer"><span className="status-badge"><i></i>{selectedSensor.status}</span><span>Rilevato {selectedSensor.time}</span></div></div>}</div></div><aside className="sensor-list"><div className="list-header"><div><p className="eyebrow">RILEVATORI</p><h3>4 punti attivi</h3></div><span className="filter-button">Tutti⌄</span></div>{sensors.map((sensor) => <button className={`sensor-row ${selectedSensor?.name === sensor.name ? 'selected' : ''}`} key={sensor.name} onClick={() => setSelectedSensor(sensor)}><span className={`list-marker ${sensor.status === 'Attenzione' ? 'caution' : ''}`}>⌁</span><span className="sensor-info"><strong>{sensor.name} <small>{sensor.place}</small></strong><span>Ultima lettura: {sensor.time}</span></span><span className="sensor-level"><strong>{sensor.level}</strong><small>{sensor.status}</small></span></button>)}</aside></div></div>
}
