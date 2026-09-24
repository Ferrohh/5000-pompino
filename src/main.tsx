import { useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import MapPage from './MapPage'
import './styles.css'

type Page = 'home' | 'mappa' | 'bilancio' | 'dighe' | 'segnalazioni'
type IconName = 'home' | 'map' | 'water' | 'dam' | 'alert'

type Sensor = {
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

const navItems: { id: Page; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Panoramica', icon: 'home' },
  { id: 'mappa', label: 'Mappa del fiume', icon: 'map' },
  { id: 'bilancio', label: 'Bilancio idrico', icon: 'water' },
  { id: 'dighe', label: 'Schema idraulico', icon: 'dam' },
  { id: 'segnalazioni', label: 'Segnalazioni', icon: 'alert' },
]

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" /><path d="M8 21h8" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" /><path d="M9 3v15M15 6v15" /></>,
    water: <><path d="M12 3.5S6 10 6 14.2a6 6 0 0 0 12 0C18 10 12 3.5 12 3.5Z" /><path d="M9 15.5c.6 1 1.5 1.5 3 1.5" /></>,
    dam: <><path d="M4 20h16M6 20V8h12v12M4 8h16M8 12h8M8 16h8" /></>,
    alert: <><path d="M10.3 4.3 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
  }
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function App() {
  const [page, setPage] = useState<Page>('home')
  const [noticeSent, setNoticeSent] = useState(false)

  const navigate = (next: Page) => {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand" onClick={() => navigate('home')} role="button" tabIndex={0}>
          <div className="brand-mark"><span></span><span></span><span></span></div>
          <div><strong>mincio</strong><small>MONITOR</small></div>
        </div>
        <div className="live-pill"><span className="live-dot"></span> DATI IN DIRETTA</div>
        <nav>
          <p className="nav-label">ESPLORA</p>
          {navItems.map((item) => <button className={`nav-item ${page === item.id ? 'active' : ''}`} key={item.id} onClick={() => navigate(item.id)}><Icon name={item.icon} /><span>{item.label}</span>{item.id === 'segnalazioni' && <span className="nav-badge">2</span>}</button>)}
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumb"><span>Territorio</span><b>/</b><strong>{navItems.find((item) => item.id === page)?.label}</strong></div></header>
        {page === 'home' && <Home navigate={navigate} />}
        {page === 'mappa' && <MapPage />}
        {page === 'bilancio' && <BalancePage />}
        {page === 'dighe' && <DamsPage />}
        {page === 'segnalazioni' && <ReportsPage noticeSent={noticeSent} setNoticeSent={setNoticeSent} />}
      </main>
    </div>
  )
}

function PageIntro({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: ReactNode }) {
  return <div className="page-intro"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="intro-copy">{copy}</p></div>{action}</div>
}

function Home({ navigate }: { navigate: (page: Page) => void }) {
  return <div className="page home-page"><section className="hero"><div className="hero-copy"><p className="eyebrow light">MONITORAGGIO DEL BACINO</p><h1>Ogni goccia<br /><em>racconta</em> il fiume.</h1><p>Una lettura condivisa e trasparente dello stato del fiume Mincio, per capire oggi le risorse di domani.</p><button className="primary-button" onClick={() => navigate('mappa')}>Esplora il fiume <span>→</span></button></div><div className="hero-graphic"><div className="sun"></div><div className="mountain m1"></div><div className="mountain m2"></div><div className="hero-river"></div><div className="hero-stats"><span>PORTATA ATTUALE</span><strong>42,6 <small>m³/s</small></strong><b><i></i> +4,2% nell'ultima ora</b></div></div></section><section className="section-block"><div className="section-heading"><div><p className="eyebrow">SITUAZIONE ATTUALE</p><h2>Il fiume, in un colpo d'occhio</h2></div><button className="text-button" onClick={() => navigate('bilancio')}>Vedi bilancio completo <span>↗</span></button></div><div className="metric-grid"><MetricCard label="Livello medio" value="1,79" unit="m" trend="+0,08 m" positive /><MetricCard label="Disponibilità idrica" value="68" unit="%" trend="nella norma" positive /><MetricCard label="Dighe aperte" value="3" unit="/ 5" trend="monitorate" /><MetricCard label="Segnalazioni attive" value="2" unit="" trend="da verificare" warning /></div></section><section className="split-preview"><div className="preview-note"><p className="eyebrow">UNA RETE CONDIVISA</p><h2>La trasparenza<br />parte dai dati.</h2><p>Scopri come i livelli rilevati guidano le decisioni sulla distribuzione dell'acqua durante le emergenze.</p><button className="text-button" onClick={() => navigate('bilancio')}>Come funziona <span>→</span></button></div><div className="mini-map"><div className="mini-river"></div><span className="mini-marker one"></span><span className="mini-marker two"></span><span className="mini-marker three"></span><div className="map-caption"><strong>4 rilevatori attivi</strong><span>Aggiornati in tempo reale</span></div></div></section></div>
}

function MetricCard({ label, value, unit, trend, positive, warning }: { label: string; value: string; unit: string; trend: string; positive?: boolean; warning?: boolean }) {
  return <div className="metric-card"><p>{label}</p><div className="metric-value">{value}<small>{unit}</small></div><span className={`metric-trend ${positive ? 'positive' : ''} ${warning ? 'warning' : ''}`}>{positive && '↗ '}{trend}</span></div>
}

function LegacyMapPage({ selectedSensor, setSelectedSensor }: { selectedSensor: Sensor | null; setSelectedSensor: (sensor: Sensor | null) => void }) {
  return <div className="page"><PageIntro eyebrow="RETE DI MONITORAGGIO" title="Il fiume, punto per punto." copy="Esplora i rilevatori lungo il corso del Mincio e consulta l'ultima lettura disponibile." action={<button className="outline-button"><span className="refresh">↻</span> Aggiornato 2 min fa</button>} /><div className="map-layout"><div className="map-panel"><div className="map-toolbar"><div className="map-search">⌕ <span>Cerca una località</span></div><div className="map-legend"><span><i className="legend-dot good"></i> Normale</span><span><i className="legend-dot caution"></i> Attenzione</span></div></div><div className="river-map"><div className="map-grid"></div><div className="map-water"></div><div className="map-road road-one"></div><div className="map-road road-two"></div><span className="town town-one">Borgo alto</span><span className="town town-two">Piana</span><span className="town town-three">Ponte vecchio</span>{sensors.map((sensor) => <button key={sensor.name} className={`sensor-marker ${sensor.status === 'Attenzione' ? 'caution' : ''} ${selectedSensor?.name === sensor.name ? 'selected' : ''}`} style={{ left: sensor.x, top: sensor.y }} onClick={() => setSelectedSensor(sensor)} aria-label={`Apri dati ${sensor.name}`}><span className="pulse"></span><span className="marker-core">⌁</span></button>)}{selectedSensor && <div className="sensor-popup"><button className="close-popup" onClick={() => setSelectedSensor(null)}>×</button><p className="eyebrow">RILEVATORE {selectedSensor.name}</p><h3>{selectedSensor.place}</h3><div className="popup-values"><div><span>Livello acqua</span><strong>{selectedSensor.level}</strong></div><div><span>Portata</span><strong>{selectedSensor.flow}</strong></div></div><div className="popup-footer"><span className="status-badge"><i></i>{selectedSensor.status}</span><span>Rilevato {selectedSensor.time}</span></div></div>}</div></div><aside className="sensor-list"><div className="list-header"><div><p className="eyebrow">RILEVATORI</p><h3>4 punti attivi</h3></div><span className="filter-button">Tutti⌄</span></div>{sensors.map((sensor) => <button className={`sensor-row ${selectedSensor?.name === sensor.name ? 'selected' : ''}`} key={sensor.name} onClick={() => setSelectedSensor(sensor)}><span className={`list-marker ${sensor.status === 'Attenzione' ? 'caution' : ''}`}>⌁</span><span className="sensor-info"><strong>{sensor.name} <small>{sensor.place}</small></strong><span>Ultima lettura: {sensor.time}</span></span><span className="sensor-level"><strong>{sensor.level}</strong><small>{sensor.status}</small></span></button>)}</aside></div></div>
}

function BalancePage() {
  return <div className="page"><PageIntro eyebrow="RISORSA E DISTRIBUZIONE" title="Il bilancio dell'acqua." copy="Una fotografia chiara della disponibilità idrica nel bacino del Mincio e delle scelte che la proteggono." action={<span className="period-select">Oggi, 24 settembre 2026⌄</span>} /><div className="balance-top"><div className="balance-visual"><div className="balance-ring"><div><strong>68<span>%</span></strong><small>disponibilità</small></div></div><div><p className="eyebrow">ACQUA DISPONIBILE</p><h3>Una situazione stabile</h3><p className="muted-copy">La riserva attuale è sufficiente per coprire i consumi previsti dei prossimi 14 giorni.</p></div></div><div className="balance-numbers"><div><span>Riserva totale</span><strong>18,4 <small>Mm³</small></strong></div><div><span>Consumo giornaliero</span><strong>1,24 <small>Mm³</small></strong></div><div><span>Afflusso ultime 24h</span><strong className="green-text">+1,86 <small>Mm³</small></strong></div></div></div><div className="content-columns"><section className="allocation-card"><div className="card-heading"><div><p className="eyebrow">DOVE VA L'ACQUA</p><h2>Distribuzione attuale</h2></div><span className="small-label">su 1,24 Mm³</span></div><div className="allocation-bar"><span className="agri"></span><span className="civic"></span><span className="ecosystem"></span></div><div className="allocation-legend"><AllocationItem color="agri" title="Agricoltura" value="54%" amount="0,67 Mm³" /><AllocationItem color="civic" title="Uso civile" value="31%" amount="0,38 Mm³" /><AllocationItem color="ecosystem" title="Ecosistema" value="15%" amount="0,19 Mm³" /></div></section><section className="why-card"><p className="eyebrow">IN CASO DI EMERGENZA</p><h2>Perché cambiano<br />le priorità?</h2><p>La distribuzione segue un ordine preciso: prima la sicurezza delle persone, poi la salute del fiume e infine le attività produttive.</p><div className="priority-list"><span><b>01</b><strong>Uso civile</strong><small>Acqua potabile e servizi essenziali</small></span><span><b>02</b><strong>Ecosistema</strong><small>Portata minima vitale del fiume</small></span><span><b>03</b><strong>Agricoltura</strong><small>Colture e riserve alimentari</small></span></div></section></div></div>
}

function AllocationItem({ color, title, value, amount }: { color: string; title: string; value: string; amount: string }) { return <div className="allocation-item"><span><i className={color}></i>{title}</span><strong>{value}</strong><small>{amount}</small></div> }

function DamsPage() {
  return <div className="page"><PageIntro eyebrow="CONTROLLO DELLE OPERE" title="La rete idraulica." copy="Lo schema del Mincio, dal Lago di Garda al Po, ricostruito come tavola tecnica esplorabile." action={<span className="live-status"><i></i> Live · aggiornato ora</span>} /><div className="dam-status-grid"><div><span>Opere monitorate</span><strong>5 <small>/ 5</small></strong></div><div><span>Regolazione attiva</span><strong>3</strong></div><div><span>Portata in uscita</span><strong>42,6 <small>m³/s</small></strong></div><div><span>Allerta operativa</span><strong className="green-text">Nessuna</strong></div></div><section className="hydraulic-card"><div className="card-heading"><div><p className="eyebrow">SCHEMA IDRAULICO DEL MINCIO · REV. 2025</p><h2>Dal Garda al Po</h2></div><span className="small-label">Schema esplorabile</span></div><HydraulicMap /><div className="hydraulic-note"><span className="note-symbol">i</span><p><strong>Come leggere lo schema</strong><br />La linea verde segue il corso principale del Mincio. I rami colorati rappresentano le derivazioni e le connessioni riportate nello schema ufficiale; gli stati delle opere sono dati demo.</p></div></section></div>
}

function HydraulicMap() {
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [origin, setOrigin] = useState({ x: 0, y: 0 })
  const changeZoom = (amount: number) => setZoom((current) => Math.min(1.55, Math.max(.8, current + amount)))
  const reset = () => { setZoom(1); setOffset({ x: 0, y: 0 }) }
  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => { setDragging(true); setOrigin({ x: event.clientX - offset.x, y: event.clientY - offset.y }); event.currentTarget.setPointerCapture(event.pointerId) }
  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => { if (dragging) setOffset({ x: event.clientX - origin.x, y: event.clientY - origin.y }) }

  return <div className="hydraulic-map-wrap flow-map-wrap"><div className="map-controls"><button onClick={() => changeZoom(.1)} aria-label="Ingrandisci schema">+</button><button onClick={() => changeZoom(-.1)} aria-label="Riduci schema">−</button><button onClick={reset} aria-label="Reimposta schema">⌂</button><span>{Math.round(zoom * 100)}%</span></div><div className={`hydraulic-map-viewport flow-map-viewport ${dragging ? 'dragging' : ''}`} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)} onDoubleClick={() => changeZoom(.15)}><div className="flow-route" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}><div className="flow-source"><span className="flow-icon">≈</span><strong>Lago di Garda</strong><small>Afflusso nel Mincio · 56,1 m³/s</small></div><FlowConnector value="56,1 m³/s" /><FlowDam name="Diga di Salionze" code="Regolazione Garda-Mincio" output="42,6 m³/s in uscita" state="Aperta 32%" /><FlowBranch label="Canale Virgilio" value="13,5 m³/s derivati" color="red" /><FlowConnector value="42,6 m³/s" /><FlowDam name="Valeggio sul Mincio" code="Centrale Buse · Centrale Montecorno" output="38,9 m³/s in uscita" state="Regolata" /><FlowBranch label="Canale Seriola · Depuratore Peschiera" value="4,2 m³/s immessi" color="blue" /><FlowConnector value="38,9 m³/s" /><FlowDam name="Scaricatore di Pozzolo" code="Derivazione irrigua" output="34,2 m³/s in uscita" state="Aperta 18%" /><FlowBranch label="Fossa di Pozzolo" value="4,7 m³/s derivati" color="magenta" /><FlowConnector value="34,2 m³/s" /><FlowDam name="Naviglio di Goito" code="Nodo di distribuzione" output="31,8 m³/s in uscita" state="Aperta 18%" /><FlowBranch label="Scolo Caldone · Depuratore Goito" value="2,4 m³/s confluenti" color="green" /><FlowConnector value="31,8 m³/s" /><FlowDam name="Stazione di Casale" code="AIPO · controllo portata" output="29,6 m³/s verso Mantova" state="Monitorata" /><FlowConnector value="29,6 m³/s" /><FlowDam name="Laghi di Mantova" code="Paiolo alto · Paiolo basso" output="27,8 m³/s verso valle" state="Livello stabile" /><FlowBranch label="Botte sifone di Formigosa" value="2,1 m³/s verso Fissero-Tartaro" color="gold" /><FlowConnector value="27,8 m³/s" /><FlowDam name="Conca di S. Leone" code="Canale Gherardo · Scaricatore Vallazza" output="27,8 m³/s al Po" state="Regolata" /><FlowConnector value="27,8 m³/s" /><div className="flow-source flow-po"><span className="flow-icon">Po</span><strong>Fiume Po</strong><small>Uscita dal sistema del Mincio</small></div></div></div></div>
}

function FlowConnector({ value }: { value: string }) { return <div className="flow-connector"><span>{value}</span><i></i></div> }
function FlowDam({ name, code, output, state }: { name: string; code: string; output: string; state: string }) { return <div className="flow-dam"><div className="flow-dam-art"><span></span><span></span><span></span></div><div><strong>{name}</strong><small>{code}</small><b>{state}</b></div><div className="flow-output"><span>PORTATA IN USCITA</span><strong>{output}</strong></div></div> }
function FlowBranch({ label, value, color }: { label: string; value: string; color: string }) { return <div className={`flow-branch ${color}`}><span>↗</span><div><strong>{label}</strong><small>{value}</small></div></div> }

function LegacyHydraulicMap() {
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [origin, setOrigin] = useState({ x: 0, y: 0 })

  const changeZoom = (amount: number) => setZoom((current) => Math.min(2.2, Math.max(.65, current + amount)))
  const reset = () => { setZoom(1); setOffset({ x: 0, y: 0 }) }
  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => { setDragging(true); setOrigin({ x: event.clientX - offset.x, y: event.clientY - offset.y }); event.currentTarget.setPointerCapture(event.pointerId) }
  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => { if (dragging) setOffset({ x: event.clientX - origin.x, y: event.clientY - origin.y }) }

  return <div className="hydraulic-map-wrap"><div className="map-controls"><button onClick={() => changeZoom(.15)} aria-label="Ingrandisci schema">+</button><button onClick={() => changeZoom(-.15)} aria-label="Riduci schema">−</button><button onClick={reset} aria-label="Reimposta schema">⌂</button><span>{Math.round(zoom * 100)}%</span></div><div className={`hydraulic-map-viewport ${dragging ? 'dragging' : ''}`} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)} onDoubleClick={() => changeZoom(.25)} onWheel={(event) => { event.preventDefault(); changeZoom(event.deltaY > 0 ? -.1 : .1) }}><svg className="hydraulic-map-svg" viewBox="0 0 1200 1680" role="img" aria-label="Schema idraulico dettagliato del fiume Mincio" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}><defs><marker id="arrow-green" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#4d9977" /></marker><marker id="arrow-black" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#475b52" /></marker></defs><rect width="1200" height="1680" fill="#f8faf5" /><path className="svg-main-flow" d="M560 120 L560 1570" markerEnd="url(#arrow-green)" /><path className="svg-branch red" d="M560 270 L250 270 L250 350" markerEnd="url(#arrow-black)" /><path className="svg-branch blue" d="M560 360 L890 360" markerEnd="url(#arrow-green)" /><path className="svg-branch magenta" d="M560 620 L930 620" markerEnd="url(#arrow-green)" /><path className="svg-branch green" d="M560 830 L840 830 L840 1040" markerEnd="url(#arrow-green)" /><path className="svg-branch gold" d="M560 1040 L260 1040 L260 1130" markerEnd="url(#arrow-black)" /><path className="svg-branch black" d="M560 1220 L900 1380" markerEnd="url(#arrow-black)" /><path className="svg-branch black" d="M560 1430 L930 1510" markerEnd="url(#arrow-black)" /><SvgLake x="490" y="55" label="Lago di Garda" /><SvgGate x="535" y="155" label="Diga di Salionze" status="Aperta 32%" /><SvgStation x="560" y="315" label="Stazione di Monzambano" detail="ARPA · Q dal 01/02/2001" /><SvgGate x="535" y="455" label="Centrale Buse" status="Regolazione attiva" /><SvgStation x="560" y="555" label="Valeggio sul Mincio" detail="Centrale Montecorno" /><SvgGate x="535" y="700" label="Scaricatore di Pozzolo" status="Aperta 18%" /><SvgGate x="535" y="790" label="Naviglio di Goito" status="Aperta 18%" /><SvgStation x="560" y="900" label="Stazione di Casale" detail="AIPO" /><SvgLake x="490" y="1100" label="Laghi di Mantova" /><SvgGate x="535" y="1280" label="Canale Gherardo" status="Nodo di regolazione" /><SvgGate x="535" y="1430" label="Conca di S. Leone" status="Regolata" /><SvgLake x="490" y="1540" label="Fiume Po" /><SvgLabel x="75" y="245" text="Canale Virgilio" color="#b33d3d" /><SvgLabel x="905" y="345" text="Canale Seriola" color="#3158c7" /><SvgLabel x="945" y="605" text="Derivazione Fossa di Pozzolo" color="#ae4b9d" /><SvgLabel x="850" y="850" text="Naviglio di Goito" color="#4caa4c" /><SvgLabel x="60" y="1035" text="Cavo Osone Vecchio / Nuovo" color="#af7927" /><SvgLabel x="910" y="1365" text="Botte sifone di Formigosa" color="#475b52" /><SvgLabel x="940" y="1500" text="Fissero-Tartaro" color="#475b52" /><text x="78" y="1610" className="svg-title">MINCIO · SCHEMA IDRAULICO · REV. 2025</text><g className="svg-legend"><rect x="875" y="75" width="260" height="190" rx="4" /><text x="900" y="108" className="svg-legend-title">LEGENDA</text><SvgLegendItem y="135" type="lake" text="Laghi e corpi idrici" /><SvgLegendItem y="160" type="station" text="Stazioni di monitoraggio" /><SvgLegendItem y="185" type="gate" text="Derivazioni / biforcazioni" /><SvgLegendItem y="210" type="flow" text="Immissioni / confluenze" /><SvgLegendItem y="235" type="ground" text="Alimentazione falda" /></g></svg></div></div>
}

function SvgLake({ x, y, label }: { x: string; y: string; label: string }) { return <g className="svg-node"><path d={`M${x} ${y} q35 -18 70 0 v33 q-35 18 -70 0z`} fill="#99c9ee" stroke="#2e4c57" strokeWidth="2" /><text x={Number(x) + 85} y={Number(y) + 19} className="svg-node-label">{label}</text></g> }
function SvgStation({ x, y, label, detail }: { x: string; y: string; label: string; detail: string }) { return <g className="svg-node"><ellipse cx={x} cy={y} rx="18" ry="10" fill="#fffdf8" stroke="#333" strokeWidth="2" /><text x={Number(x) + 30} y={Number(y) + 3} className="svg-node-label">{label}</text><text x={Number(x) + 30} y={Number(y) + 20} className="svg-node-detail">{detail}</text></g> }
function SvgGate({ x, y, label, status }: { x: string; y: string; label: string; status: string }) { return <g className="svg-node"><path d={`M${x} ${y} l30 30 m0 -30 l-30 30`} stroke="#e33b35" strokeWidth="10" /><text x={Number(x) + 48} y={Number(y) + 14} className="svg-node-label strong">{label}</text><text x={Number(x) + 48} y={Number(y) + 31} className="svg-node-detail">{status}</text></g> }
function SvgLabel({ x, y, text, color }: { x: string; y: string; text: string; color: string }) { return <text x={x} y={y} fill={color} className="svg-branch-label">{text}</text> }
function SvgLegendItem({ y, type, text }: { y: string; type: string; text: string }) { return <g><circle cx="900" cy={y} r="7" className={`legend-symbol ${type}`} /><text x="920" y={Number(y) + 4} className="svg-legend-text">{text}</text></g> }

function DamNode({ name, code, state, open }: { name: string; code: string; state: string; open?: boolean }) { return <div className={`dam-node ${open ? 'open' : ''}`}><div className="dam-illustration"><span></span><span></span><span></span></div><strong>{name}</strong><small>{code}</small><b>{state}</b></div> }

function ReportsPage({ noticeSent, setNoticeSent }: { noticeSent: boolean; setNoticeSent: (value: boolean) => void }) {
  return <div className="page"><PageIntro eyebrow="PARTECIPA AL MONITORAGGIO" title="Segnalazioni dal territorio." copy="Un'informazione puntuale aiuta tutti a prendersi cura del fiume. Invia una segnalazione, anche senza registrarti." /><div className="report-layout"><section className="report-form-card"><div className="card-heading"><div><p className="eyebrow">NUOVA SEGNALAZIONE</p><h2>Hai notato qualcosa?</h2></div><span className="report-number">#MC-2026</span></div>{noticeSent ? <div className="sent-state"><div className="sent-icon">✓</div><h3>Segnalazione ricevuta</h3><p>Grazie. Il team Mincio verificherà l'informazione e aggiornerà la mappa se necessario.</p><button className="outline-button" onClick={() => setNoticeSent(false)}>Invia un'altra segnalazione</button></div> : <form onSubmit={(event) => { event.preventDefault(); setNoticeSent(true) }}><label>Che cosa hai osservato?<select defaultValue=""><option value="" disabled>Seleziona una categoria</option><option>Livello dell'acqua anomalo</option><option>Ostruzione o rifiuti</option><option>Danno a una sponda</option><option>Altro</option></select></label><label>Dove si trova?<input placeholder="Es. Ponte vecchio, sponda nord" /></label><label>Raccontaci di più <span>(facoltativo)</span><textarea placeholder="Aggiungi dettagli utili..."></textarea></label><div className="form-bottom"><span>Puoi restare anonimo</span><button className="primary-button" type="submit">Invia segnalazione <span>→</span></button></div></form>}</section><aside className="reports-aside"><p className="eyebrow">ULTIME SEGNALAZIONI</p><h2>La comunità osserva.</h2><div className="community-stat"><strong>27</strong><span>segnalazioni<br />ricevute quest'anno</span></div><div className="report-list"><div><span className="report-type yellow"></span><span><strong>Livello acqua</strong><small>Piana agricola · 1h fa</small></span><b>In verifica</b></div><div><span className="report-type green"></span><span><strong>Ostruzione</strong><small>Sentiero valle · ieri</small></span><b className="resolved">Risolta</b></div></div></aside></div></div>
}

export default App

type MincioWindow = Window & { __mincioRoot?: ReturnType<typeof createRoot> }

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Elemento root non trovato')

const mincioWindow = window as MincioWindow
const root = mincioWindow.__mincioRoot ?? createRoot(rootElement)
mincioWindow.__mincioRoot = root
root.render(<App />)
