const TABS = [
  { id: 'clientes', label: 'Clientes', icon: '👥' },
  { id: 'productos', label: 'Productos', icon: '🧃' },
  { id: 'reportes', label: 'Reportes', icon: '📊' },
]

export default function BottomNav({ view, setView }) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={view === tab.id ? 'active' : ''}
          onClick={() => setView(tab.id)}
        >
          <span className="nav-icon">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
