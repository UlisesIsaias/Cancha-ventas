import { useMemo } from 'react'
import { formatMoney, formatTime, isToday, isThisMonth, monthLabel, daysInMonth } from '../utils/format.js'
import MonthlyChart from './MonthlyChart.jsx'

export default function Reports({ tickets, onSelectTicket, tab, setTab }) {
  const todayTickets = useMemo(
    () =>
      [...tickets]
        .filter((t) => isToday(t.date))
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [tickets]
  )

  const monthTickets = useMemo(
    () => tickets.filter((t) => isThisMonth(t.date)),
    [tickets]
  )

  const totalHoy = todayTickets.reduce((s, t) => s + t.total, 0)
  const debenHoy = todayTickets.reduce((s, t) => s + (t.due || 0), 0)

  const topProductToday = useMemo(() => {
    const counts = {}
    todayTickets.forEach((t) => {
      t.items.forEach((i) => {
        counts[i.name] = (counts[i.name] || 0) + i.qty
      })
    })
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return entries[0] || null
  }, [todayTickets])

  const promedioHoy = todayTickets.length > 0 ? totalHoy / todayTickets.length : 0

  // ---------- Datos del mes ----------
  const totalMes = monthTickets.reduce((s, t) => s + t.total, 0)
  const debenMes = monthTickets.reduce((s, t) => s + (t.due || 0), 0)
  const promedioMes = monthTickets.length > 0 ? totalMes / monthTickets.length : 0

  const topProductMonth = useMemo(() => {
    const counts = {}
    monthTickets.forEach((t) => {
      t.items.forEach((i) => {
        counts[i.name] = (counts[i.name] || 0) + i.qty
      })
    })
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return entries[0] || null
  }, [monthTickets])

  const chartData = useMemo(() => {
    const total = daysInMonth(new Date())
    const perDay = Array.from({ length: total }, (_, i) => ({ day: i + 1, total: 0 }))
    monthTickets.forEach((t) => {
      const d = new Date(t.date).getDate()
      perDay[d - 1].total += t.total
    })
    return perDay
  }, [monthTickets])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reportes</h1>
          <div className="page-sub">{tab === 'mes' ? monthLabel() : 'Resumen de hoy'}</div>
        </div>
      </div>

      <div className="tab-switch">
        <button className={tab === 'hoy' ? 'active' : ''} onClick={() => setTab('hoy')}>
          Hoy
        </button>
        <button className={tab === 'mes' ? 'active' : ''} onClick={() => setTab('mes')}>
          Mes
        </button>
      </div>

      {tab === 'hoy' ? (
        <>
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
              <div className="stat-value">{formatMoney(promedioHoy)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Más vendido</div>
              <div className="stat-value" style={{ fontSize: 15 }}>
                {topProductToday ? `${topProductToday[0]} (${topProductToday[1]})` : '—'}
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
                      {t.due > 0 && (
                        <span className="pill pill-danger" style={{ marginLeft: 8 }}>
                          Debe {formatMoney(t.due)}
                        </span>
                      )}
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
        </>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card accent-green">
              <div className="stat-label">Vendido en el mes</div>
              <div className="stat-value">{formatMoney(totalMes)}</div>
            </div>
            <div className="stat-card accent">
              <div className="stat-label">Tickets del mes</div>
              <div className="stat-value">{monthTickets.length}</div>
            </div>
            {debenMes > 0 && (
              <div className="stat-card accent-danger">
                <div className="stat-label">Te deben en el mes</div>
                <div className="stat-value">{formatMoney(debenMes)}</div>
              </div>
            )}
            <div className="stat-card">
              <div className="stat-label">Ticket promedio</div>
              <div className="stat-value">{formatMoney(promedioMes)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Más vendido del mes</div>
              <div className="stat-value" style={{ fontSize: 15 }}>
                {topProductMonth ? `${topProductMonth[0]} (${topProductMonth[1]})` : '—'}
              </div>
            </div>
          </div>

          <div className="section-label">Ventas por día</div>
          {monthTickets.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📈</div>
              <p>Todavía no hay ventas cerradas este mes.</p>
            </div>
          ) : (
            <MonthlyChart data={chartData} />
          )}
        </>
      )}
    </div>
  )
}