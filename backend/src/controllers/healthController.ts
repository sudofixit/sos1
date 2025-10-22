import type { Context } from 'hono'

export function healthHandler(c: Context) {
  return c.json({ ok: true, service: 'sos-connection-backend' })
}