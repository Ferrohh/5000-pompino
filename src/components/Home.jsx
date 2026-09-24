export default function Home({ setActiveTab }) {
  return (
    <section>
      <header className="page-header">
        <p className="eyebrow">Provincia di Mantova</p>
        <h1>Mincio Trasparente</h1>
        <p>Monitoraggio idrico, dati aperti e consapevolezza del territorio.</p>
      </header>

      <div className="alert">
        <span>
          ⚠️ Avviso: Livello del fiume Mincio sotto la media stagionale.
          Applicazione regole di priorità per l&apos;erogazione idrica.
        </span>
        <button onClick={() => setActiveTab("balance")}>Dettagli</button>
      </div>

      <div className="home-grid">
        <button className="shortcut-card" onClick={() => setActiveTab("map")}>
          <span className="shortcut-icon">🗺️</span>
          <h2>Mappa Interattiva</h2>
          <p>Consulta sensori, livelli e portate in tempo reale.</p>
        </button>

        <button className="shortcut-card" onClick={() => setActiveTab("schema")}>
          <span className="shortcut-icon">🔗</span>
          <h2>Schema Idraulico</h2>
          <p>Visualizza il percorso dell&apos;acqua nel bacino del Mincio.</p>
        </button>
      </div>
    </section>
  );
}