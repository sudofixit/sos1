export const BASE_URL = 'http://localhost:4242'

export function buildHeaders(headers?: Record<string, string>) {
  return {
    'content-type': 'application/json',
    ...(headers || {}),
  }
}

export function getCookieHeader(headers: Headers) {
  const setCookie = headers.get('set-cookie')
  return setCookie ? setCookie.split(';')[0] : ''
}

export const env = {
  DATABASE_URL: Bun.env.DATABASE_URL ?? process.env.DATABASE_URL,
  STRIPE_SECRET_KEY: Bun.env.STRIPE_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: Bun.env.STRIPE_WEBHOOK_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET,
  ADMIN_EMAIL: Bun.env.ADMIN_EMAIL ?? process.env.ADMIN_EMAIL ?? 'admin@example.com',
  ADMIN_PASSWORD: Bun.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? 'password123',
}