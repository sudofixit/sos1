import { Hono } from 'hono'
import { healthHandler } from '../controllers/healthController'

export const healthRouter = new Hono()

healthRouter.get('/', healthHandler)