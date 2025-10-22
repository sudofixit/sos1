import type { Context } from 'hono'
import { createCheckoutSession, capturePayment, cancelPayment, getCheckoutSession } from '../services/paymentService'
import type { CreateCheckoutInput, CaptureInput, CancelInput } from '../schemas/payment'

export async function createCheckoutSessionHandler(c: Context) {
  try {
    const payload = await c.req.json<CreateCheckoutInput>()
    const session = await createCheckoutSession(payload)
    return c.json({ id: session.id, url: session.url })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to create checkout session' }, 500)
  }
}

export async function captureHandler(c: Context) {
  try {
    const payload = await c.req.json<CaptureInput>()
    const paymentIntentId: string = payload.payment_intent_id

    const amountToCapture: number | undefined = payload.amount_to_capture
    const intent = await capturePayment(paymentIntentId, amountToCapture)
    return c.json({ status: intent.status })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to capture payment' }, 500)
  }
}

export async function cancelHandler(c: Context) {
  try {
    const payload = await c.req.json<CancelInput>()
    const paymentIntentId: string = payload.payment_intent_id

    const intent = await cancelPayment(paymentIntentId)
    return c.json({ status: intent.status })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to cancel payment' }, 500)
  }
}

export async function getCheckoutSessionHandler(c: Context) {
  try {
    const sessionId = c.req.param('id')
    if (!sessionId) return c.json({ error: 'session id is required' }, 400)
    const { session, sos } = await getCheckoutSession(sessionId)
    return c.json({ session, sos })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to get checkout session' }, 500)
  }
}
