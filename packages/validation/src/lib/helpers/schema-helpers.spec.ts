import z from 'zod';

import {
  CompanySelectionSchema,
  ContactSelectionSchema,
  emptyToUndefined,
  RoleSelectionSchema,
  updateOptionalBoolean,
  updateOptionalEmail,
  updateOptionalPhone,
  updateOptionalString,
  updateOptionalUrl,
  updateRequiredBoolean,
  updateRequiredString,
} from './schema-helpers';

describe('schema-helpers', () => {
  describe('emptyToUndefined', () => {
    const schema = emptyToUndefined(z.string().optional());
    it('should convert empty string to undefined', () => {
      expect(schema.parse('')).toBeUndefined();
    });
    it('should leave non-empty string as is', () => {
      expect(schema.parse('test')).toBe('test');
    });
  });

  describe('updateOptionalString', () => {
    const schema = updateOptionalString(10);
    it('should validate empty string', () => {
      expect(schema.parse('')).toBe('');
    });
    it('should validate string within max length', () => {
      expect(schema.parse('1234567890')).toBe('1234567890');
    });
    it('should fail for string exceeding max length', () => {
      expect(schema.safeParse('12345678901').success).toBe(false);
    });
    it('should transform null to undefined', () => {
      expect(schema.parse(null)).toBeUndefined();
    });
  });

  describe('updateOptionalUrl', () => {
    const schema = updateOptionalUrl(50);
    it('should validate empty string', () => {
      expect(schema.parse('')).toBe('');
    });
    it('should validate valid URL', () => {
      expect(schema.parse('https://example.com')).toBe('https://example.com');
    });
    it('should fail for invalid URL', () => {
      expect(schema.safeParse('not-a-url').success).toBe(false);
    });
    it('should transform null to undefined', () => {
      expect(schema.parse(null)).toBeUndefined();
    });
  });

  describe('updateOptionalEmail', () => {
    const schema = updateOptionalEmail(50);
    it('should validate empty string', () => {
      expect(schema.parse('')).toBe('');
    });
    it('should validate valid email', () => {
      expect(schema.parse('test@example.com')).toBe('test@example.com');
    });
    it('should fail for invalid email', () => {
      expect(schema.safeParse('not-an-email').success).toBe(false);
    });
    it('should transform null to undefined', () => {
      expect(schema.parse(null)).toBeUndefined();
    });
  });

  describe('updateOptionalPhone', () => {
    const schema = updateOptionalPhone(16);
    it('should validate empty string', () => {
      expect(schema.parse('')).toBe('');
    });
    it('should validate valid phone', () => {
      expect(schema.parse('+1234567890')).toBe('+1234567890');
      expect(schema.parse('123-456-7890')).toBe('123-456-7890');
    });
    it('should fail for invalid phone', () => {
      expect(schema.safeParse('abc').success).toBe(false);
    });
    it('should transform null to undefined', () => {
      expect(schema.parse(null)).toBeUndefined();
    });
  });

  describe('updateOptionalBoolean', () => {
    const schema = updateOptionalBoolean;
    it('should validate boolean', () => {
      expect(schema.parse(true)).toBe(true);
      expect(schema.parse(false)).toBe(false);
    });
    it('should transform null to undefined', () => {
      expect(schema.parse(null)).toBeUndefined();
    });
  });

  describe('CompanySelectionSchema', () => {
    it('should validate when shouldRemove is true', () => {
      const result = CompanySelectionSchema.safeParse({ shouldRemove: true });
      expect(result.success).toBe(true);
    });
    it('should validate when name is provided', () => {
      const result = CompanySelectionSchema.safeParse({ name: 'Test Company' });
      expect(result.success).toBe(true);
    });
    it('should fail when name is empty and shouldRemove is false', () => {
      const result = CompanySelectionSchema.safeParse({ name: '', shouldRemove: false });
      expect(result.success).toBe(false);
    });
  });

  describe('ContactSelectionSchema', () => {
    it('should validate when shouldRemove is true', () => {
      const result = ContactSelectionSchema.safeParse({ shouldRemove: true });
      expect(result.success).toBe(true);
    });
    it('should validate when firstName and lastName are provided', () => {
      const result = ContactSelectionSchema.safeParse({ firstName: 'John', lastName: 'Doe' });
      expect(result.success).toBe(true);
    });
    it('should fail when firstName is missing and shouldRemove is false', () => {
      const result = ContactSelectionSchema.safeParse({ lastName: 'Doe', shouldRemove: false });
      expect(result.success).toBe(false);
    });
  });

  describe('RoleSelectionSchema', () => {
    it('should validate when shouldRemove is true', () => {
      const result = RoleSelectionSchema.safeParse({ shouldRemove: true });
      expect(result.success).toBe(true);
    });
    it('should validate when title is provided', () => {
      const result = RoleSelectionSchema.safeParse({ title: 'Manager' });
      expect(result.success).toBe(true);
    });
    it('should fail when title is empty and shouldRemove is false', () => {
      const result = RoleSelectionSchema.safeParse({ title: '', shouldRemove: false });
      expect(result.success).toBe(false);
    });
  });

  describe('updateRequiredString', () => {
    const schema = updateRequiredString(10, 'required');
    it('should validate string within max length', () => {
      expect(schema.parse('test')).toBe('test');
    });
    it('should fail for empty string', () => {
      const result = schema.safeParse('');
      expect(result.success).toBe(false);
    });
    it('should transform null to undefined', () => {
      expect(schema.parse(null)).toBeUndefined();
    });
  });

  describe('updateRequiredBoolean', () => {
    const schema = updateRequiredBoolean();
    it('should validate boolean', () => {
      expect(schema.parse(true)).toBe(true);
    });
    it('should transform null to undefined', () => {
      expect(schema.parse(null)).toBeUndefined();
    });
  });
});
