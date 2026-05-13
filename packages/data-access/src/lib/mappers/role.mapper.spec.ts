import { RoleStatus } from '@job-tracker/domain';
import { RoleDTO } from '@job-tracker/validation';

import { RoleDocument } from '../database/documents/role.document';

import { RoleMapper } from './role.mapper';

describe('RoleMapper', () => {
  const mockDoc: RoleDocument = {
    id: '1',
    serverId: 123,
    version: 1,
    updatedAt: '2023-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    companyId: 'c1',
    title: 'Software Engineer',
    search: 'software engineer',
    jobPostingUrl: 'https://jobs.com/1',
    location: 'Remote',
    level: 'Senior',
    salaryRange: '100k-150k',
    notes: 'Exciting role',
    status: RoleStatus.Interviewing,
  };

  const mockDto: RoleDTO = {
    id: '1',
    serverId: 123,
    version: 1,
    updatedAt: '2023-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    companyId: 'c1',
    title: 'Software Engineer',
    search: 'software engineer',
    jobPostingUrl: 'https://jobs.com/1',
    location: 'Remote',
    level: 'Senior',
    salaryRange: '100k-150k',
    notes: 'Exciting role',
    status: RoleStatus.Interviewing,
  };

  it('should map document to entity', () => {
    const entity = RoleMapper.toEntity(mockDoc);
    expect(entity.id).toBe(mockDoc.id);
    expect(entity.title).toBe(mockDoc.title);
    expect(entity.status).toBe(RoleStatus.Interviewing);
  });

  it('should map document to DTO', () => {
    const dto = RoleMapper.toDto(mockDoc);
    expect(dto).toEqual(mockDto);
  });

  it('should map DTO to document', () => {
    const doc = RoleMapper.toDocument(mockDto);
    expect(doc.id).toBe(mockDto.id);
    expect(doc.title).toBe(mockDto.title);
    expect(doc.search).toBe(mockDto.title.toLowerCase());
  });

  it('should handle missing optional fields in toDocument', () => {
    const minimalDto = { id: '2', title: 'Minimal' };
    const doc = RoleMapper.toDocument(minimalDto);
    expect(doc.id).toBe('2');
    expect(doc.companyId).toBe('');
    expect(doc.status).toBe(RoleStatus.Lead);
  });
});
