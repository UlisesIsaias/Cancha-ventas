import { useMemo } from 'react'
import { formatMoney, formatTime, isToday } from '../utils/format.js'

export default function Reports({ tickets }) {
  const todayTickets = useMemo(
    () =>
      [...tickets]
        .filter((t) => isToday(t.date))
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [tickets]
  )

  const totalHoy = todayTickets.reduce((s, t) => s + t.total, 0)

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
            <div className="ticket-row" key={t.id}>
              <div>
                <div className="t-name">{t.clientName}</div>
                <div className="t-time">
                  {formatTime(t.date)} · {t.items.reduce((s, i) => s + i.qty, 0)} producto(s)
                </div>
              </div>
              <div className="t-total">{formatMoney(t.total)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
