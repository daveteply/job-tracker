import {
  addBusinessDays,
  addDays,
  createAuditTimestamps,
  createUpdatedAt,
  formatDateForInput,
} from './timestamps';

describe('timestamps', () => {
  describe('createAuditTimestamps', () => {
    it('should create audit timestamps with provided date', () => {
      const date = new Date('2023-01-01T12:00:00Z');
      const result = createAuditTimestamps(date);
      expect(result).toEqual({
        createdAt: '2023-01-01T12:00:00.000Z',
        updatedAt: '2023-01-01T12:00:00.000Z',
      });
    });

    it('should use current date if none provided', () => {
      const result = createAuditTimestamps();
      const now = new Date();
      expect(new Date(result.createdAt).getTime()).toBeCloseTo(now.getTime(), -2);
      expect(result.createdAt).toBe(result.updatedAt);
    });
  });

  describe('createUpdatedAt', () => {
    it('should create updated timestamp with provided date', () => {
      const date = new Date('2023-01-01T12:00:00Z');
      expect(createUpdatedAt(date)).toBe('2023-01-01T12:00:00.000Z');
    });

    it('should use current date if none provided', () => {
      const result = createUpdatedAt();
      const now = new Date();
      expect(new Date(result).getTime()).toBeCloseTo(now.getTime(), -2);
    });
  });

  describe('addBusinessDays', () => {
    it('should add positive business days correctly', () => {
      const friday = new Date(2023, 9, 20); // Friday, Oct 20, 2023
      const monday = addBusinessDays(friday, 1);
      expect(monday.getDay()).toBe(1); // Monday
      expect(monday.getDate()).toBe(23);
    });

    it('should add multiple business days skipping weekends', () => {
      const thursday = new Date(2023, 9, 19); // Thursday, Oct 19, 2023
      const nextTuesday = addBusinessDays(thursday, 3);
      expect(nextTuesday.getDate()).toBe(24);
      expect(nextTuesday.getDay()).toBe(2); // Tuesday
    });

    it('should handle negative business days', () => {
      const monday = new Date(2023, 9, 23); // Monday, Oct 23, 2023
      const friday = addBusinessDays(monday, -1);
      expect(friday.getDate()).toBe(20);
      expect(friday.getDay()).toBe(5); // Friday
    });

    it('should return same date if 0 days added', () => {
      const date = new Date(2023, 9, 20);
      expect(addBusinessDays(date, 0).getTime()).toBe(date.getTime());
    });
  });

  describe('addDays', () => {
    it('should add days correctly including weekends', () => {
      const friday = new Date(2023, 9, 20); // Friday, Oct 20, 2023
      const sunday = addDays(friday, 2);
      expect(sunday.getDate()).toBe(22);
      expect(sunday.getDay()).toBe(0); // Sunday
    });
  });

  describe('formatDateForInput', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date('2023-05-09T12:00:00Z');
      // Use local date values to avoid timezone issues in tests
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const expected = `${year}-${month}-${day}`;
      
      expect(formatDateForInput(date)).toBe(expected);
    });

    it('should pad month and day with zeros', () => {
      const date = new Date(2023, 0, 5); // Jan 5th
      expect(formatDateForInput(date)).toBe('2023-01-05');
    });
  });
});
