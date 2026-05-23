import { useState, useEffect, useRef } from 'react'

export default function EditModal({ product, onClose, onUpdated }) {
  const [form, setForm] = useState({ ...product })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (dialogRef.current) dialogRef.current.focus()
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`/products/${product.product_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: Number(form.product_id),
          product_name: form.product_name,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity, 10),
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to update product')
      }
      onUpdated()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition placeholder-gray-400'

  const labelClass =
    'text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Edit Product
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-1.5 transition"
          >
            ✕
          </button>
        </div>

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <label htmlFor="edit_product_id" className={labelClass}>Product ID</label>
              <input
                id="edit_product_id"
                name="product_id"
                type="number"
                min="1"
                value={form.product_id}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="edit_product_name" className={labelClass}>Product Name</label>
              <input
                id="edit_product_name"
                name="product_name"
                type="text"
                value={form.product_name}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="edit_price" className={labelClass}>Price ($)</label>
              <input
                id="edit_price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="edit_quantity" className={labelClass}>Quantity</label>
              <input
                id="edit_quantity"
                name="quantity"
                type="number"
                min="0"
                value={form.quantity}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
