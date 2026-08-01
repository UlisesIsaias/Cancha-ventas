import { useMemo } from 'react'
import ThemeToggle from './ThemeToggle.jsx'
import { formatMoney, isThisMonth } from '../utils/format.js'

const TABS = [
  { id: 'clientes', label: 'Clientes' },
  { id: 'productos', label: 'Productos' },
  { id: 'reportes', label: 'Reportes' },
]

export default function Topbar({ view, setView, theme, onToggleTheme, tickets, onOpenMonthly }) {
  const monthSummary = useMemo(() => {
    const monthTickets = tickets.filter((t) => isThisMonth(t.date))
    const total = monthTickets.reduce((s, t) => s + t.total, 0)

    const counts = {}
    monthTickets.forEach((t) => {
      t.items.forEach((i) => {
        counts[i.name] = (counts[i.name] || 0) + i.qty
      })
    })
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]

    return { total, topName: top ? top[0] : null }
  }, [tickets])

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

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="month-pill" onClick={onOpenMonthly} title="Ver ventas del mes">
          <span className="month-pill-icon">📈</span>
          <span className="month-pill-text">
            <span className="month-pill-amount">{formatMoney(monthSummary.total)}</span>
            {monthSummary.topName && (
              <span className="month-pill-top">Top: {monthSummary.topName}</span>
            )}
          </span>
        </button>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  )
}