import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import MapPage, { LeafletMantovaMap } from './MapPage'
import 'leaflet/dist/leaflet.css'
import './styles.css'
import './hero-contrast.css'
import './map-screen.css'
import './history.css'
import './history-overrides.css'

import type { PointIconType } from './icons'

type Page = 'home' | 'mappa' | 'bilancio' | 'dighe' | 'segnalazioni' | 'storico'
type IconName = 'home' | 'map' | 'water' | 'dam' | 'alert'

export type MantovaPoint = {
  id: string
  name: string
  icon: PointIconType
  description: string
  lat: number
  lng: number
  status: 'Ottimale' | 'Attenzione'
  livelloIdrometrico: string
}

const mantovaPoints: MantovaPoint[] = [
  {
    id: '01',
    name: 'Peschiera del Garda',
    icon: 'barca',
    description: 'Punto di ingresso del Mincio dal Lago di Garda.',
    lat: 45.440277,
    lng: 10.698333,
    status: 'Ottimale',
    livelloIdrometrico: '0.64 m',
  },
  {
    id: '02',
    name: 'Salionze Mandracchio Virgilio',
    icon: 'goccia',
    description: 'Nodo di regolazione tra il corso principale e il canale Virgilio.',
    lat: 45.393888,
    lng: 10.709444,
    status: 'Attenzione',
    livelloIdrometrico: '0.64 m',
  },
  {
    id: '03',
    name: 'Salionze canale Seriola',
    icon: 'goccia',
    description: 'Derivazione laterale collegata alla rete della Seriola.',
    lat: 45.392777,
    lng: 10.710833,
    status: 'Ottimale',
    livelloIdrometrico: '0.84 m',
  },
  {
    id: '04',
    name: 'Salionze Mincio',
    icon: 'goccia',
    description: 'Rilevatore sul corso principale subito a valle di Salionze.',
    lat: 45.392777,
    lng: 10.706111,
    status: 'Ottimale',
    livelloIdrometrico: '0.36 m',
  },
  {
    id: '05',
    name: 'Casale di Goito',
    icon: 'goccia',
    description: 'Stazione di controllo del livello nella valle del Mincio.',
    lat: 45.223888,
    lng: 10.677500,
    status: 'Ottimale',
    livelloIdrometrico: '20.30 m',
  },
  {
    id: '06',
    name: 'Pozzolo',
    icon: 'goccia',
    description: 'Punto di monitoraggio vicino alla derivazione di Pozzolo.',
    lat: 45.301666,
    lng: 10.713333,
    status: 'Ottimale',
    livelloIdrometrico: '0.05 m',
  },
]

export { mantovaPoints }

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
  const [historyPoint, setHistoryPoint] = useState<MantovaPoint | null>(null)
  const [mapFocusPoint, setMapFocusPoint] = useState<MantovaPoint | null>(null)

  useEffect(() => {
    document.querySelector<HTMLInputElement>('.report-file')?.setAttribute('capture', 'environment')
  }, [page])

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
        <header className="topbar"><div className="breadcrumb"><span>Territorio</span><b>/</b>{page === 'storico' ? <><span>Mappa del fiume</span><b>/</b><strong>Storico punto</strong></> : <strong>{navItems.find((item) => item.id === page)?.label}</strong>}</div></header>
        {page === 'home' && <Home navigate={navigate} />}
        {page === 'mappa' && <MapPage initialPoint={mapFocusPoint} onOpenHistory={(point) => { setHistoryPoint(point); setMapFocusPoint(null); navigate('storico') }} />}
        {page === 'bilancio' && <BalancePage />}
        {page === 'dighe' && <DamsPage />}
        {page === 'segnalazioni' && <ReportsPage noticeSent={noticeSent} setNoticeSent={setNoticeSent} />}
        {page === 'storico' && historyPoint && <HistoryPage point={historyPoint} onBack={() => { setMapFocusPoint(historyPoint); setHistoryPoint(null); navigate('mappa') }} />}
      </main>
    </div>
  )
}

function PageIntro({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: ReactNode }) {
  return <div className="page-intro"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="intro-copy">{copy}</p></div>{action}</div>
}

function HistoryPage({ point, onBack }: { point: MantovaPoint; onBack: () => void }) {
  return <div className="page history-page"><div className="history-heading"><div><p className="eyebrow">ARCHIVIO DEL MONITORAGGIO</p><h1>Storico del punto</h1></div></div><section className="history-overview"><div className="history-map-card" role="button" tabIndex={0} aria-label="Torna alla mappa del fiume" onClick={onBack} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onBack() }}><LeafletMantovaMap points={[point]} selectedPoint={point} onSelect={() => undefined} compact /></div><div className="history-point-info"><p className="eyebrow">PUNTO {point.id}</p><h2>{point.name}</h2><span className={`history-status ${point.status === 'Attenzione' ? 'warning' : ''}`}>{point.status}</span><p className="history-description">{point.description}</p><div className="history-data"><div><span>Livello attuale</span><strong>{point.livelloIdrometrico}</strong></div><div><span>Coordinate</span><strong>{point.lat.toFixed(4)}, {point.lng.toFixed(4)}</strong></div><div><span>Ultima lettura</span><strong>24 settembre · 14:32</strong></div><div><span>Serie disponibile</span><strong>Ultimi 30 giorni</strong></div></div></div></section><section className="history-charts"><div className="history-chart-card"><div className="chart-header"><div><p className="eyebrow">LIVELLO IDROMETRICO</p><h2>Andamento del livello</h2></div><strong>0,64 m</strong></div><HistoryChart color="#4c9a79" fill="#cfe7d5" values="18,42 92,36 166,51 240,45 314,59 388,42 462,48 536,31 610,38" labels={['01', '05', '10', '15', '20', '25', '30']} /></div><div className="history-chart-card"><div className="chart-header"><div><p className="eyebrow">PORTATA STIMATA</p><h2>Flusso nell’ultimo mese</h2></div><strong>42,6 m³/s</strong></div><HistoryChart color="#d2954c" fill="#f3dfbd" values="18,55 92,46 166,60 240,38 314,50 388,29 462,43 536,24 610,34" labels={['01', '05', '10', '15', '20', '25', '30']} /></div></section></div>
}

function HistoryChart({ color, fill, values, labels }: { color: string; fill: string; values: string; labels: string[] }) {
  const points = values.split(' ').map((point) => point.split(',').map(Number))
  const area = `${points[0][0]},116 ${values} ${points[points.length - 1][0]},116`
  return <div className="history-chart"><svg viewBox="0 0 628 145" role="img" aria-label="Grafico storico demo"><path d="M18 25H610 M18 70H610 M18 116H610" stroke="#e3ebe3" strokeWidth="1" /><polygon points={area} fill={fill} opacity=".72" /><polyline points={values} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{points.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#fffefa" stroke={color} strokeWidth="2" />)}</svg><div className="chart-labels">{labels.map((label) => <span key={label}>{label}</span>)}</div></div>
}

function Home({ navigate }: { navigate: (page: Page) => void }) {
  return <div className="page home-page"><section className="hero"><div className="hero-copy"><p className="eyebrow light">MONITORAGGIO DEL BACINO</p><h1>Ogni goccia<br /><em>racconta</em> il fiume.</h1><p>Una lettura condivisa e trasparente dello stato del fiume Micio, per capire oggi le risorse di domani.</p><button className="primary-button" onClick={() => navigate('mappa')}>Esplora il fiume <span>→</span></button></div><div className="hero-graphic"><div className="sun"></div><div className="mountain m1"></div><div className="mountain m2"></div><div className="hero-river"></div><div className="hero-stats"><span>PORTATA ATTUALE</span><strong>42,6 <small>m³/s</small></strong><b><i></i> +4,2% nell'ultima ora</b></div></div></section><section className="section-block"><div className="section-heading"><div><p className="eyebrow">SITUAZIONE ATTUALE</p><h2>Il fiume, in un colpo d'occhio</h2></div><button className="text-button" onClick={() => navigate('bilancio')}>Vedi bilancio completo <span>↗</span></button></div><div className="metric-grid"><MetricCard label="Livello medio" value="1,79" unit="m" trend="+0,08 m" positive /><MetricCard label="Disponibilità idrica" value="68" unit="%" trend="nella norma" positive /><MetricCard label="Dighe aperte" value="3" unit="/ 5" trend="monitorate" /><MetricCard label="Segnalazioni attive" value="2" unit="" trend="da verificare" warning /></div></section><section className="split-preview"><div className="preview-note"><p className="eyebrow">UNA RETE CONDIVISA</p><h2>La trasparenza<br />parte dai dati.</h2><p>Scopri come i livelli rilevati guidano le decisioni sulla distribuzione dell'acqua durante le emergenze.</p><button className="text-button" onClick={() => navigate('mappa')}>Apri la mappa <span>→</span></button></div><div className="mini-map-real"><LeafletMantovaMap points={mantovaPoints} selectedPoint={null} onSelect={() => undefined} compact /></div></section></div>
}

function MetricCard({ label, value, unit, trend, positive, warning }: { label: string; value: string; unit: string; trend: string; positive?: boolean; warning?: boolean }) {
  return <div className="metric-card"><p>{label}</p><div className="metric-value">{value}<small>{unit}</small></div><span className={`metric-trend ${positive ? 'positive' : ''} ${warning ? 'warning' : ''}`}>{positive && '↗ '}{trend}</span></div>
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
  return <div className="page"><PageIntro eyebrow="PARTECIPA AL MONITORAGGIO" title="Segnalazioni dal territorio." copy="Un'informazione puntuale aiuta tutti a prendersi cura del fiume. Invia una segnalazione, anche senza registrarti." /><div className="report-layout"><section className="report-form-card"><div className="card-heading"><div><p className="eyebrow">NUOVA SEGNALAZIONE</p><h2>Hai notato qualcosa?</h2></div><span className="report-number">#MC-2026</span></div>{noticeSent ? <div className="sent-state"><div className="sent-icon">✓</div><h3>Segnalazione ricevuta</h3><p>Grazie. Il team Mincio verificherà l'informazione e aggiornerà la mappa se necessario.</p><button className="outline-button" onClick={() => setNoticeSent(false)}>Invia un'altra segnalazione</button></div> : <form onSubmit={(event) => { event.preventDefault(); setNoticeSent(true) }}><label>Tipo di segnalazione<select defaultValue="" required><option value="" disabled>Seleziona una categoria</option><option>Livello dell'acqua anomalo</option><option>Ostruzione o rifiuti</option><option>Danno a una sponda</option><option>Inquinamento</option><option>Altro</option></select></label><label>Luogo della segnalazione<input required placeholder="Es. Ponte vecchio, sponda nord" /></label><label>Foto <span>(facoltativa)</span><input className="report-file" type="file" accept="image/*" /></label><label>Spiegazione <span>(facoltativa)</span><textarea placeholder="Aggiungi dettagli utili..."></textarea></label><label>Email <span>(facoltativa, per ricevere aggiornamenti)</span><input type="email" placeholder="nome@email.it" /></label><div className="form-bottom"><span>Puoi restare anonimo</span><button className="primary-button" type="submit">Invia segnalazione <span>→</span></button></div></form>}</section><aside className="reports-aside"><p className="eyebrow">ULTIME SEGNALAZIONI</p><h2>La comunità osserva.</h2><div className="community-stat"><strong>27</strong><span>segnalazioni<br />ricevute quest'anno</span></div><div className="report-list"><div><span className="report-type yellow"></span><span><strong>Livello acqua</strong><small>Piana agricola · 1h fa</small></span><b>In verifica</b></div><div><span className="report-type green"></span><span><strong>Ostruzione</strong><small>Sentiero valle · ieri</small></span><b className="resolved">Risolta</b></div></div></aside></div></div>
}

export default App

createRoot(document.getElementById('root')!).render(<App />)
