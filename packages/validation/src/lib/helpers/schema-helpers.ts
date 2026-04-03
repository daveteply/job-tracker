import z from 'zod';

export const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => (val === '' ? undefined : val), schema);

export const updateOptionalString = (maxLength: number) =>
  z
    .literal('')
    .or(z.string().min(1).max(maxLength))
    .or(z.null())
    .optional()
    .transform((val) => (val === null ? undefined : val));

export const updateOptionalUrl = (maxLength: number) =>
  z
    .preprocess(
      (val) => val,
      z.literal('').or(z.url('Must be a valid URL').max(maxLength)).or(z.null()),
    )
    .optional()
    .transform((val) => (val === null ? undefined : val));

export const updateOptionalEmail = (maxLength: number) =>
  z
    .preprocess(
      (val) => val,
      z.literal('').or(z.email('Must be a valid email').max(maxLength)).or(z.null()),
    )
    .optional()
    .transform((val) => (val === null ? undefined : val));

export const phoneRegex = /^\+?[\d\s\-().]{1,16}$/;
export const updateOptionalPhone = (maxLength: number) =>
  z
    .preprocess(
      (val) => val,
      z
        .literal('')
        .or(z.string().max(maxLength).regex(phoneRegex, 'Must be a valid phone number'))
        .or(z.null()),
    )
    .optional()
    .transform((val) => (val === null ? undefined : val));

export const updateOptionalBoolean = z
  .boolean()
  .or(z.null())
  .optional()
  .transform((val) => (val === null ? undefined : val));

export const EntitySelectionSchema = z.object({
  id: z.string().optional(),
  isNew: z.boolean().optional().default(false),
  shouldRemove: z.boolean().optional().default(false),
  displayValue: z.string().optional(),
});

export const CompanySelectionSchema = EntitySelectionSchema.extend({
  name: z.string().optional(),
}).refine((data) => data.shouldRemove || (data.name && data.name.length > 0), {
  message: 'Company name is required',
  path: ['name'],
});

export const ContactSelectionSchema = EntitySelectionSchema.extend({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).refine(
  (data) =>
    data.shouldRemove ||
    (data.firstName && data.firstName.length > 0 && data.lastName && data.lastName.length > 0),
  {
    message: 'Contact first & last name are required',
    path: ['firstName', 'lastName'],
  },
);

export const RoleSelectionSchema = EntitySelectionSchema.extend({
  title: z.string().optional(),
}).refine((data) => data.shouldRemove || (data.title && data.title.length > 0), {
  message: 'Role title is required',
  path: ['title'],
});

export const updateRequiredString = (maxLength: number, message: string) =>
  z
    .string()
    .min(1, message)
    .max(maxLength)
    .or(z.null())
    .optional()
    .transform((val) => (val === null ? undefined : val));

export const updateRequiredBoolean = () =>
  z
    .boolean()
    .or(z.null())
    .optional()
    .transform((val) => (val === null ? undefined : val));
