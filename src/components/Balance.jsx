const sectors = [
  ["Idropotabile", 100, "success"],
  ["Deflusso Minimo Vitale", 100, "success"],
  ["Agricoltura", 65, "warning"],
  ["Industria", 40, "danger"],
];

export default function Balance() {
  return (
    <section>
      <header className="page-header">
        <p className="eyebrow">Distribuzione della risorsa</p>
        <h1>Panoramica e Bilancio Idrico</h1>
        <p>Distribuzione attuale e regole di priorità in caso di scarsità.</p>
      </header>

      <div className="balance-grid">
        <div className="panel">
          <h2>Erogazione attuale vs fabbisogno</h2>

          {sectors.map(([name, value, color]) => (
            <div className="bar-row" key={name}>
              <div className="bar-label">
                <span>{name}</span>
                <strong>{value}%</strong>
              </div>
              <div className="bar-track">
                <span
                  className={`bar-fill ${color}`}
                  style={{ width: `${value}%` }}
                >
                  {value}% erogato
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="panel priority-panel">
          <h2>Perché alcune zone ricevono meno acqua?</h2>
          <p>
            In caso di scarsità, la legge stabilisce un ordine rigoroso:
          </p>

          <ol>
            <li>
              <strong>Consumo umano</strong>
              <span>Acquedotti e uso idropotabile.</span>
            </li>
            <li>
              <strong>Tutela ambientale</strong>
              <span>Deflusso minimo vitale per il fiume.</span>
            </li>
            <li>
              <strong>Agricoltura</strong>
              <span>Irrigazione dei campi.</span>
            </li>
            <li>
              <strong>Industria</strong>
              <span>Usi produttivi.</span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}