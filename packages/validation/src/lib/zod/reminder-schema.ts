import { z } from 'zod';
import { EventWithChildrenDTO } from './event-schema';

export const ReminderInputSchema = z.object({
  eventId: z.string(),
  remindAt: z.coerce.date(),
  completedAt: z.coerce.date().optional(),
});

export const ReminderUpdateSchema = ReminderInputSchema.partial().required({
  eventId: true,
});

export const ReminderDTOSchema = z.object({
  id: z.string(),
  serverId: z.number().nullable().optional(),
  version: z.number(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),

  eventId: z.string(),
  remindAt: z.date(),
  completedAt: z.date().nullable().optional(),
});

export type ReminderInput = z.infer<typeof ReminderInputSchema>;
export type ReminderDTO = z.infer<typeof ReminderDTOSchema>;

export interface ReminderWithChildrenDTO extends ReminderDTO {
  event?: EventWithChildrenDTO | null;
}
