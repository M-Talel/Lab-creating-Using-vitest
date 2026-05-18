import { useEffect, useMemo, useState } from 'react'
import './App.css'

/**
 * Simple banking transactions UI.
 *
 * Test-driven implementation:
 * - Loads transactions on startup via GET /api/transactions
 * - Allows adding a transaction via POST /api/transactions
 * - Provides search filtering and a default newest-first sort
 */
function App() {
  const [transactions, setTransactions] = useState([])

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')

  const [search, setSearch] = useState('')

  const [sortDirection, setSortDirection] = useState('newest')

  async function loadTransactions() {
    const res = await fetch('/api/transactions')
    if (!res.ok) throw new Error('Failed to load transactions')
    const data = await res.json()
    setTransactions(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    loadTransactions().catch(() => {
      // Keep UI stable for demo/tests; real apps should show an error.
      setTransactions([])
    })
  }, [])

  async function addTransaction(e) {
    e.preventDefault()

    const payload = {
      description,
      amount: Number(amount),
    }

    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) return
    const created = await res.json()

    setTransactions((prev) => [created, ...prev])
    setDescription('')
    setAmount('')
  }

  const visibleTransactions = useMemo(() => {
    const query = search.trim().toLowerCase()
    let list = transactions

    if (query) {
      list = list.filter((t) =>
        String(t.description ?? '')
          .toLowerCase()
          .includes(query),
      )
    }

    list = [...list].sort((a, b) => {
      const at = new Date(a.createdAt ?? 0).getTime()
      const bt = new Date(b.createdAt ?? 0).getTime()

      if (sortDirection === 'newest') return bt - at
      return at - bt
    })

    return list
  }, [transactions, search, sortDirection])

  return (
    <div className="app">
      <h1>Transactions</h1>

      <section aria-label="add transaction">
        <form onSubmit={addTransaction}>
          <div>
            <label>
              Description
              <input
                aria-label="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label>
              Amount
              <input
                aria-label="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
          </div>


          <button type="submit">Add Transaction</button>
        </form>
      </section>

      <section aria-label="search and sort">
        <label>
          Search
          <input
            aria-label="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <button
          type="button"
          onClick={() => setSortDirection('newest')}
          aria-label="sort newest"
        >
          Newest
        </button>
        <button
          type="button"
          onClick={() => setSortDirection('oldest')}
          aria-label="sort oldest"
        >
          Oldest
        </button>
      </section>

      <section aria-label="transaction list">
        <div>
          {visibleTransactions.map((t) => (
            <div key={t.id} data-testid="transaction-row">
              <span>{t.description}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App

