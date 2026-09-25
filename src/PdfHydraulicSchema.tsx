import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { HydraulicAsset } from './main'

type Props = {
  assets: HydraulicAsset[]
  selectedAsset: HydraulicAsset
  onSelect: (asset: HydraulicAsset) => void
}

const schemaPositions: Record<number, { x: number; y: number; labelX?: number; labelY?: number }> = {
  1: { x: 190, y: 142 },
  2: { x: 125, y: 275 },
  3: { x: 170, y: 345 },
  4: { x: 175, y: 415 },
  5: { x: 485, y: 525 },
  6: { x: 565, y: 525 },
  7: { x: 635, y: 530 },
  8: { x: 700, y: 530 },
  9: { x: 765, y: 535 },
  10: { x: 830, y: 545 },
  11: { x: 930, y: 550 },
  12: { x: 990, y: 550 },
  13: { x: 1070, y: 550 },
  14: { x: 755, y: 360 },
  15: { x: 850, y: 335 },
}

export default function PdfHydraulicSchema({ assets, selectedAsset, onSelect }: Props) {
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragStart = useRef<{ x: number; y: number } | null>(null)

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStart.current = { x: event.clientX - offset.x, y: event.clientY - offset.y }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return
    setOffset({ x: event.clientX - dragStart.current.x, y: event.clientY - dragStart.current.y })
  }

  const stopDrag = () => {
    dragStart.current = null
  }

  return <div className="pdf-schema-wrap">
    <div className="pdf-schema-toolbar"><span><b>SCHEMA DEL SISTEMA MINCIO</b> · da monte a valle</span><div><button onClick={() => setZoom((value) => Math.min(value + .15, 1.8))} aria-label="Ingrandisci schema">+</button><span>{Math.round(zoom * 100)}%</span><button onClick={() => setZoom((value) => Math.max(value - .15, .7))} aria-label="Riduci schema">−</button><button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }) }} aria-label="Reimposta schema">↺</button></div></div>
    <div className="pdf-schema-viewport" onPointerDown={startDrag} onPointerMove={move} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
      <svg className="pdf-schema-svg" viewBox="0 0 1200 690" role="img" aria-label="Schema interattivo del sistema idraulico del Mincio" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}>
        <rect width="1200" height="690" fill="#fff" />
        <path className="pdf-water" d="M104 120 C138 143 145 178 178 203 L178 395 C240 405 270 450 308 485 L570 485 C625 485 665 500 730 508 L1014 508 C1055 508 1088 486 1110 451 L1110 140" />
        <path className="pdf-water-thin" d="M202 207 L202 410 L440 410 L493 448 L738 448 L802 422 L1014 365" />
        <path className="pdf-water-thin" d="M275 263 L430 263 L430 360 L575 360 L640 420" />
        <path className="pdf-water-thin" d="M708 508 L708 585 L846 585 L900 520" />
        <path className="pdf-water-thin" d="M918 508 L918 580 L1014 580 L1050 515" />
        <path className="pdf-water-thin" d="M1110 250 L1160 250 L1160 610" />
        <path className="pdf-canal" d="M330 485 L330 560 L600 560 L700 508" />
        <path className="pdf-canal" d="M178 225 L85 225" />
        <path className="pdf-canal" d="M1110 350 L1160 350" />
        <path className="pdf-basin" d="M322 492 h210 v92 h-210 z" />
        <path className="pdf-basin-inner" d="M350 505 h63 v27 h-63 z M428 505 h72 v27 h-72 z M350 548 h150" />
        <text x="76" y="92" className="pdf-place">LAGO DI</text><text x="76" y="110" className="pdf-place">GARDA</text>
        <text x="92" y="216" className="pdf-label-vertical">CANALE VIRGILIO</text><text x="1118" y="126" className="pdf-label-vertical">FIUME PO</text>
        <text x="372" y="480" className="pdf-label">CORRENTINO</text><text x="575" y="470" className="pdf-label">VALLAZZA</text><text x="914" y="482" className="pdf-label">MINCIO</text>
        <text x="775" y="414" className="pdf-label">CANALE NAVIGABILE MANTOVA-VENEZIA</text>
        <text x="350" y="615" className="pdf-label">PAIOLO BASSO</text><text x="350" y="634" className="pdf-label">PAIOLO ALTO</text>
        {assets.map((asset) => { const position = schemaPositions[asset.id]; const labelX = position.labelX || position.x + 24; const labelY = position.labelY || position.y + 4; return <g key={asset.id} className={`pdf-marker ${selectedAsset.id === asset.id ? 'selected' : ''}`} role="button" tabIndex={0} aria-label={`${asset.id}. ${asset.name}`} onClick={() => onSelect(asset)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelect(asset) }}><title>{asset.name}</title><path className="pdf-callout" d={`M${position.x} ${position.y} L${labelX} ${labelY}`} /><circle cx={position.x} cy={position.y} r="18" /><text x={position.x} y={position.y + 5} textAnchor="middle">{asset.id}</text></g> })}
      </svg>
    </div>
    <div className="pdf-schema-legend"><span><i className="legend-water-swatch" /> corso d'acqua</span><span><i className="legend-basin-swatch" /> bacini e laghi</span><span><i className="legend-marker-swatch">1</i> opera cliccabile</span><small>Trascina lo schema, usa lo zoom o seleziona un numero.</small></div>
    <div className="pdf-schema-detail"><span>{selectedAsset.id}</span><div><p className="eyebrow">{selectedAsset.type}</p><h3>{selectedAsset.name}</h3><p>{selectedAsset.description}</p><strong>{selectedAsset.status}</strong></div></div>
  </div>
}
