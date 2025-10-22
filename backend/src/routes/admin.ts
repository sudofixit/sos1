import { Hono } from 'hono'
import { capturePayment, cancelPayment } from '../services/paymentService'
import { prisma } from '../lib/prisma'
import { SOSStatus } from '@prisma/client'
import { getCookie } from 'hono/cookie'
import { verifyToken } from '../services/authService'
import { zValidator } from '@hono/zod-validator'
import { cancelSchema, captureSchema } from '../schemas/payment'

export const adminRouter = new Hono()

adminRouter.use('*', async (c, next) => {
  const bearer = c.req.header('authorization')
  const token = bearer?.startsWith('Bearer ') ? bearer.substring(7) : getCookie(c, 'admin_token')
  try {
    if (!token) throw new Error('Missing token')
    verifyToken(token)
    await next()
  } catch (e: any) {
    return c.json({ error: e.message || 'Unauthorized' }, 401)
  }
})

adminRouter.get('/requests', async (c) => {
  const statusParam = c.req.query('status')
  const validStatuses = Object.values(SOSStatus)
  const where = statusParam && validStatuses.includes(statusParam as SOSStatus) ? { status: statusParam as SOSStatus } : undefined
  const requests = await prisma.sOSRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
  return c.json({ data: requests })
})

adminRouter.post('/capture', zValidator('json', captureSchema), async (c) => {
  try {
    const body = c.req.valid('json')
    const result = await capturePayment(body.payment_intent_id)
    return c.json(result)
  } catch (e: any) {
    return c.json({ error: e.message || 'Failed to capture payment' }, 500)
  }
})

adminRouter.post('/cancel', zValidator('json', cancelSchema), async (c) => {
  try {
    const body = c.req.valid('json')
    const result = await cancelPayment(body.payment_intent_id)
    return c.json(result)
  } catch (e: any) {
    return c.json({ error: e.message || 'Failed to cancel payment' }, 500)
  }
})