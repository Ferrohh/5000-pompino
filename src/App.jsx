import { useState } from "react";
import "./App.css";

const pages = {
  home: "Home",
  sensors: "Mappa Sensori",
  balance: "Bilancio Idrico",
  scheme: "Schema Idraulico",
  reports: "Segnalazioni",
};

export default function App() {
  const [page, setPage] = useState("home");
  const [sent, setSent] = useState(false);

  return (
    <div className="app">
      <header>
        <strong>ACQUAM</strong>
        <nav>
          {Object.entries(pages).map(([key, label]) => (
            <button className={page === key ? "active" : ""} onClick={() => setPage(key)} key={key}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      <div className="alert">⚠️ Avviso idrico: livelli del Mincio sotto la media.</div>

      <main>
        {page === "home" && (
          <>
            <section className="hero">
              <h1>I dati dell’acqua,<br />aperti a tutti.</h1>
              <p>Consulta livelli, portate, regole di distribuzione e lo schema del bacino del Mincio.</p>
            </section>
            <div className="cards">
              {[
                ["🗺️", "Mappa Sensori", "Livelli e portate in tempo reale.", "sensors"],
                ["⚖️", "Bilancio Idrico", "Erogazione e regole di priorità.", "balance"],
                ["🔗", "Schema Idraulico", "Rete, dighe e derivazioni.", "scheme"],
                ["📷", "Segnalazioni", "Geolocalizza criticità ambientali.", "reports"],
              ].map(([icon, title, text, target]) => (
                <button className="card" onClick={() => setPage(target)} key={title}>
                  <span>{icon}</span><h2>{title}</h2><p>{text}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {page === "sensors" && <Page title="Mappa Sensori in Tempo Reale">
          <div className="sensor-layout">
            <div className="map"><i className="river" /><b className="marker green" /><b className="marker orange" /><b className="marker red" /></div>
            <div className="panel"><h2>🟠 Stazione Goito</h2><p className="warning">Stato: Livello di Attenzione</p><h3>Altezza idrometrica</h3><strong className="value">0.80 m</strong><h3>Portata stimata</h3><strong className="value">8.5 m³/s</strong></div>
          </div>
        </Page>}

        {page === "balance" && <Page title="Panoramica e Bilancio Idrico">
          <div className="panel"><h2>Erogazione attuale per settore</h2>{[["Idropotabile",100],["Ambiente",100],["Agricoltura",65],["Industria",40]].map(([name,value]) => <div className="bar-row" key={name}><b>{name}</b><div><span style={{width:`${value}%`}}>{value}% erogato</span></div></div>)}</div>
        </Page>}

        {page === "scheme" && <Page title="Schema Idraulico Semplificato">
          <div className="flow">{["Lago di Garda","Diga di Salionze","Fiume Mincio","Derivazione Fossa di Pozzolo","Laghi di Mantova","Conca di Governolo"].map(x => <div key={x}>{x}</div>)}</div>
        </Page>}

        {page === "reports" && <Page title="Invia Segnalazione">
          <div className="panel form"><label>Tipo di criticità<select><option>Seleziona una categoria...</option><option>Inquinamento</option><option>Argine danneggiato</option><option>Livello anomalo</option></select></label><label>Descrizione<textarea placeholder="Inserisci i dettagli..." /></label><button onClick={() => setSent(true)}>Invia Segnalazione</button>{sent && <p className="success">Segnalazione inviata correttamente.</p>}</div>
        </Page>}
      </main>
    </div>
  );
}

function Page({ title, children }) {
  return <><h1 className="page-title">{title}</h1>{children}</>;
}
