export default function ProductTable({ products, loading, error, onEdit, onDelete }) {
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
    <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="w-full text-sm text-left" aria-label="Products">
        <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-5 py-3 font-semibold">ID</th>
            <th scope="col" className="px-5 py-3 font-semibold">Name</th>
            <th scope="col" className="px-5 py-3 font-semibold">Price</th>
            <th scope="col" className="px-5 py-3 font-semibold">Quantity</th>
            <th scope="col" className="px-5 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
          {products.map((p) => (
            <tr
              key={p.product_id}
              className="hover:bg-violet-50 dark:hover:bg-violet-900/10 transition"
            >
              <td className="px-5 py-4 text-gray-700 dark:text-gray-300 font-mono">
                {p.product_id}
              </td>
              <td className="px-5 py-4 text-gray-900 dark:text-gray-100 font-medium">
                {p.product_name}
              </td>
              <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                ${Number(p.price).toFixed(2)}
              </td>
              <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                {p.quantity}
              </td>
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    aria-label={`Edit ${p.product_name}`}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(p.product_id)}
                    aria-label={`Delete ${p.product_name}`}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
