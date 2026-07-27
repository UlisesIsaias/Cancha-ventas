import { useRef, useState } from 'react'
import { formatMoney, formatDateLong, formatTime } from '../utils/format.js'

// Gesto oculto para borrar un ticket: 4 toques seguidos, pausa de ~2s,
// y 2 toques más para confirmar. Así no hace falta un botón de "borrar" visible.
const TAP_GAP = 700 // ms máximo entre toques dentro de una misma racha
const PAUSE_MS = 2000 // ms de pausa obligatoria después del 4to toque
const READY_WINDOW = 4000 // ms disponibles para dar los 2 toques finales

function useDeleteGesture(onConfirm) {
  const state = useRef({ phase: 1, count: 0, lastTap: 0 })
  const timer = useRef(null)
  const [hint, setHint] = useState('')

  function reset() {
    state.current = { phase: 1, count: 0, lastTap: 0 }
    setHint('')
    if (timer.current) clearTimeout(timer.current)
  }

  function tap() {
    const now = Date.now()
    const s = state.current
    if (timer.current) clearTimeout(timer.current)

    if (s.phase === 1) {
      if (s.count > 0 && now - s.lastTap > TAP_GAP) s.count = 0
      s.count += 1
      s.lastTap = now
      if (s.count < 4) {
        setHint('·'.repeat(s.count))
        timer.current = setTimeout(reset, TAP_GAP)
      } else {
        s.phase = 'waiting'
        setHint('')
        timer.current = setTimeout(() => {
          s.phase = 2
          s.count = 0
          setHint('◦◦')
          timer.current = setTimeout(reset, READY_WINDOW)
        }, PAUSE_MS)
      }
    } else if (s.phase === 'waiting') {
      // tocó antes de tiempo durante la pausa obligatoria: se cancela todo
      reset()
    } else if (s.phase === 2) {
      if (s.count > 0 && now - s.lastTap > TAP_GAP) {
        reset()
        return
      }
      s.count += 1
      s.lastTap = now
      if (s.count >= 2) {
        reset()
        onConfirm()
      } else {
        setHint('●◦')
        timer.current = setTimeout(reset, TAP_GAP)
      }
    }
  }

  return { tap, hint }
}

export default function TicketModal({ ticket, onClose, onDelete }) {
  const { tap, hint } = useDeleteGesture(() => {
    onDelete(ticket.id)
    onClose()
  })

  if (!ticket) return null

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Ticket</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div id="printable-ticket" className="ticket-paper" onClick={tap}>
          <div className="t-brand">CANCHA · VENTAS</div>
          <div className="t-sub">
            {formatDateLong(ticket.date)} · {formatTime(ticket.date)}
          </div>
          <hr className="ticket-divider" />
          <div style={{ fontWeight: 700, marginBottom: 10 }}>{ticket.clientName}</div>

          {ticket.items.map((item) => (
            <div className="ticket-item-row" key={item.productId}>
              <span>
                <span className="qty">{item.qty}×</span>
                {item.name}
              </span>
              <span>{formatMoney(item.qty * item.price)}</span>
            </div>
          ))}

          <hr className="ticket-divider" />
          <div className="ticket-total-row">
            <span>TOTAL</span>
            <span>{formatMoney(ticket.total)}</span>
          </div>

          {ticket.due > 0 && (
            <>
              <div className="ticket-item-row" style={{ marginTop: 10 }}>
                <span>Pagó</span>
                <span>{formatMoney(ticket.paid)}</span>
              </div>
              <div className="ticket-item-row" style={{ color: 'var(--danger)', fontWeight: 700 }}>
                <span>Debe</span>
                <span>{formatMoney(ticket.due)}</span>
              </div>
            </>
          )}

          {hint && (
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: 'var(--text-faint)' }}>
              {hint}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button className="btn btn-block btn-lg" onClick={onClose}>
            Cerrar
          </button>
          <button className="btn btn-primary btn-block btn-lg" onClick={() => window.print()}>
            🖨️ Imprimir
          </button>
        </div>
      </div>
    </div>
  )
}