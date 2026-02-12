import { z } from 'zod'

export const organizationSettingsSchema = z.object({
  sensitivity_level: z.enum(['low', 'standard', 'high']),
  cooldown_period: z.number().int().min(1).max(365),
  playbook_low_performance: z.boolean(),
  playbook_overwork_burnout: z.boolean(),
  playbook_promotion_overdue: z.boolean(),
  playbook_low_satisfaction: z.boolean(),
  playbook_long_commute: z.boolean(),
})

export const detectionSettingsSchema = z.object({
  sensitivity_level: z.enum(['low', 'standard', 'high']),
  cooldown_period: z.number().int().min(1).max(365),
})

export const playbooksSettingsSchema = z.object({
  playbook_low_performance: z.boolean(),
  playbook_overwork_burnout: z.boolean(),
  playbook_promotion_overdue: z.boolean(),
  playbook_low_satisfaction: z.boolean(),
  playbook_long_commute: z.boolean(),
})