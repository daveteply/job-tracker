import { z } from 'zod';

import { updateRequiredBoolean, updateRequiredString } from '../helpers/schema-helpers';

export const SourceTypeCreateSchema = z.object({
  name: z.string().min(1, 'Source Type name is required').max(100),
  isSystemDefined: z.boolean().default(false),
});

export const SourceTypeUpdateSchema = z
  .object({
    name: updateRequiredString(100, 'Source Type name is required'),
    isSystemDefined: updateRequiredBoolean(),
  })
  .partial();

export const SourceTypeDTOSchema = z.object({
  id: z.string(),
  serverId: z.number().nullable().optional(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),

  name: z.string(),
  isSystemDefined: z.boolean(),
});

export type SourceTypeCreate = z.infer<typeof SourceTypeCreateSchema>;
export type SourceTypeUpdate = z.infer<typeof SourceTypeUpdateSchema>;
export type SourceTypeDTO = z.infer<typeof SourceTypeDTOSchema>;
