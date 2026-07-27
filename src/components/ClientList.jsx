import { useMemo, useState } from 'react'
import { formatMoney, initials } from '../utils/format.js'

export default function ClientList({ clients, onSelectClient, onAddClient }) {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = q
      ? clients.filter((c) => c.name.toLowerCase().includes(q))
      : clients
    // clientes con cuenta activa primero
    return [...list].sort((a, b) => {
      const totalA = a.order.reduce((s, i) => s + i.qty * i.price, 0)
      const totalB = b.order.reduce((s, i) => s + i.qty * i.price, 0)
      if (totalA > 0 && totalB === 0) return -1
      if (totalB > 0 && totalA === 0) return 1
      return a.name.localeCompare(b.name)
    })
  }, [clients, search])

  function submitAdd(e) {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    onAddClient(name)
    setNewName('')
    setShowAdd(false)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <div className="page-sub">
            {clients.length} registrados · toca uno para agregar su compra
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          + Cliente
        </button>
      </div>

      {clients.length > 0 && (
        <div className="field" style={{ marginBottom: 18 }}>
          <input
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {clients.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🧾</div>
          <p>Aún no tienes clientes. Agrega el primero para empezar a llevar sus cuentas.</p>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            + Agregar cliente
          </button>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((client) => {
            const total = client.order.reduce((s, i) => s + i.qty * i.price, 0)
            const items = client.order.reduce((s, i) => s + i.qty, 0)
            return (
              <button
                key={client.id}
                className="client-card"
                onClick={() => onSelectClient(client.id)}
              >
                <div className="client-avatar">{initials(client.name)}</div>
                <div>
                  <div className="client-name">{client.name}</div>
                  <div className="client-meta">
                    {items > 0 ? `${items} producto(s)` : 'Sin cuenta abierta'}
                  </div>
                </div>
                <div className={`client-total ${total > 0 ? 'owes' : 'zero'}`}>
                  {formatMoney(total)}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {showAdd && (
        <div className="overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Nuevo cliente</h2>
              <button className="close-btn" onClick={() => setShowAdd(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={submitAdd}>
              <div className="field">
                <label>Nombre</label>
                <input
                  autoFocus
                  placeholder="Ej. Beto, Doña Mary..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">
                Agregar cliente
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
