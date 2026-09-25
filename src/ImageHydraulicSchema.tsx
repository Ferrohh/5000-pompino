import { useState } from 'react'
import type { HydraulicAsset } from './main'

type Props = {
  assets: HydraulicAsset[]
  selectedAsset: HydraulicAsset
  onSelect: (asset: HydraulicAsset) => void
}

const imagePositions: Record<number, { left: number; top: number }> = {
  1: { left: 21, top: 27 },
  2: { left: 10, top: 59 },
  3: { left: 16, top: 72 },
  4: { left: 14, top: 85 },
  5: { left: 45, top: 88 },
  6: { left: 51, top: 88 },
  7: { left: 57, top: 88 },
  8: { left: 62, top: 88 },
  9: { left: 68, top: 88 },
  10: { left: 74, top: 88 },
  11: { left: 86, top: 89 },
  12: { left: 91, top: 89 },
  13: { left: 95, top: 89 },
  14: { left: 65, top: 67 },
  15: { left: 73, top: 67 },
}

export default function ImageHydraulicSchema({ assets, selectedAsset, onSelect }: Props) {
  const [modalAsset, setModalAsset] = useState<HydraulicAsset | null>(null)

  const selectAsset = (asset: HydraulicAsset) => {
    onSelect(asset)
    setModalAsset(asset)
  }

  return <div className="image-schema-wrap">
    <div className="image-schema-toolbar"><span><b>SCHEMA DEL SISTEMA MINCIO</b> · seleziona un punto rosso</span><span>Immagine originale della tavola</span></div>
    <div className="image-schema-stage">
      <img src="/schema-micio.png" alt="Schema idraulico del Mincio" className="source-schema-image" />
      <div className="image-schema-points" aria-label="Punti interattivi dello schema">
        {assets.map((asset) => { const position = imagePositions[asset.id]; return <button key={asset.id} className={`image-schema-point ${selectedAsset.id === asset.id ? 'selected' : ''}`} style={{ left: `${position.left}%`, top: `${position.top}%` }} onClick={() => selectAsset(asset)} aria-label={`Apri informazioni su ${asset.name}`}><span>{asset.id}</span></button> })}
      </div>
    </div>
    <div className="image-schema-caption"><span><i></i> Clicca sui punti rossi per scoprire come funziona ogni opera</span><small>15 punti informativi</small></div>
    {modalAsset && <div className="schema-modal-backdrop" role="presentation" onClick={() => setModalAsset(null)}><section className="schema-modal" role="dialog" aria-modal="true" aria-labelledby="schema-modal-title" onClick={(event) => event.stopPropagation()}><button className="schema-modal-close" onClick={() => setModalAsset(null)} aria-label="Chiudi informazioni">×</button><span className="schema-modal-number">{modalAsset.id}</span><p className="eyebrow">{modalAsset.type}</p><h3 id="schema-modal-title">{modalAsset.name}</h3><p>{modalAsset.description}</p><div className="schema-modal-status"><span>Stato</span><strong>{modalAsset.status}</strong></div><p className="schema-modal-help">Questa opera fa parte del sistema che regola, distribuisce o accompagna l’acqua lungo il Mincio.</p></section></div>}
  </div>
}
