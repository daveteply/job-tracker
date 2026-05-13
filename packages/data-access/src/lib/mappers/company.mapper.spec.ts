import { CompanyDTO } from '@job-tracker/validation';

import { CompanyDocument } from '../database/documents/company.document';

import { CompanyMapper } from './company.mapper';

describe('CompanyMapper', () => {
  const mockDoc: CompanyDocument = {
    id: '1',
    serverId: 123,
    version: 1,
    updatedAt: '2023-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    name: 'Test Company',
    search: 'test company',
    website: 'https://test.com',
    industry: 'Software',
    sizeRange: '1-10',
    notes: 'Some notes',
  };

  const mockDto: CompanyDTO = {
    id: '1',
    serverId: 123,
    version: 1,
    updatedAt: '2023-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    name: 'Test Company',
    search: 'test company',
    website: 'https://test.com',
    industry: 'Software',
    sizeRange: '1-10',
    notes: 'Some notes',
  };

  it('should map document to entity', () => {
    const entity = CompanyMapper.toEntity(mockDoc);
    expect(entity.id).toBe(mockDoc.id);
    expect(entity.name).toBe(mockDoc.name);
    expect(entity.website).toBe(mockDoc.website);
  });

  it('should map document to DTO', () => {
    const dto = CompanyMapper.toDto(mockDoc);
    expect(dto).toEqual(mockDto);
  });

  it('should map DTO to document', () => {
    const doc = CompanyMapper.toDocument(mockDto);
    expect(doc.id).toBe(mockDto.id);
    expect(doc.name).toBe(mockDto.name);
    expect(doc.search).toBe(mockDto.name.toLowerCase());
  });

  it('should handle missing optional fields in toDocument', () => {
    const minimalDto = { id: '2', name: 'Minimal' };
    const doc = CompanyMapper.toDocument(minimalDto);
    expect(doc.id).toBe('2');
    expect(doc.website).toBeNull();
    expect(doc.serverId).toBeNull();
  });
});
