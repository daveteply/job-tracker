import { z } from 'zod';
import {
  updateRequiredString,
  updateOptionalString,
  updateOptionalUrl,
  emptyToUndefined,
} from '../helpers/schema-helpers';

export const CompanyCreateSchema = z.object({
  name: z.string().min(1, 'Company name is required').max(100),
  website: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.url('Must be a valid URL').max(2048).optional(),
  ),
  industry: emptyToUndefined(z.string().optional()),
  sizeRange: emptyToUndefined(z.string().optional()),
  notes: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
});

export const CompanyUpdateSchema = z
  .object({
    name: updateRequiredString(100, 'Company name is required'),
    website: updateOptionalUrl(2048),
    industry: updateOptionalString(100),
    sizeRange: updateOptionalString(100),
    notes: updateOptionalString(2048),
  })
  .partial();

export const CompanyDTOSchema = z.object({
  id: z.string(),
  serverId: z.number().nullable().optional(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),

  name: z.string(),
  website: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  sizeRange: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type CompanyCreate = z.infer<typeof CompanyCreateSchema>;
export type CompanyUpdate = z.infer<typeof CompanyUpdateSchema>;
export type CompanyDTO = z.infer<typeof CompanyDTOSchema>;
