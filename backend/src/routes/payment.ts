import { Hono } from 'hono'
import { createCheckoutSessionHandler, captureHandler, cancelHandler, getCheckoutSessionHandler } from '../controllers/paymentController'
import { zValidator } from '@hono/zod-validator'
import { createCheckoutSchema, captureSchema, cancelSchema, getCheckoutSessionParams } from '../schemas/payment'

export const paymentRouter = new Hono()

paymentRouter.post('/create-checkout-session', zValidator('json', createCheckoutSchema), createCheckoutSessionHandler)
paymentRouter.get('/checkout-session/:id', zValidator('param', getCheckoutSessionParams), getCheckoutSessionHandler)
paymentRouter.post('/capture', zValidator('json', captureSchema), captureHandler)
paymentRouter.post('/cancel', zValidator('json', cancelSchema), cancelHandler)