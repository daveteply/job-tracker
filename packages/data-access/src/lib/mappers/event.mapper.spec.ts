import { DirectionType, SourceType } from '@job-tracker/domain';
import { EventDTO } from '@job-tracker/validation';

import { EventDocument } from '../database/documents/event.document';

import { EventMapper } from './event.mapper';

describe('EventMapper', () => {
  const mockDate = new Date('2023-01-01T12:00:00Z');
  const mockDoc: EventDocument = {
    id: '1',
    serverId: 123,
    version: 1,
    updatedAt: '2023-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    eventTypeId: 'et1',
    companyId: 'c1',
    contactId: 'co1',
    roleId: 'r1',
    occurredAt: mockDate.toISOString(),
    source: SourceType.LinkedIn,
    direction: DirectionType.Inbound,
    summary: 'Initial reach out',
    details: 'Details about the reach out',
  };

  const mockDto: EventDTO = {
    id: '1',
    serverId: 123,
    version: 1,
    updatedAt: '2023-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    eventTypeId: 'et1',
    companyId: 'c1',
    contactId: 'co1',
    roleId: 'r1',
    occurredAt: mockDate,
    source: SourceType.LinkedIn,
    direction: DirectionType.Inbound,
    summary: 'Initial reach out',
    details: 'Details about the reach out',
  };

  it('should map document to entity', () => {
    const entity = EventMapper.toEntity(mockDoc);
    expect(entity.id).toBe(mockDoc.id);
    expect(entity.occurredAt).toEqual(mockDate);
    expect(entity.source).toBe(SourceType.LinkedIn);
  });

  it('should map document to DTO', () => {
    const dto = EventMapper.toDto(mockDoc);
    expect(dto).toEqual(mockDto);
  });

  it('should map DTO to document', () => {
    const doc = EventMapper.toDocument(mockDto);
    expect(doc.id).toBe(mockDto.id);
    expect(doc.occurredAt).toBe(mockDate.toISOString());
  });

  it('should handle missing optional fields in toDocument', () => {
    const minimalDto = { id: '2' };
    const doc = EventMapper.toDocument(minimalDto);
    expect(doc.id).toBe('2');
    expect(doc.companyId).toBe('');
    expect(doc.source).toBe(SourceType.Email);
    expect(doc.direction).toBe(DirectionType.Inbound);
  });
});
