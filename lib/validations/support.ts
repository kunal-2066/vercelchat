import { z } from 'zod'

export const supportMessageSchema = z.object({
  message: z.string().min(10).max(5000),
  context: z.object({
    page: z.string(),
    section: z.string().optional(),
    orgId: z.string().uuid().optional(),
  }),
})

export const callRequestSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
  email: z.string().email(),
  message: z.string().min(10).max(1000).optional(),
  context: z.object({
    page: z.string(),
    section: z.string().optional(),
  }),
})

export const sessionBookingSchema = z.object({
  session_type: z.enum(['demo', 'consultation', 'training', 'support']),
  preferred_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferred_time: z.string().regex(/^\d{2}:\d{2}$/),
  contact_info: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
  message: z.string().max(1000).optional(),
})