import { vi, beforeEach, afterEach } from 'vitest'

// Utility helpers for tests.

export function mockFetchSequence(responses) {
  const fetchMock = vi.fn()

  fetchMock.mockImplementationOnce(async (...args) => {
    const res = responses[0]
    if (!res) throw new Error('No mock response for fetch call #1')
    return res(...args)
  })

  for (let i = 1; i < responses.length; i++) {
    fetchMock.mockImplementationOnce(async (...args) => {
      const res = responses[i]
      if (!res) throw new Error(`No mock response for fetch call #${i + 1}`)
      return res(...args)
    })
  }

  globalThis.fetch = fetchMock
  return fetchMock
}

export function mockFetchJSON({ ok = true, status = 200, json } = {}) {
  return async () =>
    ({
      ok,
      status,
      async json() {
        return json
      },
    })
}

export function mockFetchCreated({ json } = {}) {
  return async () =>
    ({
      ok: true,
      status: 201,
      async json() {
        return json
      },
    })
}

export function resetFetchMock() {
  if (globalThis.fetch && 'mockClear' in globalThis.fetch) {
    globalThis.fetch.mockClear()
  }
}

export function attachFetchResetHooks() {
  beforeEach(() => {
    // no-op; keeps pattern consistent
  })
  afterEach(() => {
    resetFetchMock()
    vi.restoreAllMocks()
  })
}

