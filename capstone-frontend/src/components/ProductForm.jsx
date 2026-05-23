import { useState } from 'react'

const EMPTY = { product_id: '', product_name: '', price: '', quantity: '' }

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
          product_id: Number(form.product_id),
          product_name: form.product_name,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity, 10),
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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-5">
        Add New Product
      </h2>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="product_id" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Product ID
            </label>
            <input
              id="product_id"
              name="product_id"
              type="number"
              min="1"
              placeholder="e.g. 101"
              value={form.product_id}
              onChange={handleChange}
              required
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="product_name" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Product Name
            </label>
            <input
              id="product_name"
              name="product_name"
              type="text"
              placeholder="e.g. Widget Pro"
              value={form.product_name}
              onChange={handleChange}
              required
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="price" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Price ($)
            </label>
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
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="quantity" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              placeholder="e.g. 50"
              value={form.quantity}
              onChange={handleChange}
              required
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition placeholder-gray-400"
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
