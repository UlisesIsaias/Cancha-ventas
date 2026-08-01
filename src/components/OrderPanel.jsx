import { useMemo, useState } from 'react'
import { formatMoney } from '../utils/format.js'
import CloseAccountModal from './CloseAccountModal.jsx'

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
  const [showCloseModal, setShowCloseModal] = useState(false)

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => b.sales - a.sales),
    [products]
  )

  const total = client.order.reduce((s, i) => s + i.qty * i.price, 0)

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
            {sortedProducts.map((p, idx) => {
              const outOfStock = typeof p.stock === 'number' && p.stock <= 0
              return (
                <button
                  key={p.id}
                  className="product-btn"
                  onClick={() => onAddProduct(client.id, p.id)}
                >
                  {idx === 0 && p.sales > 0 && <span className="top-badge">🔥</span>}
                  <span className="p-name">{p.name}</span>
                  <span className="p-price">{formatMoney(p.price)}</span>
                  {outOfStock ? (
                    <span className="stock-tag stock-out">Sin existencia</span>
                  ) : typeof p.stock === 'number' ? (
                    <span className="stock-tag">{p.stock} disp.</span>
                  ) : null}
                </button>
              )
            })}
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

        <div style={{ marginTop: 22 }}>
          <button
            className="btn btn-success btn-block btn-lg"
            disabled={client.order.length === 0}
            onClick={() => setShowCloseModal(true)}
          >
            🧾 Cerrar cuenta
          </button>
        </div>

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

      {showCloseModal && (
        <CloseAccountModal
          total={total}
          onCancel={() => setShowCloseModal(false)}
          onConfirm={(tendered) => {
            onCloseAccount(client.id, tendered)
            setShowCloseModal(false)
          }}
        />
      )}
    </div>
  )
}