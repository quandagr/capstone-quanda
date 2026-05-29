import { useState, useRef, useEffect } from 'react'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hey! I'm Grant's assistant. Ask me about products, prices, or inventory." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  async function handleSend(e) {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setLoading(true)

    try {
      // Simple logic: query products and respond
      const res = await fetch('/products/')
      const products = await res.json()

      let reply = ''
      const lower = userMsg.toLowerCase()

      if (lower.includes('how many') || lower.includes('count')) {
        reply = `We currently have ${products.length} product(s) in the store.`
      } else if (lower.includes('list') || lower.includes('all') || lower.includes('show')) {
        if (products.length === 0) {
          reply = 'No products in the store yet.'
        } else {
          reply = products.map(p => `• ${p.product_name} — $${Number(p.price).toFixed(2)} (qty: ${p.quantity}${p.color ? ', ' + p.color : ''}${p.size ? ', size ' + p.size : ''})`).join('\n')
        }
      } else if (lower.includes('cheapest') || lower.includes('lowest')) {
        const cheapest = products.reduce((a, b) => a.price < b.price ? a : b, products[0])
        reply = cheapest ? `The cheapest item is "${cheapest.product_name}" at $${Number(cheapest.price).toFixed(2)}.` : 'No products found.'
      } else if (lower.includes('expensive') || lower.includes('highest')) {
        const expensive = products.reduce((a, b) => a.price > b.price ? a : b, products[0])
        reply = expensive ? `The most expensive item is "${expensive.product_name}" at $${Number(expensive.price).toFixed(2)}.` : 'No products found.'
      } else {
        // Search by name
        const match = products.find(p => p.product_name.toLowerCase().includes(lower))
        if (match) {
          reply = `Found "${match.product_name}" — $${Number(match.price).toFixed(2)}, qty: ${match.quantity}${match.color ? ', color: ' + match.color : ''}${match.size ? ', size: ' + match.size : ''}`
        } else {
          reply = `I can help with:\n• "show all products"\n• "how many products"\n• "cheapest product"\n• "most expensive"\n• Or type a product name to search.`
        }
      }

      setMessages(prev => [...prev, { role: 'bot', text: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I couldn\'t reach the server. Make sure Flask is running.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-2xl shadow-lg flex items-center justify-center transition"
        aria-label="Toggle chatbot"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96 flex flex-col rounded-2xl border border-purple-800/40 bg-gradient-to-br from-purple-950 via-gray-900 to-gray-800 shadow-[6px_6px_0px_0px_rgba(109,40,217,0.4)] overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-purple-950/60 border-b border-purple-800/40">
            <h3 className="text-sm font-semibold text-purple-200">Grant's Assistant</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-xs whitespace-pre-wrap max-w-[85%] px-3 py-2 rounded-xl ${
                  msg.role === 'user'
                    ? 'ml-auto bg-violet-600 text-white rounded-br-none'
                    : 'mr-auto bg-gray-700/60 text-gray-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="mr-auto bg-gray-700/60 text-gray-400 text-xs px-3 py-2 rounded-xl rounded-bl-none">
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex border-t border-purple-800/40 bg-gray-900/60">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products..."
              className="flex-1 px-4 py-3 bg-transparent text-gray-100 text-xs placeholder-gray-500 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 text-violet-400 hover:text-violet-300 disabled:opacity-50 transition text-sm font-bold"
            >
              ↑
            </button>
          </form>
        </div>
      )}
    </>
  )
}
