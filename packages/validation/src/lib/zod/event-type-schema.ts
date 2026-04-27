import { z } from 'zod';

import { EventCategoryType, RoleStatus } from '@job-tracker/domain';

import { updateRequiredBoolean, updateRequiredString } from '../helpers/schema-helpers';

import { EventCategoryTypeSchema, RoleStatusSchema } from './enum-schema';

export const EventTypeCreateSchema = z.object({
  name: z.string().min(1, 'Event Type name is required').max(100),
  category: EventCategoryTypeSchema,
  targetStatus: RoleStatusSchema.nullable().optional(),
  isSystemDefined: z.boolean().default(false),
  isCommon: z.boolean().default(false),
});

export const EventTypeUpdateSchema = z
  .object({
    name: updateRequiredString(100, 'Event Type name is required'),
    category: EventCategoryTypeSchema.optional(),
    targetStatus: RoleStatusSchema.nullable().optional(),
    isSystemDefined: updateRequiredBoolean(),
    isCommon: updateRequiredBoolean(),
  })
  .partial();

export const EventTypeDTOSchema = z.object({
  id: z.string(),
  serverId: z.number().nullable().optional(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),

  name: z.string(),
  category: z
    .enum(Object.values(EventCategoryType) as [string, ...string[]])
    .transform((val) => val as EventCategoryType),
  targetStatus: z
    .enum(Object.values(RoleStatus) as [string, ...string[]])
    .nullable()
    .optional()
    .transform((val) => (val ? (val as RoleStatus) : null)),
  isSystemDefined: z.boolean(),
  isCommon: z.boolean(),
});

export type EventTypeCreate = z.infer<typeof EventTypeCreateSchema>;
export type EventTypeUpdate = z.infer<typeof EventTypeUpdateSchema>;
export type EventTypeDTO = z.infer<typeof EventTypeDTOSchema>;
