import { useState } from 'react'

export default function ProductTable({ products, loading, error, onEdit, onDelete }) {
  const [openRow, setOpenRow] = useState(null)

  function toggleRow(id) {
    setOpenRow(prev => (prev === id ? null : id))
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-500 dark:text-gray-400">
        <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-600 border-t-violet-500 rounded-full animate-spin" aria-label="Loading" />
        <p className="text-sm">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div role="alert" className="flex items-center justify-center py-12 border border-red-200 dark:border-red-800 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
        Could not load products: {error}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 border border-dashed border-gray-300 dark:border-gray-600 rounded-2xl text-gray-400 dark:text-gray-500 text-sm">
        No products yet. Add one above to get started.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-purple-800/40 bg-gradient-to-br from-purple-950 via-gray-900 to-gray-800 shadow-[6px_6px_0px_0px_rgba(109,40,217,0.4)] hover:shadow-[8px_8px_0px_0px_rgba(109,40,217,0.5)] transition-shadow duration-200">
      <table className="w-full text-sm text-left" aria-label="Products">
        <thead className="bg-purple-950/60 text-xs uppercase tracking-wider text-purple-300 border-b border-purple-800/40">
          <tr>
            <th scope="col" className="px-5 py-3 font-semibold">Name</th>
            <th scope="col" className="px-5 py-3 font-semibold">Price</th>
            <th scope="col" className="px-5 py-3 font-semibold w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-800/30">
          {products.map((p) => (
            <>
              {/* Main row */}
              <tr
                key={p.product_id}
                className="hover:bg-purple-900/30 transition"
              >
                <td className="px-5 py-4 text-gray-100 font-medium">
                  <span className="inline-block transition-all duration-300 ease-out hover:text-[20px] cursor-default">
                    {p.product_name}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-300">
                  ${Number(p.price).toFixed(2)}
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => toggleRow(p.product_id)}
                    aria-label={`Toggle details for ${p.product_name}`}
                    aria-expanded={openRow === p.product_id}
                    className="flex flex-col gap-1 p-1.5 rounded-md hover:bg-purple-800/40 transition"
                  >
                    <span className="block w-4 h-0.5 bg-gray-300 rounded" />
                    <span className="block w-4 h-0.5 bg-gray-300 rounded" />
                    <span className="block w-4 h-0.5 bg-gray-300 rounded" />
                  </button>
                </td>
              </tr>

              {/* Expanded row */}
              {openRow === p.product_id && (
                <tr className="bg-purple-900/20">
                  <td colSpan={3} className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <span className="text-xs uppercase tracking-wide text-purple-300 font-semibold">Quantity</span>
                        <p className="text-gray-200 font-medium mt-0.5">{p.quantity}</p>
                      </div>
                      <div className="flex gap-2 ml-auto">
                        <button
                          onClick={() => onEdit(p)}
                          aria-label={`Edit ${p.product_name}`}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-600 bg-gray-700/60 text-gray-200 hover:bg-gray-600/60 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(p.product_id)}
                          aria-label={`Delete ${p.product_name}`}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-800/50 bg-red-950/40 text-red-400 hover:bg-red-900/40 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}
