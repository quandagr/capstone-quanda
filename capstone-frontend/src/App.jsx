import { useState, useEffect, useCallback } from 'react'
import ProductForm from './components/ProductForm'
import ProductTable from './components/ProductTable'
import EditModal from './components/EditModal'
import Chatbot from './components/Chatbot'

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [toast, setToast] = useState(null)

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const res = await fetch('/products/')
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      setFetchError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    async function load() {
      if (active) await fetchProducts()
    }
    load()
    return () => { active = false }
  }, [fetchProducts])

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return
    try {
      const res = await fetch(`/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      showToast('Product deleted.')
      fetchProducts()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <header className="text-center">
          <h1
            className="font-bold tracking-tight cursor-default transition-transform duration-300 ease-out hover:scale-110 inline-block"
            style={{
              fontSize: '70px',
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa, #c4b5fd, #9ca3af, #e5e7eb, #a78bfa, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              filter: 'drop-shadow(2px 4px 6px rgba(109,40,217,0.5))',
            }}
          >
            Grant's Showroom
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Manage your product inventory
          </p>
        </header>

        {/* Add product form */}
        <ProductForm
          onProductAdded={() => {
            showToast('Product added successfully.')
            fetchProducts()
          }}
        />

        {/* Product list */}
        <section
          style={{
            background: '#6d28d9',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            padding: '24px',
            transform: 'perspective(800px) rotateX(2deg) rotateY(-1deg)',
            boxShadow: `
              0 2px 0px #f9fafb,
              0 4px 0px #f3f4f6,
              0 6px 0px #e5e7eb,
              0 8px 0px #d1d5db,
              0 10px 0px #9ca3af,
              0 12px 20px rgba(0,0,0,0.4),
              inset 0 1px 0 rgba(255,255,255,0.8)
            `,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'perspective(800px) rotateX(1deg) rotateY(0deg) translateY(-4px)'
            e.currentTarget.style.boxShadow = `
              0 2px 0px #f9fafb,
              0 4px 0px #f3f4f6,
              0 6px 0px #e5e7eb,
              0 8px 0px #d1d5db,
              0 10px 0px #9ca3af,
              0 16px 30px rgba(0,0,0,0.5),
              inset 0 1px 0 rgba(255,255,255,0.8)
            `
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'perspective(800px) rotateX(2deg) rotateY(-1deg)'
            e.currentTarget.style.boxShadow = `
              0 2px 0px #f9fafb,
              0 4px 0px #f3f4f6,
              0 6px 0px #e5e7eb,
              0 8px 0px #d1d5db,
              0 10px 0px #9ca3af,
              0 12px 20px rgba(0,0,0,0.4),
              inset 0 1px 0 rgba(255,255,255,0.8)
            `
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xl font-semibold italic"
              style={{
                background: 'linear-gradient(135deg, #f9fafb, #9ca3af, #6b7280)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              All Products
            </h2>
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="text-sm px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Refresh
            </button>
          </div>

          <ProductTable
            products={products}
            loading={loading}
            error={fetchError}
            onEdit={setEditTarget}
            onDelete={handleDelete}
          />
        </section>
      </div>

      {/* Edit modal */}
      {editTarget && (
        <EditModal
          product={editTarget}
          onClose={() => setEditTarget(null)}
          onUpdated={() => {
            showToast('Product updated successfully.')
            fetchProducts()
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-lg z-50 animate-bounce-in
            ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}
        >
          {toast.message}
        </div>
      )}

      {/* Chatbot - NOTE: This is NOT connected to n8n. It queries the Flask API directly. */}
      <Chatbot />
    </div>
  )
}
