import { DirectionType, RoleStatus,SourceType } from '@job-tracker/domain';

import { CompanyDTOSchema } from './company-schema';
import { ContactDTOSchema } from './contact-schema';
import { EventDTOSchema } from './event-schema';
import { ReminderDTOSchema } from './reminder-schema';
import { RoleDTOSchema } from './role-schema';

describe('DTO Schemas version property', () => {
  const validBase = {
    id: 'test-id',
    version: 1,
  };

  it('CompanyDTOSchema should require version', () => {
    const data = { ...validBase, name: 'Test', search: 'test' };
    expect(CompanyDTOSchema.safeParse(data).success).toBe(true);

    const { version, ...withoutVersion } = data;
    expect(CompanyDTOSchema.safeParse(withoutVersion).success).toBe(false);
  });

  it('ContactDTOSchema should require version', () => {
    const data = { ...validBase, firstName: 'John', lastName: 'Doe', search: 'john doe' };
    expect(ContactDTOSchema.safeParse(data).success).toBe(true);

    const { version, ...withoutVersion } = data;
    expect(ContactDTOSchema.safeParse(withoutVersion).success).toBe(false);
  });

  it('EventDTOSchema should require version', () => {
    const data = {
      ...validBase,
      eventTypeId: 'type-1',
      occurredAt: new Date(),
      source: SourceType.Email,
      direction: DirectionType.Inbound,
    };
    expect(EventDTOSchema.safeParse(data).success).toBe(true);

    const { version, ...withoutVersion } = data;
    expect(EventDTOSchema.safeParse(withoutVersion).success).toBe(false);
  });

  it('ReminderDTOSchema should require version', () => {
    const data = {
      ...validBase,
      eventId: 'event-1',
      remindAt: new Date(),
    };
    expect(ReminderDTOSchema.safeParse(data).success).toBe(true);

    const { version, ...withoutVersion } = data;
    expect(ReminderDTOSchema.safeParse(withoutVersion).success).toBe(false);
  });

  it('RoleDTOSchema should require version', () => {
    const data = {
      ...validBase,
      title: 'Engineer',
      status: RoleStatus.Applied,
      search: 'engineer',
    };
    expect(RoleDTOSchema.safeParse(data).success).toBe(true);

    const { version, ...withoutVersion } = data;
    expect(RoleDTOSchema.safeParse(withoutVersion).success).toBe(false);
  });
});
