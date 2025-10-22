import { Hono } from 'hono'
import { stripeWebhookHandler } from '../controllers/webhookController'

export const webhookRouter = new Hono()

webhookRouter.post('/stripe', stripeWebhookHandler)