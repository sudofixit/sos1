import Stripe from 'stripe'
import { prisma } from '../lib/prisma'
import { CONFIG } from '../config'
import { logger } from '../lib/logger'

const stripe = CONFIG.STRIPE_SECRET_KEY ? new Stripe(CONFIG.STRIPE_SECRET_KEY) : null

export type CreateCheckoutPayload = {
  name: string
  phone: string
  email: string
  address: string
  operator: string
  connectionType?: string
  connection_type?: string
  delay: string
  details: string
}

export async function createCheckoutSession(payload: CreateCheckoutPayload) {
  if (!stripe) throw new Error('Stripe not configured')

  const sos = await prisma.sOSRequest.create({
    data: {
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      address: payload.address,
      operator: payload.operator,
      connectionType: payload.connectionType || payload.connection_type || '',
      delay: payload.delay,
      details: payload.details,
      status: 'PENDING',
    },
  })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_intent_data: {
      capture_method: 'manual',
      metadata: {
        sosRequestId: sos.id,
        name: payload.name || '',
        phone: payload.phone || '',
        email: payload.email || '',
        address: payload.address || '',
        operator: payload.operator || '',
        connection_type: payload.connectionType || payload.connection_type || '',
        delay: payload.delay || '',
        details: payload.details || '',
      },
    },
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: { name: 'SOS Connection Pre-Authorization' },
          unit_amount: Math.round(CONFIG.AUTH_AMOUNT_EUR * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${CONFIG.FRONTEND_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${CONFIG.FRONTEND_URL}/cancel.html`,
  })

  await prisma.sOSRequest.update({ where: { id: sos.id }, data: { stripeSessionId: session.id } })

  logger.info({ sosId: sos.id, sessionId: session.id }, 'Checkout session created')
  return session
}

export async function capturePayment(paymentIntentId: string, amountToCapture?: number) {
  if (!stripe) throw new Error('Stripe not configured')

  const intent = await stripe.paymentIntents.capture(
    paymentIntentId,
    amountToCapture ? { amount_to_capture: amountToCapture } : undefined
  )

  if (intent.id) {
    await prisma.sOSRequest.updateMany({ where: { paymentIntentId: intent.id }, data: { status: 'COMPLETED' } })
  }

  logger.info({ intentStatus: intent.status }, 'Payment captured')
  return intent
}

export async function cancelPayment(paymentIntentId: string) {
  if (!stripe) throw new Error('Stripe not configured')

  const intent = await stripe.paymentIntents.cancel(paymentIntentId)

  await prisma.sOSRequest.updateMany({ where: { paymentIntentId }, data: { status: 'FAILED' } })

  logger.info({ intentStatus: intent.status }, 'Payment canceled')
  return intent
}

export async function getCheckoutSession(sessionId: string) {
  if (!stripe) throw new Error('Stripe not configured')
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  const sos = await prisma.sOSRequest.findFirst({ where: { stripeSessionId: sessionId } })

  // Fallback persistence: if webhook didn’t reach us yet, store payment_intent_id now
  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? (session.payment_intent as string)
      : session.payment_intent?.id

  if (sos && paymentIntentId && !sos.paymentIntentId) {
    await prisma.sOSRequest.update({
      where: { id: sos.id },
      data: { paymentIntentId, status: 'ASSIGNED' },
    })
    // Optionally re-fetch or return a shallow updated object
    const updated = { ...sos, paymentIntentId, status: 'ASSIGNED' as any }
    return { session, sos: updated }
  }

  return { session, sos }
}