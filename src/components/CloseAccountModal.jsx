import { useState } from 'react'
import { formatMoney } from '../utils/format.js'

export default function CloseAccountModal({ total, onConfirm, onCancel }) {
  const [tenderedInput, setTenderedInput] = useState(String(total))

  const tendered = parseFloat(tenderedInput)
  const valid = !isNaN(tendered) && tendered >= 0
  const change = valid ? Math.max(tendered - total, 0) : 0
  const due = valid ? Math.max(total - tendered, 0) : 0
  const isExact = valid && change === 0 && due === 0

  function submit(e) {
    e.preventDefault()
    if (!valid) return
    onConfirm(tendered)
  }

  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Cobrar cuenta</h2>
          <button className="close-btn" onClick={onCancel}>
            ✕
          </button>
        </div>

        <div className="order-total-bar">
          <div>
            <div className="label">Total a cobrar</div>
          </div>
          <div className="amount">{formatMoney(total)}</div>
        </div>

        <form onSubmit={submit}>
          <div className="field">
            <label>¿Con cuánto pagó?</label>
            <input
              autoFocus
              type="number"
              min="0"
              step="0.5"
              inputMode="decimal"
              placeholder="Ej. 500"
              value={tenderedInput}
              onChange={(e) => setTenderedInput(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>

          {valid && (
            <div
              className={`change-banner ${
                change > 0 ? 'change-positive' : due > 0 ? 'change-negative' : 'change-exact'
              }`}
            >
              {change > 0 && (
                <>
                  <span className="change-label">Cambio a dar</span>
                  <span className="change-amount">{formatMoney(change)}</span>
                </>
              )}
              {due > 0 && (
                <>
                  <span className="change-label">Le queda debiendo</span>
                  <span className="change-amount">{formatMoney(due)}</span>
                </>
              )}
              {isExact && (
                <>
                  <span className="change-label">Pago exacto</span>
                  <span className="change-amount">✓</span>
                </>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button type="button" className="btn btn-block btn-lg" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-success btn-block btn-lg" disabled={!valid}>
              Listo, dar ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}