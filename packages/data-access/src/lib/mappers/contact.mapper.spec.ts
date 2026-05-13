import { ContactDTO } from '@job-tracker/validation';

import { ContactDocument } from '../database/documents/contact.document';

import { ContactMapper } from './contact.mapper';

describe('ContactMapper', () => {
  const mockDoc: ContactDocument = {
    id: '1',
    serverId: 123,
    version: 1,
    updatedAt: '2023-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    companyId: 'c1',
    firstName: 'John',
    lastName: 'Doe',
    search: 'john doe',
    title: 'Recruiter',
    email: 'john@doe.com',
    phoneNumber: '123456789',
    linkedInUrl: 'https://linkedin.com/in/johndoe',
    isPrimaryRecruiter: true,
    notes: 'Important contact',
  };

  const mockDto: ContactDTO = {
    id: '1',
    serverId: 123,
    version: 1,
    updatedAt: '2023-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    companyId: 'c1',
    firstName: 'John',
    lastName: 'Doe',
    search: 'john doe',
    title: 'Recruiter',
    email: 'john@doe.com',
    phoneNumber: '123456789',
    linkedInUrl: 'https://linkedin.com/in/johndoe',
    isPrimaryRecruiter: true,
    notes: 'Important contact',
  };

  it('should map document to entity', () => {
    const entity = ContactMapper.toEntity(mockDoc);
    expect(entity.id).toBe(mockDoc.id);
    expect(entity.firstName).toBe(mockDoc.firstName);
    expect(entity.companyId).toBe(mockDoc.companyId);
  });

  it('should map document to DTO', () => {
    const dto = ContactMapper.toDto(mockDoc);
    expect(dto).toEqual(mockDto);
  });

  it('should map DTO to document', () => {
    const doc = ContactMapper.toDocument(mockDto);
    expect(doc.id).toBe(mockDto.id);
    expect(doc.firstName).toBe(mockDto.firstName);
    expect(doc.search).toBe(`${mockDto.firstName} ${mockDto.lastName}`.toLowerCase());
  });

  it('should handle missing optional fields in toDocument', () => {
    const minimalDto = { id: '2', firstName: 'Jane', lastName: 'Smith' };
    const doc = ContactMapper.toDocument(minimalDto);
    expect(doc.id).toBe('2');
    expect(doc.companyId).toBe('');
    expect(doc.isPrimaryRecruiter).toBe(false);
  });
});
