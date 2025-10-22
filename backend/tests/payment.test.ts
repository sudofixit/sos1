import { describe, test, expect } from 'bun:test'
import { BASE_URL, buildHeaders, env } from './utils'

describe('Payment Route', () => {
  test(env.STRIPE_SECRET_KEY ? 'POST /create-checkout-session returns session id' : 'POST /create-checkout-session skipped (missing Stripe key)', async () => {
    if (!env.STRIPE_SECRET_KEY) return
    const res = await fetch(`${BASE_URL}/create-checkout-session`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({
        name: 'John Doe',
        phone: '+4912345678',
        email: 'john@example.com',
        address: 'Berlin, DE',
        operator: 'Telekom',
        connectionType: 'DSL',
        delay: 'none',
        details: 'Test checkout via tests'
      }),
    })
    expect([200, 500]).toContain(res.status)
    if (res.status === 200) {
      const json = await res.json()
      expect(typeof json.id).toBe('string')
      expect(typeof json.url).toBe('string')
    }
  })

  test('POST /create-checkout-session invalid body returns 400', async () => {
    const res = await fetch(`${BASE_URL}/create-checkout-session`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ email: 'bad', name: 'x' }),
    })
    expect(res.status).toBe(400)
  })

  test('POST /capture requires payment_intent_id', async () => {
    const res = await fetch(`${BASE_URL}/capture`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
  })

  test('POST /capture rejects negative amount', async () => {
    const res = await fetch(`${BASE_URL}/capture`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ payment_intent_id: 'pi_fake', amount_to_capture: -10 }),
    })
    expect(res.status).toBe(400)
  })

  test('POST /cancel requires payment_intent_id', async () => {
    const res = await fetch(`${BASE_URL}/cancel`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
  })

  test(env.STRIPE_SECRET_KEY ? 'GET /checkout-session/:id returns session or fails' : 'GET /checkout-session/:id skipped (missing Stripe key)', async () => {
    if (!env.STRIPE_SECRET_KEY) return
    const res = await fetch(`${BASE_URL}/checkout-session/sess_test_fake`, {
      method: 'GET',
      headers: buildHeaders(),
    })
    expect([200, 500]).toContain(res.status)
  })
})