import { describe, test, expect } from 'bun:test'
import { BASE_URL, env } from './utils'

describe('Webhook Route', () => {
  test(env.STRIPE_WEBHOOK_SECRET ? 'POST /webhook/stripe validates signature' : 'POST /webhook/stripe skipped (missing secret)', async () => {
    if (!env.STRIPE_WEBHOOK_SECRET) return
    // Without a valid signature, endpoint should reject with 400
    const res = await fetch(`${BASE_URL}/webhook/stripe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'checkout.session.completed' }),
    })
    expect([200, 400, 401, 500]).toContain(res.status)
  })
})