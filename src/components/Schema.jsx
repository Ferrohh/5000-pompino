const nodes = [
  ["Lago di Garda", "lake"],
  ["Diga di Salionze (1)", "dam"],
  ["Canale Virgilio", "derivation"],
  ["Fiume Mincio", "lake"],
  ["Derivazione Fossa di Pozzolo", "derivation"],
  ["Laghi di Mantova", "lake"],
  ["Conca di Governolo (12)", "dam"],
  ["Fiume Po", "lake"],
];

export default function Schema() {
  return (
    <section>
      <header className="page-header">
        <p className="eyebrow">Rete idrografica</p>
        <h1>Schema Idraulico del Bacino</h1>
        <p>Dal Lago di Garda al Fiume Po.</p>
      </header>

      <div className="schema-panel">
        <div className="flow-node lake">Lago di Garda</div>
        <div className="flow-arrow">↓</div>

        <div className="flow-node dam">Diga di Salionze (1)</div>
        <div className="flow-arrow">↓</div>

        <div className="branch">
          <div className="flow-node derivation">Canale Virgilio</div>
          <div className="flow-node lake">Fiume Mincio</div>
        </div>

        <div className="flow-arrow">↓</div>

        {nodes.slice(4).map(([label, type], index) => (
          <div key={label}>
            <div className={`flow-node ${type}`}>{label}</div>
            {index < nodes.slice(4).length - 1 && (
              <div className="flow-arrow">↓</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}