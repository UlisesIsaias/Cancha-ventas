import { useMemo, useState } from 'react'
import { formatMoney } from '../utils/format.js'

export default function OrderPanel({
  client,
  products,
  onAddProduct,
  onChangeQty,
  onClose,
  onCloseAccount,
  onDeleteClient,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showPartial, setShowPartial] = useState(false)
  const [paidInput, setPaidInput] = useState('')

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => b.sales - a.sales),
    [products]
  )

  const total = client.order.reduce((s, i) => s + i.qty * i.price, 0)
  const parsedPaid = parseFloat(paidInput)
  const remaining =
    !isNaN(parsedPaid) && parsedPaid > 0 ? Math.max(total - parsedPaid, 0) : null

  function confirmPartial(e) {
    e.preventDefault()
    if (isNaN(parsedPaid) || parsedPaid <= 0) return
    onCloseAccount(client.id, parsedPaid)
    setShowPartial(false)
    setPaidInput('')
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{client.name}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="order-total-bar">
          <div>
            <div className="label">Cuenta actual</div>
          </div>
          <div className="amount">{formatMoney(total)}</div>
        </div>

        <div className="section-label">Productos · más vendidos primero</div>
        {products.length === 0 ? (
          <p style={{ color: 'var(--text-faint)', fontSize: 13 }}>
            Todavía no agregas productos. Ve a la pestaña "Productos".
          </p>
        ) : (
          <div className="product-grid">
            {sortedProducts.map((p, idx) => (
              <button
                key={p.id}
                className="product-btn"
                onClick={() => onAddProduct(client.id, p.id)}
              >
                {idx === 0 && p.sales > 0 && <span className="top-badge">🔥</span>}
                <span className="p-name">{p.name}</span>
                <span className="p-price">{formatMoney(p.price)}</span>
              </button>
            ))}
          </div>
        )}

        {client.order.length > 0 && (
          <>
            <div className="section-label">Su cuenta</div>
            <div>
              {client.order.map((item) => (
                <div className="order-line" key={item.productId}>
                  <div>
                    <div className="line-name">{item.name}</div>
                    <div className="line-price">{formatMoney(item.price)} c/u</div>
                  </div>
                  <div className="qty-control">
                    <button onClick={() => onChangeQty(client.id, item.productId, -1)}>
                      −
                    </button>
                    <span className="qty-val">{item.qty}</span>
                    <button onClick={() => onChangeQty(client.id, item.productId, 1)}>
                      +
                    </button>
                  </div>
                  <div className="line-subtotal">{formatMoney(item.qty * item.price)}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {showPartial ? (
          <form onSubmit={confirmPartial} style={{ marginTop: 22 }}>
            <div className="field">
              <label>¿Cuánto te dio? (debía {formatMoney(total)})</label>
              <input
                autoFocus
                type="number"
                min="0"
                step="0.5"
                placeholder="Ej. 125"
                value={paidInput}
                onChange={(e) => setPaidInput(e.target.value)}
              />
            </div>
            {remaining !== null && (
              <p style={{ fontSize: 13, color: 'var(--danger)', margin: '0 0 14px' }}>
                {remaining > 0
                  ? `Quedaría debiendo ${formatMoney(remaining)}`
                  : 'Con eso queda pagado completo'}
              </p>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn btn-block"
                onClick={() => {
                  setShowPartial(false)
                  setPaidInput('')
                }}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-success btn-block">
                Listo, cerrar cuenta
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
            <button
              className="btn btn-success btn-block btn-lg"
              disabled={client.order.length === 0}
              onClick={() => onCloseAccount(client.id)}
            >
              🧾 Pagó todo · cerrar cuenta
            </button>
            <button
              className="btn btn-block"
              disabled={client.order.length === 0}
              onClick={() => setShowPartial(true)}
            >
              💸 Pagó solo una parte
            </button>
          </div>
        )}

        <div style={{ marginTop: 14, textAlign: 'center' }}>
          {!confirmDelete ? (
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12, color: 'var(--text-faint)' }}
              onClick={() => setConfirmDelete(true)}
            >
              Eliminar cliente
            </button>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
              ¿Seguro? Se borrará junto con su cuenta actual.{' '}
              <button
                className="btn btn-danger"
                style={{ padding: '4px 10px', fontSize: 12, marginLeft: 6 }}
                onClick={() => onDeleteClient(client.id)}
              >
                Sí, eliminar
              </button>
              <button
                className="btn btn-ghost"
                style={{ padding: '4px 10px', fontSize: 12 }}
                onClick={() => setConfirmDelete(false)}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}