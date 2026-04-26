import { z } from 'zod';

import {
  CompanySelectionSchema,
  emptyToUndefined,
  phoneRegex,
  updateOptionalBoolean,
  updateOptionalEmail,
  updateOptionalPhone,
  updateOptionalString,
  updateOptionalUrl,
  updateRequiredString,
} from '../helpers/schema-helpers';

import { CompanyDTO } from './company-schema';

const contactCreateBase = {
  title: emptyToUndefined(z.string().max(100).optional()),
  email: emptyToUndefined(z.email('invalidEmail').max(254).optional()),
  phoneNumber: emptyToUndefined(
    z.string().max(30).regex(phoneRegex, 'invalidPhone').optional(),
  ),
  linkedInUrl: emptyToUndefined(z.url('invalidUrl').max(2048).optional()),
  isPrimaryRecruiter: z
    .boolean()
    .or(z.null())
    .optional()
    .transform((val) => (val === null ? undefined : val)),
  notes: emptyToUndefined(z.string().max(2048).optional()),
  company: CompanySelectionSchema.or(z.null()).optional(),
};

export const ContactCreateSchema = z.object({
  firstName: z.string().min(1, 'firstNameRequired').max(100),
  lastName: z.string().min(1, 'lastNameRequired').max(100),
  ...contactCreateBase,
});

export const ContactUpdateSchema = z
  .object({
    firstName: updateRequiredString(100, 'firstNameRequired'),
    lastName: updateRequiredString(100, 'lastNameRequired'),
    title: updateOptionalString(100),
    email: updateOptionalEmail(254),
    phoneNumber: updateOptionalPhone(30),
    linkedInUrl: updateOptionalUrl(2048),
    isPrimaryRecruiter: updateOptionalBoolean,
    notes: updateOptionalString(2048),
    company: CompanySelectionSchema.or(z.null()).optional(),
  })
  .partial();

export const ContactDTOSchema = z.object({
  id: z.string(),
  serverId: z.number().nullable().optional(),
  version: z.number(),
  companyId: z.string().nullable().optional(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),

  firstName: z.string(),
  lastName: z.string(),
  search: z.string(),
  title: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  linkedInUrl: z.string().nullable().optional(),
  isPrimaryRecruiter: z.boolean().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type ContactCreate = z.infer<typeof ContactCreateSchema>;
export type ContactUpdate = z.infer<typeof ContactUpdateSchema>;
export type ContactDTO = z.infer<typeof ContactDTOSchema>;

export interface ContactWithCompanyDTO extends ContactDTO {
  company?: CompanyDTO | null;
}
