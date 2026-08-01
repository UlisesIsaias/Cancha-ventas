import { useEffect, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { defaultProducts } from './data/defaultProducts.js'
import { genId } from './utils/format.js'

import Topbar from './components/Topbar.jsx'
import BottomNav from './components/BottomNav.jsx'
import ClientList from './components/ClientList.jsx'
import OrderPanel from './components/OrderPanel.jsx'
import ProductManager from './components/ProductManager.jsx'
import Reports from './components/Reports.jsx'
import TicketModal from './components/TicketModal.jsx'

export default function App() {
  const [theme, setTheme] = useLocalStorage('cancha_theme', 'dark')
  const [view, setView] = useState('clientes')

  const [clients, setClients] = useLocalStorage('cancha_clients', [])
  const [products, setProducts] = useLocalStorage('cancha_products', defaultProducts)
  const [tickets, setTickets] = useLocalStorage('cancha_tickets', [])

  const [selectedClientId, setSelectedClientId] = useState(null)
  const [ticketToShow, setTicketToShow] = useState(null)
  const [reportsTab, setReportsTab] = useState('hoy')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  // ---------- Clientes ----------
  function addClient(name) {
    setClients((prev) => [...prev, { id: genId(), name, order: [], createdAt: new Date().toISOString() }])
  }

  function deleteClient(clientId) {
    setClients((prev) => prev.filter((c) => c.id !== clientId))
    setSelectedClientId(null)
  }

  // ---------- Pedido en curso ----------
  function addProductToOrder(clientId, productId) {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c
        const existing = c.order.find((i) => i.productId === productId)
        if (existing) {
          return {
            ...c,
            order: c.order.map((i) =>
              i.productId === productId ? { ...i, qty: i.qty + 1 } : i
            ),
          }
        }
        return {
          ...c,
          order: [
            ...c.order,
            { productId, name: product.name, price: product.price, qty: 1 },
          ],
        }
      })
    )
  }

  function changeQty(clientId, productId, delta) {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c
        const updated = c.order
          .map((i) => (i.productId === productId ? { ...i, qty: i.qty + delta } : i))
          .filter((i) => i.qty > 0)
        return { ...c, order: updated }
      })
    )
  }

  // ---------- Cerrar cuenta / ticket ----------
  function closeAccount(clientId, tenderedAmount) {
    const client = clients.find((c) => c.id === clientId)
    if (!client || client.order.length === 0) return

    const total = client.order.reduce((s, i) => s + i.qty * i.price, 0)
    const hasTendered = typeof tenderedAmount === 'number' && !isNaN(tenderedAmount)
    const tendered = hasTendered ? Math.max(tenderedAmount, 0) : total
    const paid = Math.min(tendered, total)
    const due = Math.max(total - tendered, 0)
    const change = Math.max(tendered - total, 0)

    const ticket = {
      id: genId(),
      clientId,
      clientName: client.name,
      items: client.order,
      total,
      tendered,
      paid,
      due,
      change,
      date: new Date().toISOString(),
    }

    setTickets((prev) => [ticket, ...prev])

    // Actualiza contador de ventas y descuenta existencia por producto
    setProducts((prev) =>
      prev.map((p) => {
        const sold = client.order.find((i) => i.productId === p.id)
        if (!sold) return p
        const newStock =
          typeof p.stock === 'number' ? Math.max(0, p.stock - sold.qty) : p.stock
        return { ...p, sales: p.sales + sold.qty, stock: newStock }
      })
    )

    // Reinicia la cuenta del cliente
    setClients((prev) => prev.map((c) => (c.id === clientId ? { ...c, order: [] } : c)))

    // Ya no se abre el ticket automáticamente: solo se guarda en el historial.
    // Se puede consultar después desde Reportes, tocando el nombre del cliente.
    setSelectedClientId(null)
  }

  // ---------- Productos ----------
  function addProduct({ name, price, stock }) {
    setProducts((prev) => [...prev, { id: genId(), name, price, sales: 0, stock }])
  }

  function updateProduct(id, changes) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)))
  }

  function deleteProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  function deleteTicket(ticketId) {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId))
  }

  const selectedClient = clients.find((c) => c.id === selectedClientId) || null

  return (
    <div className="app-shell">
      <Topbar
        view={view}
        setView={setView}
        theme={theme}
        onToggleTheme={toggleTheme}
        tickets={tickets}
        onOpenMonthly={() => {
          setView('reportes')
          setReportsTab('mes')
        }}
      />

      <main className="main-area">
        {view === 'clientes' && (
          <ClientList
            clients={clients}
            onSelectClient={setSelectedClientId}
            onAddClient={addClient}
          />
        )}

        {view === 'productos' && (
          <ProductManager
            products={products}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
          />
        )}

        {view === 'reportes' && (
          <Reports
            tickets={tickets}
            onSelectTicket={setTicketToShow}
            tab={reportsTab}
            setTab={setReportsTab}
          />
        )}
      </main>

      <BottomNav view={view} setView={setView} />

      {selectedClient && (
        <OrderPanel
          client={selectedClient}
          products={products}
          onAddProduct={addProductToOrder}
          onChangeQty={changeQty}
          onClose={() => setSelectedClientId(null)}
          onCloseAccount={closeAccount}
          onDeleteClient={deleteClient}
        />
      )}

      {ticketToShow && (
        <TicketModal
          ticket={ticketToShow}
          onClose={() => setTicketToShow(null)}
          onDelete={deleteTicket}
        />
      )}
    </div>
  )
}