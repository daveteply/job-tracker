import { z } from 'zod';
import { DirectionType, SourceType } from '@job-tracker/domain';
import { DirectionTypeSchema, SourceTypeSchema } from './enum-schema';
import {
  CompanySelectionSchema,
  ContactSelectionSchema,
  emptyToUndefined,
  RoleSelectionSchema,
  updateOptionalString,
} from '../helpers/schema-helpers';
import { CompanyDTO } from './company-schema';
import { ContactDTO } from './contact-schema';
import { RoleDTO } from './role-schema';
import { EventTypeDTO } from './event-type-schema';

export const EventCreateSchema = z.object({
  // Relations: Optional and Composable to match Role/Contact patterns
  company: CompanySelectionSchema.or(z.null()).optional(),
  contact: ContactSelectionSchema.or(z.null()).optional(),
  role: RoleSelectionSchema.or(z.null()).optional(),

  // Event specifics
  eventTypeId: z
    .string({ message: 'Select an event type' })
    .nullable()
    .refine((val) => val !== null && val.length > 0, {
      message: 'Select an event type',
    }),

  occurredAt: z.coerce.date({ message: 'Must be a valid date' }),

  // Text fields aligned with RxDB schema
  summary: emptyToUndefined(z.string().max(500).optional()),
  details: emptyToUndefined(z.string().optional()),

  // Enums
  source: SourceTypeSchema.nullable().refine((val) => val !== null, {
    message: 'Select a source',
  }),
  direction: DirectionTypeSchema.nullable().refine((val) => val !== null, {
    message: 'Select a direction',
  }),
});

export const EventCreateWithReminderSchema = EventCreateSchema.extend({
  hasReminder: z.boolean().default(false),
  remindAt: z.coerce.date().optional().nullable(),
}).refine(
  (data) => {
    if (data.hasReminder) {
      return data.remindAt instanceof Date && !isNaN(data.remindAt.getTime());
    }
    return true;
  },
  {
    message: 'Reminder date is required',
    path: ['remindAt'],
  }
);

export const EventUpdateSchema = z
  .object({
    company: CompanySelectionSchema.or(z.null()).optional(),
    contact: ContactSelectionSchema.or(z.null()).optional(),
    role: RoleSelectionSchema.or(z.null()).optional(),

    eventTypeId: z.string().nullable().optional(),
    occurredAt: z.coerce.date().optional(),
    summary: updateOptionalString(500),
    details: updateOptionalString(10000), // High limit for "unlimited" notes
    source: SourceTypeSchema.optional(),
    direction: DirectionTypeSchema.optional(),
  })
  .partial();

export const EventDTOSchema = z.object({
  id: z.string(),
  serverId: z.number().nullable().optional(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),

  eventTypeId: z.string(),
  companyId: z.string().nullable().optional(),
  contactId: z.string().nullable().optional(),
  roleId: z.string().nullable().optional(),

  occurredAt: z.date(),
  summary: z.string().nullable().optional(),
  details: z.string().nullable().optional(),
  source: z
    .enum(Object.values(SourceType) as [string, ...string[]])
    .transform((val) => val as SourceType),
  direction: z
    .enum(Object.values(DirectionType) as [string, ...string[]])
    .transform((val) => val as DirectionType),
});

export type EventCreate = z.infer<typeof EventCreateSchema>;
export type EventCreateWithReminder = z.infer<typeof EventCreateWithReminderSchema>;
export type EventUpdate = z.infer<typeof EventUpdateSchema>;
export type EventDTO = z.infer<typeof EventDTOSchema>;

export interface EventWithChildrenDTO extends EventDTO {
  eventType: EventTypeDTO | null;
  company?: CompanyDTO | null;
  contact?: ContactDTO | null;
  role?: RoleDTO | null;
}
