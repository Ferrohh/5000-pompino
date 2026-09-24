import { useState } from "react";

const stations = [
  {
    id: "monzambano",
    name: "Stazione Monzambano",
    color: "green",
    level: "1.2 m",
    flow: "15 m³/s",
    position: { top: "27%", left: "22%" },
  },
  {
    id: "goito",
    name: "Stazione Goito",
    color: "yellow",
    level: "0.8 m",
    flow: "8 m³/s",
    position: { top: "47%", left: "52%" },
  },
  {
    id: "mantova",
    name: "Laghi di Mantova",
    color: "red",
    level: "13.5 m s.l.m.",
    flow: "Bassa",
    position: { top: "69%", left: "78%" },
  },
];

export default function Map() {
  const [activePopup, setActivePopup] = useState(null);

  return (
    <section>
      <header className="page-header">
        <p className="eyebrow">Monitoraggio in tempo reale</p>
        <h1>Mappa Sensori in Tempo Reale</h1>
        <p>Seleziona un sensore per visualizzare i dati idrometrici.</p>
      </header>

      <div className="map-container" onClick={() => setActivePopup(null)}>
        <div className="river-line" />

        {stations.map((station) => (
          <div key={station.id}>
            <button
              className={`map-pin ${station.color}`}
              style={station.position}
              aria-label={station.name}
              onClick={(event) => {
                event.stopPropagation();
                setActivePopup(
                  activePopup === station.id ? null : station.id,
                );
              }}
            />

            {activePopup === station.id && (
              <div
                className="sensor-popup"
                style={{
                  top: `calc(${station.position.top} - 8%)`,
                  left: `calc(${station.position.left} + 3%)`,
                }}
              >
                <strong>{station.name}</strong>
                <span>Altezza: {station.level}</span>
                <span>Portata: {station.flow}</span>
                <span>Aggiornamento: oggi, 10:45</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}