import { formatMoney, formatDateLong, formatTime } from '../utils/format.js'

export default function TicketModal({ ticket, onClose }) {
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

        <div id="printable-ticket" className="ticket-paper">
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
