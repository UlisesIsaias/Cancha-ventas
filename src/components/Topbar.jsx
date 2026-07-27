import ThemeToggle from './ThemeToggle.jsx'

const TABS = [
  { id: 'clientes', label: 'Clientes' },
  { id: 'productos', label: 'Productos' },
  { id: 'reportes', label: 'Reportes' },
]

export default function Topbar({ view, setView, theme, onToggleTheme }) {
  return (
    <header className="topbar">
      <div>
        <div className="brand">
          <span className="bracket">&lt;</span>Cancha
          <span className="bracket">/&gt;</span>
        </div>
        <div className="brand-sub">Ventas &amp; Cuentas</div>
      </div>

      <nav className="nav-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={view === tab.id ? 'active' : ''}
            onClick={() => setView(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </header>
  )
}
