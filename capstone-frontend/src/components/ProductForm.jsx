import { useState } from 'react'

const EMPTY = { product_name: '', price: '', quantity: '', color: '', size: '' }

const inputClass =
  'px-3 py-2 rounded-lg border border-purple-800/50 bg-gray-900/60 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition placeholder-gray-600'

const labelClass =
  'text-xs font-semibold uppercase tracking-wide text-purple-300'

export default function ProductForm({ onProductAdded }) {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/products/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: form.product_name,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity, 10),
          color: form.color || null,
          size: form.size ? parseInt(form.size, 10) : null,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to create product')
      }
      setForm(EMPTY)
      onProductAdded()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-950 via-gray-900 to-gray-800 border border-purple-800/40 rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(109,40,217,0.4)] hover:shadow-[8px_8px_0px_0px_rgba(109,40,217,0.5)] transition-shadow duration-200">
      <h2 className="text-lg font-semibold italic mb-5 bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 bg-clip-text text-transparent">
        Add New Product
      </h2>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="product_name" className={labelClass}>Product Name</label>
            <input
              id="product_name"
              name="product_name"
              type="text"
              placeholder="e.g. Sneaker"
              value={form.product_name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="price" className={labelClass}>Price ($)</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 29.99"
              value={form.price}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="quantity" className={labelClass}>Quantity</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              placeholder="e.g. 50"
              value={form.quantity}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="color" className={labelClass}>Color</label>
            <input
              id="color"
              name="color"
              type="text"
              placeholder="e.g. Red"
              value={form.color}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="size" className={labelClass}>Size</label>
            <input
              id="size"
              name="size"
              type="number"
              min="0"
              placeholder="e.g. 10"
              value={form.size}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}
