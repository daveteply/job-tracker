import { EventCategoryType } from '@job-tracker/domain';

import { CompanyCreateSchema, CompanyDTOSchema, CompanyUpdateSchema } from './company-schema';
import {
  EventTypeCreateSchema,
  EventTypeDTOSchema,
  EventTypeUpdateSchema,
} from './event-type-schema';
import { UserSettingsSchema } from './user-settings-schema';

describe('Zod Schemas', () => {
  describe('EventType schemas', () => {
    it('EventTypeCreateSchema should validate valid data', () => {
      const data = {
        name: 'Test Event',
        category: EventCategoryType.Application,
        isSystemDefined: false,
        isCommon: true,
      };
      expect(EventTypeCreateSchema.safeParse(data).success).toBe(true);
    });

    it('EventTypeUpdateSchema should validate partial data', () => {
      const data = {
        name: 'Updated Name',
      };
      expect(EventTypeUpdateSchema.safeParse(data).success).toBe(true);
    });

    it('EventTypeDTOSchema should validate and transform', () => {
      const data = {
        id: '1',
        name: 'Test',
        category: EventCategoryType.Application,
        isSystemDefined: true,
        isCommon: false,
      };
      const result = EventTypeDTOSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.category).toBe(EventCategoryType.Application);
      }
    });
  });

  describe('UserSettingsSchema', () => {
    it('should validate valid user settings', () => {
      const data = {
        id: 'user-1',
        showFullEventList: true,
        showInactiveRoles: false,
        locale: 'en',
        appearance: 'system',
      };
      expect(UserSettingsSchema.safeParse(data).success).toBe(true);
    });
  });

  describe('Company schemas', () => {
    it('CompanyCreateSchema should validate valid data', () => {
      const data = {
        name: 'Acme Corp',
        website: 'https://acme.com',
        industry: 'Tech',
      };
      expect(CompanyCreateSchema.safeParse(data).success).toBe(true);
    });

    it('CompanyUpdateSchema should validate partial data', () => {
      const data = {
        name: 'New Acme',
      };
      expect(CompanyUpdateSchema.safeParse(data).success).toBe(true);
    });

    it('CompanyDTOSchema should validate valid DTO', () => {
      const data = {
        id: 'comp-1',
        version: 1,
        name: 'Acme',
        search: 'acme',
      };
      expect(CompanyDTOSchema.safeParse(data).success).toBe(true);
    });
  });
});
