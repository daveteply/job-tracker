import { z } from 'zod';
import {
  emptyToUndefined,
  CompanySelectionSchema,
  updateRequiredString,
  updateOptionalUrl,
  updateOptionalString,
} from '../helpers/schema-helpers';
import { CompanyDTO } from './company-schema';
import { RoleStatus } from '@job-tracker/domain';
import { RoleStatusSchema } from './enum-schema';

const roleCreateBase = {
  jobPostingUrl: emptyToUndefined(z.url('Must be a valid URL').max(2048).optional()),
  location: z.string().max(255).optional(),
  level: z.string().max(100).optional(),
  salaryRange: z.string().max(100).optional(),
  notes: z.string().max(2048).optional(),
  company: CompanySelectionSchema.or(z.null()).optional(),
  status: RoleStatusSchema.nullable().refine((val) => val !== null, {
    message: 'Select a status',
  }),
};

export const RoleCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  ...roleCreateBase,
});

export const RoleUpdateSchema = z
  .object({
    title: updateRequiredString(255, 'Title is required'),
    jobPostingUrl: updateOptionalUrl(2048),
    location: updateOptionalString(255),
    level: updateOptionalString(100),
    salaryRange: updateOptionalString(100),
    notes: updateOptionalString(2048),
    company: CompanySelectionSchema.or(z.null()).optional(),
    status: RoleStatusSchema.optional(),
  })
  .partial();

export const RoleDTOSchema = z.object({
  id: z.string(),
  serverId: z.number().nullable().optional(),
  version: z.number(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),

  companyId: z.string().nullable().optional(),

  title: z.string(),
  jobPostingUrl: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  level: z.string().nullable().optional(),
  salaryRange: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: z
    .enum(Object.values(RoleStatus) as [string, ...string[]])
    .transform((val) => val as RoleStatus),
});

export type RoleCreate = z.infer<typeof RoleCreateSchema>;
export type RoleUpdate = z.infer<typeof RoleUpdateSchema>;
export type RoleDTO = z.infer<typeof RoleDTOSchema>;

export interface RoleWithCompanyDTO extends RoleDTO {
  company?: CompanyDTO | null;
}
