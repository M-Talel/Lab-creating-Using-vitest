import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

// These tests drive the banking app implementation.
// Start simple: transactions list loads on startup.

describe('Banking - display transactions', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows transactions on startup', async () => {
    const transactions = [
      { id: 't1', description: 'Coffee', amount: 4.5, createdAt: '2024-01-01T00:00:00.000Z' },
      { id: 't2', description: 'Book', amount: 12, createdAt: '2024-01-02T00:00:00.000Z' },
    ]

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      async json() {
        return transactions
      },
    })

    render(<App />)

    // Wait for the first transaction to appear.
    expect(await screen.findByText('Coffee')).toBeInTheDocument()
    expect(screen.getByText('Book')).toBeInTheDocument()
  })

  it('adds a transaction via form and calls POST', async () => {
    // Initial list fetch
    const transactions = []

    const created = {
      id: 't3',
      description: 'Sandwich',
      amount: 6.25,
      createdAt: '2024-01-03T00:00:00.000Z',
    }

    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        async json() {
          return transactions
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        async json() {
          return created
        },
      })

    render(<App />)

    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/description/i), 'Sandwich')
    await user.type(screen.getByLabelText(/amount/i), '6.25')
    await user.click(screen.getByRole('button', { name: /add transaction/i }))

    // New transaction should appear
    expect(await screen.findByText('Sandwich')).toBeInTheDocument()

    // POST should be called
    expect(globalThis.fetch).toHaveBeenCalledTimes(2)
    const postCall = globalThis.fetch.mock.calls[1]
    expect(postCall[0]).toMatch(/transactions/i)
    expect(postCall[1]?.method).toBe('POST')
  })

  it('filters transactions via search input and sorts by newest', async () => {
    const transactions = [
      { id: 't1', description: 'Coffee', amount: 4.5, createdAt: '2024-01-01T00:00:00.000Z' },
      { id: 't2', description: 'Book', amount: 12, createdAt: '2024-01-02T00:00:00.000Z' },
      { id: 't3', description: 'Tea', amount: 3, createdAt: '2024-01-03T00:00:00.000Z' },
    ]

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      async json() {
        return transactions
      },
    })

    render(<App />)

    const user = userEvent.setup()

    // Wait initial load
    expect(await screen.findByText('Coffee')).toBeInTheDocument()

    // Search
    // There are multiple elements in the UI whose accessible name matches /search/.
    // Use the input's current aria-label to disambiguate.
    await user.type(screen.getByLabelText(/^search$/i), 'tea')

    expect(screen.getByText('Tea')).toBeInTheDocument()
    expect(screen.queryByText('Coffee')).not.toBeInTheDocument()


    // Sort newest
    // Default should be newest first; verify first row contains Tea.
    const rows = screen.getAllByTestId('transaction-row')
    expect(rows[0]).toHaveTextContent('Tea')
  })
})

