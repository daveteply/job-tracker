import { z } from 'zod';

export const UserSettingsSchema = z.object({
  id: z.string(),
  showFullEventList: z.boolean(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
});

export type UserSettingsDTO = z.infer<typeof UserSettingsSchema>;
