import { act, renderHook } from '@testing-library/react';
import { of } from 'rxjs';

import * as dataAccess from '@job-tracker/data-access';
import { ContactDTO } from '@job-tracker/validation';

import {
  useContactActions,
  useContactRepository,
  useContactsByCompany,
  useContactsWithCompany,
} from './contact-hooks';

// Mock data-access
jest.mock('@job-tracker/data-access', () => ({
  useDb: jest.fn(),
  ContactRepository: jest.fn().mockImplementation(() => ({
    getById$: jest.fn(),
    list$: jest.fn(),
    listByCompanyId$: jest.fn(),
    upsert: jest.fn(),
    deleteById: jest.fn(),
    searchByName: jest.fn(),
  })),
  CompanyRepository: jest.fn().mockImplementation(() => ({
    list$: jest.fn(),
    upsert: jest.fn(),
    getById: jest.fn(),
  })),
}));

describe('contact-hooks', () => {
  const mockDb = {} as any;
  const mockContact: ContactDTO = {
    id: '1',
    firstName: 'Test',
    lastName: 'Contact',
    companyId: 'c1',
    version: 1,
    search: 'test contact',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (dataAccess.useDb as jest.Mock).mockReturnValue(mockDb);
  });

  describe('useContactRepository', () => {
    it('should return repository when db is available', () => {
      const { result } = renderHook(() => useContactRepository());
      expect(result.current).toBeDefined();
    });
  });

  describe('useContactsWithCompany', () => {
    it('should return contacts', () => {
      const mockContactRepo = {
        list$: jest.fn().mockReturnValue(of([mockContact])),
      };
      const mockCompanyRepo = {
        list$: jest.fn().mockReturnValue(of([])),
      };
      (dataAccess.ContactRepository as jest.Mock).mockImplementation(() => mockContactRepo);
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => mockCompanyRepo);

      const { result } = renderHook(() => useContactsWithCompany());
      expect(result.current.contacts).toHaveLength(1);
    });
  });

  describe('useContactsByCompany', () => {
    it('should return contacts by company id', () => {
      const mockContactRepo = {
        listByCompanyId$: jest.fn().mockReturnValue(of([mockContact])),
      };
      (dataAccess.ContactRepository as jest.Mock).mockImplementation(() => mockContactRepo);

      const { result } = renderHook(() => useContactsByCompany('c1'));
      expect(result.current.contacts).toEqual([mockContact]);
    });
  });

  describe('useContactActions', () => {
    it('should upsert contact', async () => {
      const mockContactRepo = {
        upsert: jest.fn().mockResolvedValue({ id: '1' }),
      };
      const mockCompanyRepo = {
        upsert: jest.fn().mockResolvedValue({ id: 'c1' }),
      };
      (dataAccess.ContactRepository as jest.Mock).mockImplementation(() => mockContactRepo);
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => mockCompanyRepo);

      const { result } = renderHook(() => useContactActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertContact({
          firstName: 'New',
          lastName: 'Contact',
          companyId: 'c1',
        });
      });

      expect(mockContactRepo.upsert).toHaveBeenCalled();
      expect(actionResult.success).toBe(true);
    });
  });
});
