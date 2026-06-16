import { z } from 'zod';

import { DirectionType, EventCategoryType } from '@job-tracker/domain';
import { RoleStatus } from '@job-tracker/domain';

const directionSchema = z.enum(Object.values(DirectionType));
const eventCategorySchema = z.enum(Object.values(EventCategoryType));
const roleStatusSchema = z.enum(Object.values(RoleStatus));

export const DirectionTypeSchema = z
  .enum(directionSchema.options)
  .or(z.literal(''))
  .refine((val) => val !== '', {
    message: 'selectDirection',
  });

export const EventCategoryTypeSchema = z
  .enum(eventCategorySchema.options)
  .or(z.literal(''))
  .refine((val) => val !== '', {
    message: 'selectCategory',
  });

export const RoleStatusSchema = z
  .enum(roleStatusSchema.options)
  .or(z.literal(''))
  .refine((val) => val !== '', {
    message: 'selectStatus',
  });
