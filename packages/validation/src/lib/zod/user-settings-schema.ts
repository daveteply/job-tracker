import { z } from 'zod';

export const UserSettingsSchema = z.object({
  id: z.string(),
  showFullEventList: z.boolean(),
  showInactiveRoles: z.boolean(),
  locale: z.string(),
  appearance: z.enum(['light', 'dark', 'system']),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
});

export type UserSettingsDTO = z.infer<typeof UserSettingsSchema>;
