import { useState, useEffect, useCallback } from 'react'
import ProductForm from './components/ProductForm'
import ProductTable from './components/ProductTable'
import EditModal from './components/EditModal'

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <header className="text-center">
          <h1
            className="font-bold tracking-tight"
            style={{
              fontSize: '30px',
              color: '#f8fafc',
              WebkitTextStroke: '1px #4b5563',
              textShadow: `
                1px 1px 0px #374151,
                2px 2px 0px #374151,
                3px 3px 0px #111827,
                4px 4px 0px #111827,
                5px 5px 0px #030712,
                6px 6px 8px rgba(0,0,0,0.4)
              `,
              transform: 'perspective(300px) rotateX(8deg)',
              display: 'inline-block',
            }}
          >
            Product Dashboard
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
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
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
    </div>
  )
}
