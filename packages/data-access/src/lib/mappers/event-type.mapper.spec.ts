import { EventCategoryType, RoleStatus } from '@job-tracker/domain';
import { EventTypeDTO } from '@job-tracker/validation';

import { EventTypeDocument } from '../database/documents/event-type.document';

import { EventTypeMapper } from './event-type.mapper';

describe('EventTypeMapper', () => {
  const mockDoc: EventTypeDocument = {
    id: '1',
    serverId: 123,
    updatedAt: '2023-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    name: 'Interview',
    translationKey: 'event.interview',
    category: EventCategoryType.Interview,
    targetStatus: RoleStatus.Interviewing,
    isSystemDefined: true,
    isCommon: true,
  };

  const mockDto: EventTypeDTO = {
    id: '1',
    serverId: 123,
    updatedAt: '2023-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    name: 'Interview',
    translationKey: 'event.interview',
    category: EventCategoryType.Interview,
    targetStatus: RoleStatus.Interviewing,
    isSystemDefined: true,
    isCommon: true,
  };

  it('should map document to entity', () => {
    const entity = EventTypeMapper.toEntity(mockDoc);
    expect(entity.id).toBe(mockDoc.id);
    expect(entity.name).toBe(mockDoc.name);
  });

  it('should map document to DTO', () => {
    const dto = EventTypeMapper.toDto(mockDoc);
    expect(dto).toEqual(mockDto);
  });

  it('should map DTO to document', () => {
    const doc = EventTypeMapper.toDocument(mockDto);
    expect(doc.id).toBe(mockDto.id);
    expect(doc.name).toBe(mockDto.name);
  });

  it('should handle missing optional fields in toDocument', () => {
    const minimalDto = { id: '2', name: 'Minimal' };
    const doc = EventTypeMapper.toDocument(minimalDto);
    expect(doc.id).toBe('2');
    expect(doc.category).toBe(EventCategoryType.Application);
    expect(doc.isSystemDefined).toBe(false);
  });
});
