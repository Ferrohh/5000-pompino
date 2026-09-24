const items = [
  ["home", "⌂", "Home"],
  ["map", "⌖", "Mappa Sensori"],
  ["balance", "▥", "Bilancio Idrico"],
  ["schema", "⌘", "Schema Idraulico"],
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <strong>ACQUAM</strong>
        <span>Provincia di Mantova</span>
      </div>

      <nav className="sidebar-nav">
        {items.map(([id, icon, label]) => (
          <button
            key={id}
            className={activeTab === id ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab(id)}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}