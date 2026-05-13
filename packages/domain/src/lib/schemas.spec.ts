import { CompanySchema } from './company/company.schema';
import { ContactSchema } from './contact/contact.schema';
import { EventSchema } from './event/event.schema';
import { EventTypeSchema } from './event/event-type.schema';
import { ReminderSchema } from './reminder/reminder.schema';
import { RoleSchema } from './role/role.schema';
import { UserSettingsSchema } from './user-settings/user-settings.schema';

describe('RxDB Schemas', () => {
  it('should be valid objects', () => {
    expect(CompanySchema.title).toBe('company schema');
    expect(ContactSchema.title).toBe('contact schema');
    expect(EventSchema.title).toBe('event schema');
    expect(EventTypeSchema.title).toBe('event type schema');
    expect(ReminderSchema.title).toBe('reminder schema');
    expect(RoleSchema.title).toBe('role schema');
    expect(UserSettingsSchema.title).toBe('user settings schema');
  });

  it('should have primary key "id"', () => {
    expect(CompanySchema.primaryKey).toBe('id');
    expect(ContactSchema.primaryKey).toBe('id');
    expect(EventSchema.primaryKey).toBe('id');
    expect(EventTypeSchema.primaryKey).toBe('id');
    expect(ReminderSchema.primaryKey).toBe('id');
    expect(RoleSchema.primaryKey).toBe('id');
    expect(UserSettingsSchema.primaryKey).toBe('id');
  });
});
