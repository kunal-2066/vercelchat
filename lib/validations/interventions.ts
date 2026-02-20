import { z } from 'zod'

export const interventionSchema = z.object({
  employee_id: z.number().int().positive(),
  pattern_type: z.enum(['burnout', 'promotion', 'satisfaction', 'performance', 'commute']),
  detected_pattern: z.string().min(1),
  why_it_matters: z.string().min(1),
  recommended_action: z.string().min(1),
  days_active: z.number().int().nonnegative().optional(),
})

export const interventionStatusSchema = z.object({
  status: z.enum(['pending', 'started', 'completed']),
})

export const interventionQuerySchema = z.object({
  status: z.enum(['pending', 'started', 'completed']).optional(),
})