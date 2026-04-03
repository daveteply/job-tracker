import { EventCreateWithReminderSchema } from './event-schema';
import { DirectionType, SourceType } from '@job-tracker/domain';

describe('EventCreateWithReminderSchema', () => {
  const validBaseData = {
    eventTypeId: 'type-1',
    occurredAt: new Date(),
    source: SourceType.Email,
    direction: DirectionType.Inbound,
    summary: 'Test summary',
  };

  it('should validate successfully when hasReminder is false and remindAt is null', () => {
    const data = {
      ...validBaseData,
      hasReminder: false,
      remindAt: null,
    };
    const result = EventCreateWithReminderSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should validate successfully when hasReminder is true and remindAt is a valid date', () => {
    const data = {
      ...validBaseData,
      hasReminder: true,
      remindAt: new Date().toISOString().split('T')[0],
    };
    const result = EventCreateWithReminderSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.remindAt).toBeInstanceOf(Date);
    }
  });

  it('should fail validation when hasReminder is true and remindAt is null', () => {
    const data = {
      ...validBaseData,
      hasReminder: true,
      remindAt: null,
    };
    const result = EventCreateWithReminderSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Reminder date is required');
      expect(result.error.issues[0].path).toContain('remindAt');
    }
  });

  it('should fail validation when hasReminder is true and remindAt is an invalid date string', () => {
    const data = {
      ...validBaseData,
      hasReminder: true,
      remindAt: 'not-a-date',
    };
    const result = EventCreateWithReminderSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
