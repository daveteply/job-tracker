import { z } from 'zod';
import { DirectionType, EventCategoryType, SourceType } from '@job-tracker/domain';
import { RoleStatus } from 'packages/domain/src/lib/common/role-status-type';

const directionSchema = z.enum(Object.values(DirectionType));
const sourceSchema = z.enum(Object.values(SourceType));
const eventCategorySchema = z.enum(Object.values(EventCategoryType));
const roleStatusSchema = z.enum(Object.values(RoleStatus));

export const DirectionTypeSchema = z
  .enum(directionSchema.options)
  .or(z.literal(''))
  .refine((val) => val !== '', {
    message: 'Select a direction',
  });

export const SourceTypeSchema = z
  .enum(sourceSchema.options)
  .or(z.literal(''))
  .refine((val) => val !== '', {
    message: 'Select a source',
  });

export const EventCategoryTypeSchema = z
  .enum(eventCategorySchema.options)
  .or(z.literal(''))
  .refine((val) => val !== '', {
    message: 'Select a category',
  });

export const RoleStatusSchema = z
  .enum(roleStatusSchema.options)
  .or(z.literal(''))
  .refine((val) => val !== '', {
    message: 'Select a status',
  });
