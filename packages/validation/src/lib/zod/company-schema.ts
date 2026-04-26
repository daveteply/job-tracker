import { z } from 'zod';

import {
  emptyToUndefined,
  updateOptionalString,
  updateOptionalUrl,
  updateRequiredString,
} from '../helpers/schema-helpers';

export const CompanyCreateSchema = z.object({
  name: z.string().min(1, 'companyNameRequired').max(100),
  website: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.url('invalidUrl').max(2048).optional(),
  ),
  industry: emptyToUndefined(z.string().optional()),
  sizeRange: emptyToUndefined(z.string().optional()),
  notes: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
});

export const CompanyUpdateSchema = z
  .object({
    name: updateRequiredString(100, 'companyNameRequired'),
    website: updateOptionalUrl(2048),
    industry: updateOptionalString(100),
    sizeRange: updateOptionalString(100),
    notes: updateOptionalString(2048),
  })
  .partial();

export const CompanyDTOSchema = z.object({
  id: z.string(),
  serverId: z.number().nullable().optional(),
  version: z.number(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),

  name: z.string(),
  search: z.string(),
  website: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  sizeRange: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type CompanyCreate = z.infer<typeof CompanyCreateSchema>;
export type CompanyUpdate = z.infer<typeof CompanyUpdateSchema>;
export type CompanyDTO = z.infer<typeof CompanyDTOSchema>;
