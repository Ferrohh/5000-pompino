import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import MapPage, { LeafletMantovaMap } from './MapPage'
import type { PointIconType, PointShape } from './icons'
import 'leaflet/dist/leaflet.css'
import './styles.css'
import './hero-contrast.css'
import './map-screen.css'
import './history.css'
import './history-overrides.css'

type Page = 'home' | 'mappa' | 'bilancio' | 'dighe' | 'perche' | 'segnalazioni' | 'storico'
type IconName = 'home' | 'map' | 'water' | 'dam' | 'why' | 'alert'

export type MantovaPoint = {
  id: string
  name: string
  icon: PointIconType
  forma?: PointShape
  shape?: PointShape
  colore?: string
  color?: string
  dati?: string
  description: string
  lat: number
  lng: number
}

const mantovaPoints: MantovaPoint[] = [
  {
    id: '01',
    name: 'Peschiera del Garda',
    icon: 'dam',
    forma: 'quadrato',
    colore: '#2563eb',
    dati: 'Livello idrometrico: 0.65 m',
    description: 'Punto di ingresso del Mincio dal Lago di Garda.',
    lat: 45.440277,
    lng: 10.698333,
  },
  {
    id: '02',
    name: 'Salionze Mandracchio Virgilio',
    icon: 'text-search',
    forma: 'cerchio',
    colore: '#7a7a7a',
    dati: 'Livello idrometrico: 0.65 m',
    description: 'Nodo di regolazione tra il corso principale e il canale Virgilio.',
    lat: 45.393888,
    lng: 10.709444,
  },
  {
    id: '03',
    name: 'Salionze canale Seriola',
    icon: 'text-search',
    forma: 'cerchio',
    colore: '#7a7a7a',
    dati: 'Livello idrometrico: 0.84 m',
    description: 'Derivazione laterale collegata alla rete della Seriola.',
    lat: 45.392777,
    lng: 10.710833,
  },
  {
    id: '04',
    name: 'Casale di Goito',
    icon: 'text-search',
    forma: 'cerchio',
    colore: '#7a7a7a',
    dati: 'Idrometro a valle: 20.36 m',
    description: 'Punto di monitoraggio a valle della derivazione di Casale di Goito.',
    lat: 45.223888,
    lng: 10.677500,
  },
  {
    id: '05',
    name: 'Pozzolo',
    icon: 'text-search',
    forma: 'cerchio',
    colore: '#7a7a7a',
    dati: 'Idrometro a valle: 43.07 m',
    description: 'Punto di monitoraggio vicino alla derivazione di Pozzolo.',
    lat: 45.301666,
    lng: 10.713333,
  },
  {
    id: '06',
    name: 'Peschiera del Garda Porto',
    icon: 'boat',
    forma: 'cerchio',
    colore: '#0284c7',
    dati: 'Ormeggio natanti consentito',
    description: 'Punto di ingresso del Mincio dal Lago di Garda.',
    lat: 45.481277,
    lng: 10.695533,
  },
  {
    id: '07',
    name: 'Riserva Naturale Grazie',
    icon: 'foglia',
    forma: 'quadrato',
    colore: '#018e20',
    dati: 'Risorse idriche necessarie per il mantenimento: 0,69 m³/s',
    description: 'Area protetta con risorse idriche significative.',
    lat: 45.1637584,
    lng: 10.7074766,
  },
  {
    id: '08',
    name: 'Campo Volta Mantovana',
    icon: 'grano',
    forma: 'quadrato',
    colore: '#dfd92c',
    dati: 'Risorse idriche necessarie per il mantenimento: 0,30 m³/s',
    description: 'Area agricola con coltivazioni di grano e mais.',
    lat: 45.3369897,
    lng: 10.6903311,
  },
  {
    id: '09',
    name: 'Campo Nogarole Rocca',
    icon: 'grano',
    forma: 'quadrato',
    colore: '#dfd92c',
    dati: 'Risorse idriche necessarie per il mantenimento: 0,15 m³/s',
    description: 'Area agricola con coltivazioni di grano e mais.',
    lat: 45.3038827,
    lng: 10.8603721,
  },
  {
    id: '10',
    name: 'Marenghello',
    icon: 'goccia',
    forma: 'cerchio',
    colore: '#6cceff',
    dati: 'Idrometro a monte: 44.33 m',
    description: 'Deflusso minimo vitale Mareghello.',
    lat: 45.258611,
    lng: 10.731666,
  },
  {
    id: '11',
    name: 'Lago di mantova',
    icon: 'text-search',
    forma: 'cerchio',
    colore: '#7a7a7a',
    dati: 'Livello idrometrico: 0.05 m',
    description: 'Punto di monitoraggio del livello del lago di Mantova.',
    lat: 45.1666088,
    lng: 10.7933861,
  },
  {
    id: '12',
    name: 'Centrale idroelettrica medio mantovano',
    icon: 'dam',
    forma: 'quadrato',
    colore: '#2563eb',
    dati: 'Produzione idroelettrica attiva',
    description: 'Centrale idroelettrica del medio Mincio.',
    lat: 45.3932382,
    lng: 10.70587,
  },
]

export { mantovaPoints }

// Direzioni supportate: 'nord' | 'nord-est' | 'est' | 'sud-est' | 'sud' | 'sud-ovest' | 'ovest' | 'nord-ovest'
// oppure un angolo numerico in gradi (0 = nord, 90 = est, ecc.)
export type FrecciaDirezione =
  | 'nord' | 'nord-est' | 'est' | 'sud-est'
  | 'sud' | 'sud-ovest' | 'ovest' | 'nord-ovest'
  | number

export type MantovaArrow = {
  id: string
  lat: number
  lng: number
  direzione: FrecciaDirezione
  colore?: string
  color?: string
  size?: number
}

const mantovaArrows: MantovaArrow[] = [
  
]

export { mantovaArrows }


const navItems: { id: Page; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Panoramica', icon: 'home' },
  { id: 'mappa', label: 'Mappa del fiume', icon: 'map' },
  { id: 'bilancio', label: 'Bilancio idrico', icon: 'water' },
  { id: 'dighe', label: 'Schema idraulico', icon: 'dam' },
  { id: 'perche', label: 'Perché', icon: 'why' },
  { id: 'segnalazioni', label: 'Segnalazioni', icon: 'alert' },
]

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" /><path d="M8 21h8" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" /><path d="M9 3v15M15 6v15" /></>,
    water: <><path d="M12 3.5S6 10 6 14.2a6 6 0 0 0 12 0C18 10 12 3.5 12 3.5Z" /><path d="M9 15.5c.6 1 1.5 1.5 3 1.5" /></>,
    dam: <><path d="M4 20h16M6 20V8h12v12M4 8h16M8 12h8M8 16h8" /></>,
    why: <><circle cx="12" cy="12" r="9" /><path d="M9.7 9a2.5 2.5 0 1 1 4.2 1.8c-1.1.8-1.9 1.3-1.9 2.7M12 17h.01" /></>,
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
        <nav>
          <p className="nav-label">ESPLORA</p>
          {navItems.map((item) => <button className={`nav-item ${page === item.id ? 'active' : ''}`} key={item.id} onClick={() => navigate(item.id)}><Icon name={item.icon} /><span>{item.label}</span></button>)}
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumb"><span>Territorio</span><b>/</b>{page === 'storico' ? <><span>Mappa del fiume</span><b>/</b><strong>Storico punto</strong></> : <strong>{navItems.find((item) => item.id === page)?.label}</strong>}</div></header>
        {page === 'home' && <Home navigate={navigate} />}
        {page === 'mappa' && <MapPage initialPoint={mapFocusPoint} onOpenHistory={(point) => { setHistoryPoint(point); setMapFocusPoint(null); navigate('storico') }} />}
        {page === 'bilancio' && <BalancePage />}
        {page === 'dighe' && <DamsPage />}
        {page === 'perche' && <WhyPage navigate={navigate} />}
        {page === 'segnalazioni' && <ReportsPage noticeSent={noticeSent} setNoticeSent={setNoticeSent} />}
        {page === 'storico' && historyPoint && <HistoryPage point={historyPoint} onBack={() => { setMapFocusPoint(historyPoint); setHistoryPoint(null); navigate('mappa') }} />}
      </main>
    </div>
  )
}

function PageIntro({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: ReactNode }) {
  return <div className="page-intro"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="intro-copy">{copy}</p></div>{action}</div>
}

type HistoryYear = '2026' | '2025' | '2024'

const historyYears: HistoryYear[] = ['2026', '2025', '2024']

const historySeries: Record<HistoryYear, {
  precip: { value: string; values: string; labels: string[]; color: string; fill: string }
  flow: { value: string; values: string; labels: string[]; color: string; fill: string }
}> = {
  '2026': {
    precip: {
      value: '738 mm',
      values: '18,58 72,72 126,42 180,81 234,47 288,88 342,43 396,74 450,41 504,82 558,36 610,51',
      labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
      color: '#4c9a79',
      fill: '#cfe7d5',
    },
    flow: {
      value: '42,6 m³/s',
      values: '18,63 72,56 126,79 180,38 234,66 288,29 342,77 396,42 450,71 504,33 558,61 610,52',
      labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
      color: '#d2954c',
      fill: '#f3dfbd',
    },
  },
  '2025': {
    precip: {
      value: '692 mm',
      values: '18,49 72,66 126,38 180,71 234,42 288,79 342,36 396,68 450,34 504,77 558,31 610,58',
      labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
      color: '#4c9a79',
      fill: '#cfe7d5',
    },
    flow: {
      value: '39,8 m³/s',
      values: '18,54 72,48 126,72 180,34 234,58 288,25 342,69 396,36 450,64 504,29 558,55 610,47',
      labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
      color: '#d2954c',
      fill: '#f3dfbd',
    },
  },
  '2024': {
    precip: {
      value: '645 mm',
      values: '18,44 72,59 126,33 180,69 234,38 288,76 342,31 396,64 450,30 504,72 558,27 610,55',
      labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
      color: '#4c9a79',
      fill: '#cfe7d5',
    },
    flow: {
      value: '36,4 m³/s',
      values: '18,47 72,42 126,63 180,28 234,51 288,19 342,60 396,26 450,57 504,23 558,49 610,41',
      labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
      color: '#d2954c',
      fill: '#f3dfbd',
    },
  },
}

function HistoryPage({ point, onBack }: { point: MantovaPoint; onBack: () => void }) {
  const [selectedYear, setSelectedYear] = useState<HistoryYear>('2026')
  const activeSeries = historySeries[selectedYear]

  return <div className="page history-page"><div className="history-heading"><div><p className="eyebrow">ARCHIVIO DEL MONITORAGGIO</p><h1>Storico del punto</h1></div></div><section className="history-overview"><div className="history-map-card" role="button" tabIndex={0} aria-label="Torna alla mappa del fiume" onClick={onBack} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onBack() }}><LeafletMantovaMap points={[point]} selectedPoint={point} onSelect={() => undefined} compact /></div><div className="history-point-info"><p className="eyebrow">PUNTO {point.id}</p><h2>{point.name}</h2><p className="history-description">{point.description}</p><div className="history-data">{point.dati && <div><span>Dati</span><strong>{point.dati}</strong></div>}<div><span>Coordinate</span><strong>{point.lat.toFixed(4)}, {point.lng.toFixed(4)}</strong></div><div><span>Ultima lettura</span><strong>24 settembre · 14:32</strong></div><div><span>Serie disponibile</span><strong>{selectedYear}</strong></div></div></div></section><section className="history-charts"><div className="history-chart-card"><div className="chart-header"><h2>Precipitazioni annuali</h2><div className="chart-header-controls"><div className="history-year-switch" aria-label="Selezione anno dei dati">{historyYears.map((year) => <button key={year} type="button" className={`history-year-button ${selectedYear === year ? 'active' : ''}`} onClick={() => setSelectedYear(year)}>{year}</button>)}</div></div></div><HistoryChart color={activeSeries.precip.color} fill={activeSeries.precip.fill} values={activeSeries.precip.values} labels={activeSeries.precip.labels} /></div><div className="history-chart-card"><div className="chart-header"><h2>Portata misurata</h2><div className="chart-header-controls"><div className="history-year-switch" aria-label="Selezione anno dei dati">{historyYears.map((year) => <button key={year} type="button" className={`history-year-button ${selectedYear === year ? 'active' : ''}`} onClick={() => setSelectedYear(year)}>{year}</button>)}</div></div></div><HistoryChart color={activeSeries.flow.color} fill={activeSeries.flow.fill} values={activeSeries.flow.values} labels={activeSeries.flow.labels} threshold={20} thresholdLabel="Soglia minima" /></div></section></div>
}

function HistoryChart({ color, fill, values, labels, threshold, thresholdLabel }: { color: string; fill: string; values: string; labels: string[]; threshold?: number; thresholdLabel?: string }) {
  const points = values.split(' ').map((point) => point.split(',').map(Number))
  const area = `${points[0][0]},116 ${values} ${points[points.length - 1][0]},116`
  const guideValues = [10, 20, 30, 40, 50]
  const yForGuide = (value: number) => 116 - ((value / 50) * 90)
  const thresholdY = threshold !== undefined ? yForGuide(threshold) : null

  return <div className="history-chart"><svg viewBox="0 0 628 145" role="img" aria-label="Grafico storico demo"><path d="M18 25H610 M18 70H610 M18 116H610" stroke="#e3ebe3" strokeWidth="1" />{guideValues.map((value) => <g key={value}><line x1="18" x2="610" y1={yForGuide(value)} y2={yForGuide(value)} stroke="#e7eee8" strokeDasharray="4 6" strokeWidth="1" /><text x="4" y={yForGuide(value) + 4} fill="#97a69d" fontSize="8" fontFamily="DM Mono, monospace">{value}</text></g>)}{thresholdY !== null && <g><line x1="18" x2="610" y1={thresholdY} y2={thresholdY} stroke="#be4f3f" strokeWidth="2.4" /><text x="610" y={thresholdY - 6} textAnchor="end" fill="#be4f3f" fontSize="8.5" fontWeight="700" fontFamily="DM Mono, monospace">{thresholdLabel ?? `Soglia ${threshold}`}</text></g>}<polygon points={area} fill={fill} opacity=".72" /><polyline points={values} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg><div className="chart-labels">{labels.map((label) => <span key={label}>{label}</span>)}</div></div>
}

function Home({ navigate }: { navigate: (page: Page) => void }) {
  return <div className="page home-page"><section className="hero"><div className="hero-copy"><p className="eyebrow light">MONITORAGGIO DEL BACINO</p><h1>Ogni goccia<br /><em>racconta</em> il fiume.</h1><p>Una lettura condivisa e trasparente dello stato del fiume Micio, per capire oggi le risorse di domani.</p><button className="primary-button" onClick={() => navigate('mappa')}>Esplora il fiume <span>→</span></button></div><div className="hero-graphic"><div className="sun"></div><div className="mountain m1"></div><div className="mountain m2"></div><div className="hero-river"></div><div className="hero-stats"><span>PORTATA ATTUALE</span><strong>42,6 <small>m³/s</small></strong><b><i></i> +4,2% nell'ultima ora</b></div></div></section><section className="section-block"><div className="section-heading"><div><p className="eyebrow">SITUAZIONE ATTUALE</p><h2>Il fiume, in un colpo d'occhio</h2></div><button className="text-button" onClick={() => navigate('bilancio')}>Vedi bilancio completo <span>↗</span></button></div><div className="metric-grid"><MetricCard label="Livello medio" value="1,79" unit="m" trend="+0,08 m" positive /><MetricCard label="Disponibilità idrica" value="68" unit="%" trend="nella norma" positive /><MetricCard label="Dighe aperte" value="3" unit="/ 5" trend="monitorate" /><MetricCard label="Segnalazioni attive" value="2" unit="" trend="da verificare" warning /></div></section><section className="split-preview"><div className="preview-note"><p className="eyebrow">UNA RETE CONDIVISA</p><h2>La trasparenza<br />parte dai dati.</h2><p>Scopri come i livelli rilevati guidano le decisioni sulla distribuzione dell'acqua durante le emergenze.</p><button className="text-button" onClick={() => navigate('mappa')}>Apri la mappa <span>→</span></button></div><div className="mini-map-real"><LeafletMantovaMap points={mantovaPoints} selectedPoint={null} onSelect={() => undefined} compact /></div></section></div>
}

function MetricCard({ label, value, unit, trend, positive, warning }: { label: string; value: string; unit: string; trend: string; positive?: boolean; warning?: boolean }) {
  return <div className="metric-card"><p>{label}</p><div className="metric-value">{value}<small>{unit}</small></div><span className={`metric-trend ${positive ? 'positive' : ''} ${warning ? 'warning' : ''}`}>{positive && '↗ '}{trend}</span></div>
}

function WhyPageLegacy({ navigate }: { navigate: (page: Page) => void }) {
  const questions = [
    ['Perché in alcune valli arriva meno acqua?', 'La portata viene distribuita lungo tutto il bacino. Nei periodi secchi una parte deve restare nel fiume per il deflusso ecologico e per garantire acqua potabile, mentre i prelievi agricoli vengono regolati in base ai livelli misurati.'],
    ['Chi decide come viene distribuita l’acqua?', 'Le decisioni si basano su portata, livelli, previsioni e fabbisogni rilevati. Il monitoraggio rende visibili questi dati e permette di distinguere una riduzione programmata da un guasto o da una criticità.'],
    ['Perché non si può aprire sempre una diga?', 'Aprire una paratoia cambia il livello a valle e può aumentare il rischio di erosione, allagamento o carenza nel tratto successivo. Ogni regolazione deve mantenere l’equilibrio dell’intero corso, non solo di una singola valle.'],
    ['Cosa significa “deflusso ecologico”?', 'È la quantità minima d’acqua che deve restare nel fiume per proteggere ecosistemi, habitat e qualità dell’acqua. Non è acqua sprecata: è una condizione necessaria per la salute del Mincio.'],
    ['Quando è utile inviare una segnalazione?', 'Invia una segnalazione quando osservi un fatto localizzato e verificabile, come una perdita, un ostacolo, acqua torbida o un livello anomalo. Per i dati generali del bacino, consulta prima Bilancio idrico e Mappa del fiume.'],
  ]

  return <div className="page why-page"><PageIntro eyebrow="INFORMAZIONI PER IL TERRITORIO" title="Perché succede?" copy="Le risposte alle domande più frequenti sulla gestione dell’acqua, spiegate con i dati del bacino e senza allarmismi." action={<span className="live-status"><i></i> Dati verificati</span>} /><section className="why-intro"><div><p className="eyebrow">PRIMA DI SEGNALARE</p><h2>Capire il fiume aiuta a proteggerlo.</h2><p>Una riduzione locale non significa necessariamente un guasto. Qui trovi il contesto per leggere i dati, capire le scelte di gestione e sapere quando serve davvero intervenire.</p></div><div className="why-fact"><strong>3</strong><span>indicatori letti insieme</span><small>portata · livelli · fabbisogno</small></div></section><section className="faq-layout"><div className="faq-list"><div className="section-heading"><div><p className="eyebrow">DOMANDE FREQUENTI</p><h2>Le risposte più cercate</h2></div></div>{questions.map(([question, answer], index) => <details className="faq-item" key={question} open={index === 0}><summary><span>{question}</span><b>+</b></summary><p>{answer}</p></details>)}</div><aside className="why-aside"><p className="eyebrow">LEGGI I DATI</p><h2>Una decisione ha sempre un contesto.</h2><p>Portata, livelli e fabbisogno vengono letti insieme. Un singolo valore non basta per descrivere lo stato del fiume.</p><button className="text-button" onClick={() => navigate('bilancio')}>Apri il bilancio idrico <span>→</span></button><div className="why-route"><span>01</span><div><strong>Osserva</strong><small>i dati del bacino</small></div><span>02</span><div><strong>Confronta</strong><small>monte, centro e valle</small></div><span>03</span><div><strong>Segnala</strong><small>solo ciò che hai verificato</small></div></div></aside></section></div>
}

function WhyPage({ navigate }: { navigate: (page: Page) => void }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('Seleziona una domanda oppure scrivila: ti risponderò usando i dati del bacino.')
  const answers: Record<string, string> = {
    acqua: 'Quando una valle riceve meno acqua, la portata viene regolata considerando tutto il corso del Mincio: livelli a monte, fabbisogni locali, deflusso ecologico e sicurezza a valle. Una riduzione locale può quindi essere una scelta temporanea di equilibrio, non necessariamente un guasto.',
    diga: 'Una diga viene regolata per mantenere il flusso entro livelli sicuri. Aprirla troppo velocemente può aumentare il rischio a valle; tenerla più chiusa può proteggere una riserva o garantire il deflusso ecologico.',
    ambiente: 'Il deflusso ecologico è la quantità minima che deve restare nel fiume per mantenere habitat, qualità dell’acqua e continuità dell’ecosistema. È un vincolo operativo, non una perdita di risorsa.',
    segnalazione: 'Una segnalazione è utile quando riguarda un fatto localizzato e verificabile: una perdita, un ostacolo, acqua torbida o un livello anomalo. Per capire il quadro generale, consulta prima Mappa del fiume e Bilancio idrico.',
  }
  const ask = (value: string) => {
    setQuestion(value)
    const normalized = value.toLowerCase()
    const key = normalized.includes('diga') ? 'diga' : normalized.includes('ambiente') || normalized.includes('fiume') ? 'ambiente' : normalized.includes('segnal') ? 'segnalazione' : 'acqua'
    setAnswer(answers[key])
  }

  return <div className="page why-page"><PageIntro eyebrow="INFORMAZIONI PER IL TERRITORIO" title="Perché succede?" copy="Un assistente per capire le scelte sul flusso dell’acqua e un registro pubblico delle motivazioni operative." action={<span className="live-status"><i></i> Dati verificati</span>} /><section className="why-tools"><div className="citizen-chat"><div className="chat-heading"><div><p className="eyebrow">ASSISTENTE DEL BACINO</p><h2>Hai una domanda sul fiume?</h2></div><span className="chat-status">online</span></div><div className="chat-answer"><span className="chat-avatar">M</span><p>{answer}</p></div><div className="chat-suggestions"><button onClick={() => ask('Perché in valle arriva meno acqua?')}>Perché arriva meno acqua?</button><button onClick={() => ask('Perché non aprite la diga?')}>Perché non aprite la diga?</button><button onClick={() => ask('Che cosa protegge l’ambiente?')}>Cosa protegge l’ambiente?</button><button onClick={() => ask('Quando invio una segnalazione?')}>Quando segnalare?</button></div><form className="chat-form" onSubmit={(event) => { event.preventDefault(); if (question.trim()) ask(question) }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Scrivi la tua domanda..." aria-label="Scrivi la tua domanda" /><button type="submit" aria-label="Invia domanda">→</button></form></div><aside className="decision-card"><p className="eyebrow">TRASPARENZA OPERATIVA</p><h2>Perché questa scelta?</h2><p>Ogni variazione del flusso viene accompagnata da una spiegazione semplice, così i dati non restano separati dalle decisioni.</p><div className="decision-item"><span>24 SET</span><div><strong>Portata ridotta verso valle</strong><p>Abbiamo mantenuto il deflusso ecologico e ridotto temporaneamente i prelievi agricoli per proteggere il livello minimo nel tratto centrale.</p></div></div><div className="decision-item"><span>22 SET</span><div><strong>Diga Centrale aperta al 18%</strong><p>La regolazione ha accompagnato l’aumento della portata senza trasferire un picco improvviso verso le valli.</p></div></div></aside></section><section className="decision-principles"><p className="eyebrow">COME LEGGERE UNA DECISIONE</p><div><span><b>01</b><strong>Dati</strong><small>livelli e portate rilevati</small></span><span><b>02</b><strong>Vincoli</strong><small>sicurezza e ambiente</small></span><span><b>03</b><strong>Scelta</strong><small>azione e area interessata</small></span><span><b>04</b><strong>Verifica</strong><small>effetto monitorato nel tempo</small></span></div></section></div>
}

function BalancePage() {
  return <div className="page balance-page"><PageIntro eyebrow="QUADRO GENERALE DEL MINCIO" title="Il bilancio del fiume." copy="Dati aggregati lungo tutto il corso del Mincio per capire quanta acqua c'è, quanta ne serve e quando la situazione richiede attenzione." action={<span className="live-status"><i></i> Dati aggiornati ora</span>} /><section className="balance-status"><div className="balance-status-copy"><p className="eyebrow">STATO DEL BACINO</p><h2>Equilibrio sotto controllo</h2><p>La disponibilità attuale copre il fabbisogno stimato del territorio. Il margine resta positivo, ma il tratto a valle è quello da osservare con più attenzione.</p><div className="balance-alert"><span>✓</span><strong>Nessuna criticità attiva</strong><small>margine operativo nella norma</small></div></div><div className="balance-gauge"><div className="balance-gauge-ring"><strong>+18<span>%</span></strong><small>sopra il fabbisogno</small></div><div className="gauge-caption"><span>Acqua disponibile</span><strong>68%</strong></div></div></section><section className="balance-kpis"><div><span>Portata media del fiume</span><strong>42,6 <small>m³/s</small></strong><b className="kpi-positive">+4,2% nell'ultima ora</b></div><div><span>Fabbisogno stimato</span><strong>36,1 <small>m³/s</small></strong><b>consumo giornaliero medio</b></div><div><span>Margine disponibile</span><strong className="green-text">+6,5 <small>m³/s</small></strong><b className="kpi-positive">18% sopra il fabbisogno</b></div><div><span>Livello medio lungo il corso</span><strong>1,79 <small>m</small></strong><b>media di 12 punti monitorati</b></div></section><section className="balance-columns"><div className="balance-card balance-distribution"><div className="card-heading"><div><p className="eyebrow">COME VIENE UTILIZZATA</p><h2>Acqua fornita al territorio</h2></div><span className="small-label">100% della portata utile</span></div><div className="supply-track"><span className="supply-used"></span><span className="supply-reserve"></span></div><div className="supply-summary"><strong>68%</strong><span>fornita ai diversi usi</span><b>32% riserva e deflusso ecologico</b></div><div className="supply-legend"><span><i className="supply-dot civic-dot"></i>Uso civile <strong>31%</strong></span><span><i className="supply-dot agri-dot"></i>Agricoltura <strong>54%</strong></span><span><i className="supply-dot eco-dot"></i>Ecosistema <strong>15%</strong></span></div></div><div className="balance-card balance-risk"><p className="eyebrow">INDICE DI ATTENZIONE</p><div className="risk-heading"><h2>Situazione nella norma</h2><span className="risk-pill">BASSO</span></div><div className="risk-meter"><span></span></div><div className="risk-scale"><span>Normale</span><span>Attenzione</span><span>Critica</span></div><p>Il margine tra acqua disponibile e fabbisogno è sufficiente. La soglia di attenzione scatta sotto i <strong>+3,0 m³/s</strong> di margine.</p><div className="risk-note"><span>i</span><span>Il dato combina portata, livelli medi e prelievi rilevati nelle ultime 24 ore.</span></div></div></section><section className="balance-reach"><div className="section-heading"><div><p className="eyebrow">LUNGO TUTTO IL CORSO</p><h2>Come cambia il fiume da monte a valle</h2></div><span className="small-label">media rilevata oggi</span></div><div className="reach-grid"><div className="reach-item"><div className="reach-top"><span>01 · MONTE</span><b className="reach-ok">Regolare</b></div><strong>2,14 <small>m</small></strong><span>Portata 56,1 m³/s</span><div className="reach-line"><i style={{ width: '82%' }}></i></div></div><div className="reach-item"><div className="reach-top"><span>02 · CENTRO</span><b className="reach-ok">Stabile</b></div><strong>1,79 <small>m</small></strong><span>Portata 42,6 m³/s</span><div className="reach-line"><i style={{ width: '64%' }}></i></div></div><div className="reach-item"><div className="reach-top"><span>03 · VALLE</span><b className="reach-watch">Da osservare</b></div><strong>1,42 <small>m</small></strong><span>Portata 38,9 m³/s</span><div className="reach-line"><i className="watch-line" style={{ width: '48%' }}></i></div></div></div></section></div>
}

function BalancePageLegacy() {
  return <div className="page"><PageIntro eyebrow="RISORSA E DISTRIBUZIONE" title="Il bilancio dell'acqua." copy="Una fotografia chiara della disponibilità idrica nel bacino del Micio e delle scelte che la proteggono." action={<span className="period-select">Oggi, 24 settembre 2026⌄</span>} /><div className="balance-top"><div className="balance-visual"><div className="balance-ring"><div><strong>68<span>%</span></strong><small>disponibilità</small></div></div><div><p className="eyebrow">ACQUA DISPONIBILE</p><h3>Una situazione stabile</h3><p className="muted-copy">La riserva attuale è sufficiente per coprire i consumi previsti dei prossimi 14 giorni.</p></div></div><div className="balance-numbers"><div><span>Riserva totale</span><strong>18,4 <small>Mm³</small></strong></div><div><span>Consumo giornaliero</span><strong>1,24 <small>Mm³</small></strong></div><div><span>Afflusso ultime 24h</span><strong className="green-text">+1,86 <small>Mm³</small></strong></div></div></div><div className="content-columns"><section className="allocation-card"><div className="card-heading"><div><p className="eyebrow">DOVE VA L'ACQUA</p><h2>Distribuzione attuale</h2></div><span className="small-label">su 1,24 Mm³</span></div><div className="allocation-bar"><span className="agri"></span><span className="civic"></span><span className="ecosystem"></span></div><div className="allocation-legend"><AllocationItem color="agri" title="Agricoltura" value="54%" amount="0,67 Mm³" /><AllocationItem color="civic" title="Uso civile" value="31%" amount="0,38 Mm³" /><AllocationItem color="ecosystem" title="Ecosistema" value="15%" amount="0,19 Mm³" /></div></section><section className="why-card"><p className="eyebrow">IN CASO DI EMERGENZA</p><h2>Perché cambiano<br />le priorità?</h2><p>La distribuzione segue un ordine preciso: prima la sicurezza delle persone, poi la salute del fiume e infine le attività produttive.</p><div className="priority-list"><span><b>01</b><strong>Uso civile</strong><small>Acqua potabile e servizi essenziali</small></span><span><b>02</b><strong>Ecosistema</strong><small>Portata minima vitale del fiume</small></span><span><b>03</b><strong>Agricoltura</strong><small>Colture e riserve alimentari</small></span></div></section></div></div>
}

function AllocationItem({ color, title, value, amount }: { color: string; title: string; value: string; amount: string }) { return <div className="allocation-item"><span><i className={color}></i>{title}</span><strong>{value}</strong><small>{amount}</small></div> }

function DamsPage() {
  return <div className="page"><PageIntro eyebrow="CONTROLLO DELLE OPERE" title="La rete idraulica." copy="Uno schema semplificato dello stato delle dighe e dei flussi che attraversano il bacino." action={<span className="live-status"><i></i> Live · aggiornato ora</span>} /><div className="dam-status-grid"><div><span>Opere monitorate</span><strong>5 <small>/ 5</small></strong></div><div><span>Regolazione attiva</span><strong>3</strong></div><div><span>Portata in uscita</span><strong>42,6 <small>m³/s</small></strong></div><div><span>Allerta operativa</span><strong className="green-text">Nessuna</strong></div></div><section className="hydraulic-card"><div className="card-heading"><div><p className="eyebrow">SCHEMA IN TEMPO REALE</p><h2>Da monte a valle</h2></div><span className="small-label">Flusso dell'acqua →</span></div><div className="hydraulic-flow"><div className="flow-node source"><span className="node-icon">≈</span><strong>Alto Micio</strong><small>Afflusso 56,1 m³/s</small></div><div className="flow-line"><i></i><span>56,1 m³/s</span></div><DamNode name="Diga Nord" code="DN-01" state="Aperta 32%" open /><div className="flow-line"><i></i><span>42,6 m³/s</span></div><DamNode name="Diga Centrale" code="DC-02" state="Aperta 18%" open /><div className="flow-line"><i></i><span>38,9 m³/s</span></div><DamNode name="Diga Sud" code="DS-03" state="Chiusa" /><div className="flow-line muted-line"><i></i><span>Valle del Micio</span></div></div><div className="hydraulic-note"><span className="note-symbol">i</span><p><strong>Come leggere lo schema</strong><br />Le percentuali indicano l'apertura delle paratoie. Il flusso viene regolato per mantenere la portata minima vitale nel tratto a valle.</p></div></section></div>
}

function DamNode({ name, code, state, open }: { name: string; code: string; state: string; open?: boolean }) { return <div className={`dam-node ${open ? 'open' : ''}`}><div className="dam-illustration"><span></span><span></span><span></span></div><strong>{name}</strong><small>{code}</small><b>{state}</b></div> }

function ReportsPage({ noticeSent, setNoticeSent }: { noticeSent: boolean; setNoticeSent: (value: boolean) => void }) {
  const [photoName, setPhotoName] = useState('')

  return <div className="page"><PageIntro eyebrow="PARTECIPA AL MONITORAGGIO" title="Segnalazioni dal territorio." copy="Un'informazione puntuale aiuta tutti a prendersi cura del fiume. Invia una segnalazione, anche senza registrarti." /><div className="report-layout"><section className="report-form-card"><div className="card-heading"><div><p className="eyebrow">NUOVA SEGNALAZIONE</p><h2>Hai notato qualcosa?</h2></div><span className="report-number">#MC-2026</span></div>{noticeSent ? <div className="sent-state"><div className="sent-icon">✓</div><h3>Segnalazione ricevuta</h3><p>Grazie. Il team Mincio verificherà l'informazione e aggiornerà la mappa se necessario.</p><button className="outline-button" onClick={() => setNoticeSent(false)}>Invia un'altra segnalazione</button></div> : <form onSubmit={(event) => { event.preventDefault(); setNoticeSent(true) }}><label>Tipo di segnalazione<select defaultValue="" required><option value="" disabled>Seleziona una categoria</option><option>Livello dell'acqua anomalo</option><option>Ostruzione o rifiuti</option><option>Danno a una sponda</option><option>Inquinamento</option><option>Altro</option></select></label><label>Luogo della segnalazione<input required placeholder="Es. Ponte vecchio, sponda nord" /></label><label>Foto <span>(facoltativa)</span><div className="report-photo-actions"><label className="report-photo-button">Scegli dalla galleria<input type="file" accept="image/*" onChange={(event) => setPhotoName(event.target.files?.[0]?.name || '')} /></label><label className="report-photo-button">Scatta una foto<input type="file" accept="image/*" capture="environment" onChange={(event) => setPhotoName(event.target.files?.[0]?.name || '')} /></label></div>{photoName && <small className="report-photo-name">{photoName}</small>}</label><label>Spiegazione <span>(facoltativa)</span></label><textarea placeholder="Aggiungi dettagli utili..."></textarea><label>Email <span>(facoltativa, per ricevere aggiornamenti)</span><input type="email" placeholder="nome@email.it" /></label><div className="form-bottom"><span>Puoi restare anonimo</span><button className="primary-button" type="submit">Invia segnalazione <span>→</span></button></div></form>}</section><aside className="reports-aside"><p className="eyebrow">ULTIME SEGNALAZIONI</p><h2>La comunità osserva.</h2><div className="community-stat"><strong>27</strong><span>segnalazioni<br />ricevute quest'anno</span></div><div className="report-list"><div><span className="report-type yellow"></span><span><strong>Livello acqua</strong><small>Piana agricola · 1h fa</small></span><b>In verifica</b></div><div><span className="report-type green"></span><span><strong>Ostruzione</strong><small>Sentiero valle · ieri</small></span><b className="resolved">Risolta</b></div></div></aside></div></div>
}

export default App

createRoot(document.getElementById('root')!).render(<App />)
