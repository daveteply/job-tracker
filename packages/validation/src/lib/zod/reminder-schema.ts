import { z } from 'zod';

import { emptyToUndefined } from '../helpers/schema-helpers';

import { EventWithChildrenDTO } from './event-schema';

export const ReminderInputSchema = z.object({
  id: z.string().optional(),
  eventId: z.string(),
  remindAt: emptyToUndefined(z.coerce.date({ message: 'invalidDate' })),
  completedAt: emptyToUndefined(z.coerce.date().nullable().optional()),
});

export const ReminderUpdateSchema = ReminderInputSchema.partial().required({
  id: true,
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
