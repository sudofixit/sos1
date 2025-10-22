import type { Context } from 'hono'
import { authenticate, issueToken } from '../services/authService'
import { setCookie } from 'hono/cookie'
import type { LoginInput } from '../schemas/auth'

export async function loginHandler(c: Context) {
  try {
    const body = await c.req.json<LoginInput>()

    authenticate(body.email, body.password)
    const token = issueToken(body.email)

    setCookie(c, 'admin_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      path: '/',
      maxAge: body.remember ? 60 * 60 * 24 * 7 : 60 * 60 * 24,
    })

    return c.json({ ok: true })
  } catch (error: any) {
    return c.json({ error: error.message || 'Login failed' }, 401)
  }
}