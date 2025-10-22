import { CONFIG } from '../config'
import crypto from 'crypto'

const TOKEN_TTL_SECONDS = 60 * 60 * 24 // 24 hours

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

export type AdminClaims = {
  sub: string
  role: 'admin'
  exp: number
}

export function authenticate(email: string, password: string) {
  const valid = email === CONFIG.ADMIN_EMAIL && password === CONFIG.ADMIN_PASSWORD
  if (!valid) throw new Error('Invalid credentials')
}

export function issueToken(email: string) {
  const claims: AdminClaims = {
    sub: email,
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  }
  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = base64url(JSON.stringify(header))
  const encodedPayload = base64url(JSON.stringify(claims))
  const data = `${encodedHeader}.${encodedPayload}`
  const signature = crypto.createHmac('sha256', CONFIG.AUTH_JWT_SECRET).update(data).digest('base64url')
  return `${data}.${signature}`
}

export function verifyToken(token: string): AdminClaims {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid token format')
  const [h, p, s] = parts
  const data = `${h}.${p}`
  const expected = crypto.createHmac('sha256', CONFIG.AUTH_JWT_SECRET).update(data).digest('base64url')
  if (!crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected))) throw new Error('Invalid token signature')
  const claims = JSON.parse(Buffer.from(p, 'base64').toString('utf8')) as AdminClaims
  if (typeof claims.exp !== 'number' || Date.now() / 1000 > claims.exp) throw new Error('Token expired')
  if (claims.role !== 'admin') throw new Error('Invalid role')
  return claims
}