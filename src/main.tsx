import { useState } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
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
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null)
  const [noticeSent, setNoticeSent] = useState(false)

  const navigate = (next: Page) => {
    setPage(next)
    setSelectedSensor(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand" onClick={() => navigate('home')} role="button" tabIndex={0}>
          <div className="brand-mark"><span></span><span></span><span></span></div>
          <div><strong>micio</strong><small>MONITOR</small></div>
        </div>
        <div className="live-pill"><span className="live-dot"></span> DATI IN DIRETTA</div>
        <nav>
          <p className="nav-label">ESPLORA</p>
          {navItems.map((item) => <button className={`nav-item ${page === item.id ? 'active' : ''}`} key={item.id} onClick={() => navigate(item.id)}><Icon name={item.icon} /><span>{item.label}</span>{item.id === 'segnalazioni' && <span className="nav-badge">2</span>}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-box"><span className="help-icon">?</span><div><strong>Hai trovato un problema?</strong><p>Segnalalo al team Micio</p></div></div>
          <div className="last-update"><span className="live-dot"></span><span>Ultimo aggiornamento<br /><strong>24 settembre 2026, 14:32</strong></span></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumb"><span>Territorio</span><b>/</b><strong>{navItems.find((item) => item.id === page)?.label}</strong></div><div className="topbar-actions"><span className="location"><span className="location-pin">⌖</span> Bacino del Micio</span><button className="icon-button" aria-label="Notifiche"><Icon name="alert" /><span className="notification-dot"></span></button><div className="avatar">MC</div></div></header>
        {page === 'home' && <Home navigate={navigate} />}
        {page === 'mappa' && <MapPage selectedSensor={selectedSensor} setSelectedSensor={setSelectedSensor} />}
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
  return <div className="page home-page"><section className="hero"><div className="hero-copy"><p className="eyebrow light">MONITORAGGIO DEL BACINO</p><h1>Ogni goccia<br /><em>racconta</em> il fiume.</h1><p>Una lettura condivisa e trasparente dello stato del fiume Micio, per capire oggi le risorse di domani.</p><button className="primary-button" onClick={() => navigate('mappa')}>Esplora il fiume <span>→</span></button></div><div className="hero-graphic"><div className="sun"></div><div className="mountain m1"></div><div className="mountain m2"></div><div className="hero-river"></div><div className="hero-stats"><span>PORTATA ATTUALE</span><strong>42,6 <small>m³/s</small></strong><b><i></i> +4,2% nell'ultima ora</b></div></div></section><section className="section-block"><div className="section-heading"><div><p className="eyebrow">SITUAZIONE ATTUALE</p><h2>Il fiume, in un colpo d'occhio</h2></div><button className="text-button" onClick={() => navigate('bilancio')}>Vedi bilancio completo <span>↗</span></button></div><div className="metric-grid"><MetricCard label="Livello medio" value="1,79" unit="m" trend="+0,08 m" positive /><MetricCard label="Disponibilità idrica" value="68" unit="%" trend="nella norma" positive /><MetricCard label="Dighe aperte" value="3" unit="/ 5" trend="monitorate" /><MetricCard label="Segnalazioni attive" value="2" unit="" trend="da verificare" warning /></div></section><section className="split-preview"><div className="preview-note"><p className="eyebrow">UNA RETE CONDIVISA</p><h2>La trasparenza<br />parte dai dati.</h2><p>Scopri come i livelli rilevati guidano le decisioni sulla distribuzione dell'acqua durante le emergenze.</p><button className="text-button" onClick={() => navigate('bilancio')}>Come funziona <span>→</span></button></div><div className="mini-map"><div className="mini-river"></div><span className="mini-marker one"></span><span className="mini-marker two"></span><span className="mini-marker three"></span><div className="map-caption"><strong>4 rilevatori attivi</strong><span>Aggiornati in tempo reale</span></div></div></section></div>
}

function MetricCard({ label, value, unit, trend, positive, warning }: { label: string; value: string; unit: string; trend: string; positive?: boolean; warning?: boolean }) {
  return <div className="metric-card"><p>{label}</p><div className="metric-value">{value}<small>{unit}</small></div><span className={`metric-trend ${positive ? 'positive' : ''} ${warning ? 'warning' : ''}`}>{positive && '↗ '}{trend}</span></div>
}

function MapPage({ selectedSensor, setSelectedSensor }: { selectedSensor: Sensor | null; setSelectedSensor: (sensor: Sensor | null) => void }) {
  return <div className="page"><PageIntro eyebrow="RETE DI MONITORAGGIO" title="Il fiume, punto per punto." copy="Esplora i rilevatori lungo il corso del Micio e consulta l'ultima lettura disponibile." action={<button className="outline-button"><span className="refresh">↻</span> Aggiornato 2 min fa</button>} /><div className="map-layout"><div className="map-panel"><div className="map-toolbar"><div className="map-search">⌕ <span>Cerca una località</span></div><div className="map-legend"><span><i className="legend-dot good"></i> Normale</span><span><i className="legend-dot caution"></i> Attenzione</span></div></div><div className="river-map"><div className="map-grid"></div><div className="map-water"></div><div className="map-road road-one"></div><div className="map-road road-two"></div><span className="town town-one">Borgo alto</span><span className="town town-two">Piana</span><span className="town town-three">Ponte vecchio</span>{sensors.map((sensor) => <button key={sensor.name} className={`sensor-marker ${sensor.status === 'Attenzione' ? 'caution' : ''} ${selectedSensor?.name === sensor.name ? 'selected' : ''}`} style={{ left: sensor.x, top: sensor.y }} onClick={() => setSelectedSensor(sensor)} aria-label={`Apri dati ${sensor.name}`}><span className="pulse"></span><span className="marker-core">⌁</span></button>)}{selectedSensor && <div className="sensor-popup"><button className="close-popup" onClick={() => setSelectedSensor(null)}>×</button><p className="eyebrow">RILEVATORE {selectedSensor.name}</p><h3>{selectedSensor.place}</h3><div className="popup-values"><div><span>Livello acqua</span><strong>{selectedSensor.level}</strong></div><div><span>Portata</span><strong>{selectedSensor.flow}</strong></div></div><div className="popup-footer"><span className="status-badge"><i></i>{selectedSensor.status}</span><span>Rilevato {selectedSensor.time}</span></div></div>}</div></div><aside className="sensor-list"><div className="list-header"><div><p className="eyebrow">RILEVATORI</p><h3>4 punti attivi</h3></div><span className="filter-button">Tutti⌄</span></div>{sensors.map((sensor) => <button className={`sensor-row ${selectedSensor?.name === sensor.name ? 'selected' : ''}`} key={sensor.name} onClick={() => setSelectedSensor(sensor)}><span className={`list-marker ${sensor.status === 'Attenzione' ? 'caution' : ''}`}>⌁</span><span className="sensor-info"><strong>{sensor.name} <small>{sensor.place}</small></strong><span>Ultima lettura: {sensor.time}</span></span><span className="sensor-level"><strong>{sensor.level}</strong><small>{sensor.status}</small></span></button>)}</aside></div></div>
}

function BalancePage() {
  return <div className="page"><PageIntro eyebrow="RISORSA E DISTRIBUZIONE" title="Il bilancio dell'acqua." copy="Una fotografia chiara della disponibilità idrica nel bacino del Micio e delle scelte che la proteggono." action={<span className="period-select">Oggi, 24 settembre 2026⌄</span>} /><div className="balance-top"><div className="balance-visual"><div className="balance-ring"><div><strong>68<span>%</span></strong><small>disponibilità</small></div></div><div><p className="eyebrow">ACQUA DISPONIBILE</p><h3>Una situazione stabile</h3><p className="muted-copy">La riserva attuale è sufficiente per coprire i consumi previsti dei prossimi 14 giorni.</p></div></div><div className="balance-numbers"><div><span>Riserva totale</span><strong>18,4 <small>Mm³</small></strong></div><div><span>Consumo giornaliero</span><strong>1,24 <small>Mm³</small></strong></div><div><span>Afflusso ultime 24h</span><strong className="green-text">+1,86 <small>Mm³</small></strong></div></div></div><div className="content-columns"><section className="allocation-card"><div className="card-heading"><div><p className="eyebrow">DOVE VA L'ACQUA</p><h2>Distribuzione attuale</h2></div><span className="small-label">su 1,24 Mm³</span></div><div className="allocation-bar"><span className="agri"></span><span className="civic"></span><span className="ecosystem"></span></div><div className="allocation-legend"><AllocationItem color="agri" title="Agricoltura" value="54%" amount="0,67 Mm³" /><AllocationItem color="civic" title="Uso civile" value="31%" amount="0,38 Mm³" /><AllocationItem color="ecosystem" title="Ecosistema" value="15%" amount="0,19 Mm³" /></div></section><section className="why-card"><p className="eyebrow">IN CASO DI EMERGENZA</p><h2>Perché cambiano<br />le priorità?</h2><p>La distribuzione segue un ordine preciso: prima la sicurezza delle persone, poi la salute del fiume e infine le attività produttive.</p><div className="priority-list"><span><b>01</b><strong>Uso civile</strong><small>Acqua potabile e servizi essenziali</small></span><span><b>02</b><strong>Ecosistema</strong><small>Portata minima vitale del fiume</small></span><span><b>03</b><strong>Agricoltura</strong><small>Colture e riserve alimentari</small></span></div></section></div></div>
}

function AllocationItem({ color, title, value, amount }: { color: string; title: string; value: string; amount: string }) { return <div className="allocation-item"><span><i className={color}></i>{title}</span><strong>{value}</strong><small>{amount}</small></div> }

function DamsPage() {
  return <div className="page"><PageIntro eyebrow="CONTROLLO DELLE OPERE" title="La rete idraulica." copy="Uno schema semplificato dello stato delle dighe e dei flussi che attraversano il bacino." action={<span className="live-status"><i></i> Live · aggiornato ora</span>} /><div className="dam-status-grid"><div><span>Opere monitorate</span><strong>5 <small>/ 5</small></strong></div><div><span>Regolazione attiva</span><strong>3</strong></div><div><span>Portata in uscita</span><strong>42,6 <small>m³/s</small></strong></div><div><span>Allerta operativa</span><strong className="green-text">Nessuna</strong></div></div><section className="hydraulic-card"><div className="card-heading"><div><p className="eyebrow">SCHEMA IN TEMPO REALE</p><h2>Da monte a valle</h2></div><span className="small-label">Flusso dell'acqua →</span></div><div className="hydraulic-flow"><div className="flow-node source"><span className="node-icon">≈</span><strong>Alto Micio</strong><small>Afflusso 56,1 m³/s</small></div><div className="flow-line"><i></i><span>56,1 m³/s</span></div><DamNode name="Diga Nord" code="DN-01" state="Aperta 32%" open /><div className="flow-line"><i></i><span>42,6 m³/s</span></div><DamNode name="Diga Centrale" code="DC-02" state="Aperta 18%" open /><div className="flow-line"><i></i><span>38,9 m³/s</span></div><DamNode name="Diga Sud" code="DS-03" state="Chiusa" /><div className="flow-line muted-line"><i></i><span>Valle del Micio</span></div></div><div className="hydraulic-note"><span className="note-symbol">i</span><p><strong>Come leggere lo schema</strong><br />Le percentuali indicano l'apertura delle paratoie. Il flusso viene regolato per mantenere la portata minima vitale nel tratto a valle.</p></div></section></div>
}

function DamNode({ name, code, state, open }: { name: string; code: string; state: string; open?: boolean }) { return <div className={`dam-node ${open ? 'open' : ''}`}><div className="dam-illustration"><span></span><span></span><span></span></div><strong>{name}</strong><small>{code}</small><b>{state}</b></div> }

function ReportsPage({ noticeSent, setNoticeSent }: { noticeSent: boolean; setNoticeSent: (value: boolean) => void }) {
  return <div className="page"><PageIntro eyebrow="PARTECIPA AL MONITORAGGIO" title="Segnalazioni dal territorio." copy="Un'informazione puntuale aiuta tutti a prendersi cura del fiume. Invia una segnalazione, anche senza registrarti." /><div className="report-layout"><section className="report-form-card"><div className="card-heading"><div><p className="eyebrow">NUOVA SEGNALAZIONE</p><h2>Hai notato qualcosa?</h2></div><span className="report-number">#MC-2026</span></div>{noticeSent ? <div className="sent-state"><div className="sent-icon">✓</div><h3>Segnalazione ricevuta</h3><p>Grazie. Il team Micio verificherà l'informazione e aggiornerà la mappa se necessario.</p><button className="outline-button" onClick={() => setNoticeSent(false)}>Invia un'altra segnalazione</button></div> : <form onSubmit={(event) => { event.preventDefault(); setNoticeSent(true) }}><label>Che cosa hai osservato?<select defaultValue=""><option value="" disabled>Seleziona una categoria</option><option>Livello dell'acqua anomalo</option><option>Ostruzione o rifiuti</option><option>Danno a una sponda</option><option>Altro</option></select></label><label>Dove si trova?<input placeholder="Es. Ponte vecchio, sponda nord" /></label><label>Raccontaci di più <span>(facoltativo)</span><textarea placeholder="Aggiungi dettagli utili..."></textarea></label><div className="form-bottom"><span>Puoi restare anonimo</span><button className="primary-button" type="submit">Invia segnalazione <span>→</span></button></div></form>}</section><aside className="reports-aside"><p className="eyebrow">ULTIME SEGNALAZIONI</p><h2>La comunità osserva.</h2><div className="community-stat"><strong>27</strong><span>segnalazioni<br />ricevute quest'anno</span></div><div className="report-list"><div><span className="report-type yellow"></span><span><strong>Livello acqua</strong><small>Piana agricola · 1h fa</small></span><b>In verifica</b></div><div><span className="report-type green"></span><span><strong>Ostruzione</strong><small>Sentiero valle · ieri</small></span><b className="resolved">Risolta</b></div></div></aside></div></div>
}

export default App

createRoot(document.getElementById('root')!).render(<App />)
