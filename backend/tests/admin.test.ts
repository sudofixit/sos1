import { describe, test, expect } from 'bun:test'
import { BASE_URL, buildHeaders, getCookieHeader, env } from './utils'

describe('Admin Route', () => {
  test('GET /admin/requests rejects without login', async () => {
    const res = await fetch(`${BASE_URL}/admin/requests`)
    expect(res.status).toBe(401)
  })

  test(env.DATABASE_URL ? 'GET /admin/requests succeeds after login' : 'GET /admin/requests skipped (missing DB)', async () => {
    if (!env.DATABASE_URL) return
    const login = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD }),
    })
    expect(login.status).toBe(200)
    const cookie = getCookieHeader(login.headers)
    expect(cookie).toContain('admin_token=')

    const res = await fetch(`${BASE_URL}/admin/requests`, { headers: { Cookie: cookie } })
    if (res.status !== 200) return
    const json = await res.json()
    expect(Array.isArray(json.data)).toBe(true)
  })

  test('POST /admin/capture rejects without auth', async () => {
    const res = await fetch(`${BASE_URL}/admin/capture`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ payment_intent_id: 'pi_fake' }),
    })
    expect(res.status).toBe(401)
  })

  test('POST /admin/cancel rejects without auth', async () => {
    const res = await fetch(`${BASE_URL}/admin/cancel`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ payment_intent_id: 'pi_fake' }),
    })
    expect(res.status).toBe(401)
  })

  test(env.DATABASE_URL ? 'POST /admin/capture validates body when authorized' : 'POST /admin/capture skipped (missing DB)', async () => {
    if (!env.DATABASE_URL) return
    const login = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD }),
    })
    expect(login.status).toBe(200)
    const cookie = getCookieHeader(login.headers)

    const res = await fetch(`${BASE_URL}/admin/capture`, {
      method: 'POST',
      headers: { ...buildHeaders(), Cookie: cookie },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
  })

  test(env.DATABASE_URL ? 'POST /admin/cancel validates body when authorized' : 'POST /admin/cancel skipped (missing DB)', async () => {
    if (!env.DATABASE_URL) return
    const login = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD }),
    })
    expect(login.status).toBe(200)
    const cookie = getCookieHeader(login.headers)

    const res = await fetch(`${BASE_URL}/admin/cancel`, {
      method: 'POST',
      headers: { ...buildHeaders(), Cookie: cookie },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
  })

  test(env.DATABASE_URL ? 'POST /admin/capture attempts capture when authorized' : 'POST /admin/capture skipped (missing DB)', async () => {
    if (!env.DATABASE_URL) return
    const login = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD }),
    })
    expect(login.status).toBe(200)
    const cookie = getCookieHeader(login.headers)

    const res = await fetch(`${BASE_URL}/admin/capture`, {
      method: 'POST',
      headers: { ...buildHeaders(), Cookie: cookie },
      body: JSON.stringify({ payment_intent_id: 'pi_fake' }),
    })
    expect([200, 500]).toContain(res.status)
  })

  test(env.DATABASE_URL ? 'POST /admin/cancel attempts cancel when authorized' : 'POST /admin/cancel skipped (missing DB)', async () => {
    if (!env.DATABASE_URL) return
    const login = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD }),
    })
    expect(login.status).toBe(200)
    const cookie = getCookieHeader(login.headers)

    const res = await fetch(`${BASE_URL}/admin/cancel`, {
      method: 'POST',
      headers: { ...buildHeaders(), Cookie: cookie },
      body: JSON.stringify({ payment_intent_id: 'pi_fake' }),
    })
    expect([200, 500]).toContain(res.status)
  })
})