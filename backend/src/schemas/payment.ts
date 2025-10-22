import { z } from 'zod'

export const createCheckoutSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  operator: z.string().min(1),
  connectionType: z.string().optional(),
  connection_type: z.string().optional(),
  delay: z.string().min(1),
  details: z.string().min(1),
})

export const captureSchema = z.object({
  payment_intent_id: z.string().min(1),
  amount_to_capture: z.number().int().positive().optional(),
})

export const cancelSchema = z.object({
  payment_intent_id: z.string().min(1),
})

export const getCheckoutSessionParams = z.object({
  id: z.string().min(1),
})

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>
export type CaptureInput = z.infer<typeof captureSchema>
export type CancelInput = z.infer<typeof cancelSchema>