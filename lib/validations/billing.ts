import { z } from 'zod'

export const billingCycleSchema = z.object({
  billing_cycle: z.enum(['monthly', 'quarterly', 'half-yearly', 'yearly']),
})

export const paymentMethodSchema = z.object({
  type: z.enum(['primary', 'backup']),
  stripe_payment_method_id: z.string().min(1),
  is_default: z.boolean().optional(),
})