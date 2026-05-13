import { ReminderDTO } from '@job-tracker/validation';

import { ReminderDocument } from '../database/documents/reminder.document';

import { ReminderMapper } from './reminder.mapper';

describe('ReminderMapper', () => {
  const mockRemindAt = new Date('2023-01-01T12:00:00Z');
  const mockCompletedAt = new Date('2023-01-01T13:00:00Z');
  const mockDoc: ReminderDocument = {
    id: '1',
    serverId: 123,
    version: 1,
    updatedAt: '2023-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    eventId: 'e1',
    remindAt: mockRemindAt.toISOString(),
    completedAt: mockCompletedAt.toISOString(),
  };

  const mockDto: ReminderDTO = {
    id: '1',
    serverId: 123,
    version: 1,
    updatedAt: '2023-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    eventId: 'e1',
    remindAt: mockRemindAt,
    completedAt: mockCompletedAt,
  };

  it('should map document to entity', () => {
    const entity = ReminderMapper.toEntity(mockDoc);
    expect(entity.id).toBe(mockDoc.id);
    expect(entity.remindAt).toEqual(mockRemindAt);
  });

  it('should map document to DTO', () => {
    const dto = ReminderMapper.toDto(mockDoc);
    expect(dto).toEqual(mockDto);
  });

  it('should map DTO to document', () => {
    const doc = ReminderMapper.toDocument(mockDto);
    expect(doc.id).toBe(mockDto.id);
    expect(doc.remindAt).toBe(mockRemindAt.toISOString());
    expect(doc.completedAt).toBe(mockCompletedAt.toISOString());
  });

  it('should handle missing optional fields in toDocument', () => {
    const minimalDto = { id: '2' };
    const doc = ReminderMapper.toDocument(minimalDto);
    expect(doc.id).toBe('2');
    expect(doc.eventId).toBeNull();
    expect(doc.completedAt).toBeNull();
  });
});
