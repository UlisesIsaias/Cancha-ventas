import { useState } from 'react'
import { formatMoney } from '../utils/format.js'

export default function ProductManager({ products, onAdd, onUpdate, onDelete }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const sorted = [...products].sort((a, b) => b.sales - a.sales)

  function resetForm() {
    setName('')
    setPrice('')
    setStock('')
    setShowAdd(false)
    setEditingId(null)
  }

  function startEdit(p) {
    setEditingId(p.id)
    setName(p.name)
    setPrice(String(p.price))
    setStock(typeof p.stock === 'number' ? String(p.stock) : '')
    setShowAdd(true)
  }

  function submit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    const parsedPrice = parseFloat(price)
    if (!trimmed || isNaN(parsedPrice) || parsedPrice < 0) return

    const parsedStock = stock === '' ? 0 : parseInt(stock, 10)
    const safeStock = isNaN(parsedStock) || parsedStock < 0 ? 0 : parsedStock

    if (editingId) {
      onUpdate(editingId, { name: trimmed, price: parsedPrice, stock: safeStock })
    } else {
      onAdd({ name: trimmed, price: parsedPrice, stock: safeStock })
    }
    resetForm()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Productos</h1>
          <div className="page-sub">{products.length} en tu catálogo</div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingId(null)
            setName('')
            setPrice('')
            setStock('')
            setShowAdd(true)
          }}
        >
          + Producto
        </button>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🧃</div>
          <p>Agrega tus productos (aguas, refrescos, botanas...) para empezar a vender.</p>
        </div>
      ) : (
        <div>
          {sorted.map((p) => {
            const lowStock = typeof p.stock === 'number' && p.stock > 0 && p.stock <= 5
            const noStock = typeof p.stock === 'number' && p.stock <= 0
            return (
              <div className="product-row" key={p.id}>
                <div className="p-info">
                  <div className="name">
                    {p.name}
                    {noStock && <span className="pill pill-danger" style={{ marginLeft: 8 }}>Sin existencia</span>}
                    {lowStock && <span className="pill pill-danger" style={{ marginLeft: 8 }}>Casi se acaba</span>}
                  </div>
                  <div className="meta">
                    {formatMoney(p.price)} · Existencia: {typeof p.stock === 'number' ? p.stock : '—'} · Vendidos: {p.sales}
                  </div>
                </div>
                <button className="icon-btn" onClick={() => startEdit(p)} aria-label="Editar">
                  ✎
                </button>
                {confirmDeleteId === p.id ? (
                  <>
                    <button
                      className="icon-btn danger"
                      onClick={() => {
                        onDelete(p.id)
                        setConfirmDeleteId(null)
                      }}
                      aria-label="Confirmar"
                    >
                      ✓
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => setConfirmDeleteId(null)}
                      aria-label="Cancelar"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <button
                    className="icon-btn danger"
                    onClick={() => setConfirmDeleteId(p.id)}
                    aria-label="Eliminar"
                  >
                    🗑
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showAdd && (
        <div className="overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Editar producto' : 'Nuevo producto'}</h2>
              <button className="close-btn" onClick={resetForm}>
                ✕
              </button>
            </div>
            <form onSubmit={submit}>
              <div className="field">
                <label>Nombre</label>
                <input
                  autoFocus
                  placeholder="Ej. Agua, Refresco..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Precio (MXN)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="Ej. 15"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Existencia (cuántos tienes)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Ej. 24"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">
                {editingId ? 'Guardar cambios' : 'Agregar producto'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}