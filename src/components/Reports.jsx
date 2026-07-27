import { useMemo } from 'react'
import { formatMoney, formatTime, isToday } from '../utils/format.js'

export default function Reports({ tickets, onSelectTicket }) {
  const todayTickets = useMemo(
    () =>
      [...tickets]
        .filter((t) => isToday(t.date))
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [tickets]
  )

  const totalHoy = todayTickets.reduce((s, t) => s + t.total, 0)
  const debenHoy = todayTickets.reduce((s, t) => s + (t.due || 0), 0)

  const topProduct = useMemo(() => {
    const counts = {}
    todayTickets.forEach((t) => {
      t.items.forEach((i) => {
        counts[i.name] = (counts[i.name] || 0) + i.qty
      })
    })
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return entries[0] || null
  }, [todayTickets])

  const promedio = todayTickets.length > 0 ? totalHoy / todayTickets.length : 0

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reportes</h1>
          <div className="page-sub">Resumen de hoy</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card accent-green">
          <div className="stat-label">Vendido hoy</div>
          <div className="stat-value">{formatMoney(totalHoy)}</div>
        </div>
        <div className="stat-card accent">
          <div className="stat-label">Tickets cerrados</div>
          <div className="stat-value">{todayTickets.length}</div>
        </div>
        {debenHoy > 0 && (
          <div className="stat-card accent-danger">
            <div className="stat-label">Te deben hoy</div>
            <div className="stat-value">{formatMoney(debenHoy)}</div>
          </div>
        )}
        <div className="stat-card">
          <div className="stat-label">Ticket promedio</div>
          <div className="stat-value">{formatMoney(promedio)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Más vendido</div>
          <div className="stat-value" style={{ fontSize: 15 }}>
            {topProduct ? `${topProduct[0]} (${topProduct[1]})` : '—'}
          </div>
        </div>
      </div>

      <div className="section-label">Tickets de hoy</div>
      {todayTickets.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📊</div>
          <p>Todavía no cierras ninguna cuenta hoy.</p>
        </div>
      ) : (
        <div>
          {todayTickets.map((t) => (
            <button
              className="ticket-row ticket-row-clickable"
              key={t.id}
              onClick={() => onSelectTicket(t)}
            >
              <div>
                <div className="t-name">
                  {t.clientName}
                  {t.due > 0 && <span className="pill pill-danger" style={{ marginLeft: 8 }}>Debe {formatMoney(t.due)}</span>}
                </div>
                <div className="t-time">
                  {formatTime(t.date)} · {t.items.reduce((s, i) => s + i.qty, 0)} producto(s)
                </div>
              </div>
              <div className="t-total">{formatMoney(t.total)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}