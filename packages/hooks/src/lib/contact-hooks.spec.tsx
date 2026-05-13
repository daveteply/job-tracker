import { act, renderHook } from '@testing-library/react';
import { of } from 'rxjs';

import { EMPTY_DELETION_BLOCKERS } from '@job-tracker/app-logic';
import * as dataAccess from '@job-tracker/data-access';
import { ContactDTO } from '@job-tracker/validation';

import {
  useCanDeleteContact,
  useContactActions,
  useContactRepository,
  useContactsByCompany,
  useContactSearch,
  useContactsWithCompany,
  useContactWithCompany,
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
    subscribeToDeletionCheck: jest.fn(),
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

    it('should return null when db is not available', () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useContactRepository());
      expect(result.current).toBeNull();
    });
  });

  describe('useContactWithCompany', () => {
    it('should return contact with company', () => {
      const mockCompany = { id: 'c1', name: 'Test Company' };
      (dataAccess.ContactRepository as jest.Mock).mockImplementation(() => ({
        getById$: jest.fn().mockReturnValue(of(mockContact)),
      }));
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => ({
        list$: jest.fn().mockReturnValue(of([mockCompany])),
      }));

      const { result } = renderHook(() => useContactWithCompany('1'));
      expect(result.current.contact?.id).toBe('1');
      expect(result.current.contact?.company).toEqual(mockCompany);
      expect(result.current.loading).toBe(false);
    });

    it('should return null if contact not found', () => {
      (dataAccess.ContactRepository as jest.Mock).mockImplementation(() => ({
        getById$: jest.fn().mockReturnValue(of(null)),
      }));
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => ({
        list$: jest.fn().mockReturnValue(of([])),
      }));

      const { result } = renderHook(() => useContactWithCompany('1'));
      expect(result.current.contact).toBeNull();
    });

    it('should be loading when db is not available', () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useContactWithCompany('1'));
      expect(result.current.loading).toBe(true);
    });
  });

  describe('useContactsWithCompany', () => {
    it('should return contacts', () => {
      const mockCompany = { id: 'c1', name: 'Test Company' };
      const mockContactRepo = {
        list$: jest.fn().mockReturnValue(of([mockContact])),
      };
      const mockCompanyRepo = {
        list$: jest.fn().mockReturnValue(of([mockCompany])),
      };
      (dataAccess.ContactRepository as jest.Mock).mockImplementation(() => mockContactRepo);
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => mockCompanyRepo);

      const { result } = renderHook(() => useContactsWithCompany());
      expect(result.current.contacts).toHaveLength(1);
      expect(result.current.contacts[0].company).toEqual(mockCompany);
    });

    it('should be loading when db is not available', () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useContactsWithCompany());
      expect(result.current.loading).toBe(true);
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
      expect(result.current.loading).toBe(false);
    });

    it('should be loading when repository is not available', () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useContactsByCompany('c1'));
      expect(result.current.loading).toBe(true);
    });
  });

  describe('useCanDeleteContact', () => {
    it('should return deletion check status', () => {
      const mockRepo = {
        subscribeToDeletionCheck: jest.fn().mockImplementation((id, callback) => {
          callback(EMPTY_DELETION_BLOCKERS, true);
          return () => {
            /* no-op */
          };
        }),
      };
      (dataAccess.ContactRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useCanDeleteContact('1'));
      expect(result.current.canDelete).toBe(true);
      expect(result.current.loading).toBe(false);
    });

    it('should handle missing id or repository', () => {
      const { result } = renderHook(() => useCanDeleteContact(''));
      expect(result.current.loading).toBe(true);
    });
  });

  describe('useContactSearch', () => {
    it('should search contacts', async () => {
      const mockCompany = { id: 'c1', name: 'Test Company' };
      const mockContactRepo = {
        searchByName: jest.fn().mockResolvedValue([mockContact]),
      };
      const mockCompanyRepo = {
        getById: jest.fn().mockResolvedValue(mockCompany),
      };
      (dataAccess.ContactRepository as jest.Mock).mockImplementation(() => mockContactRepo);
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => mockCompanyRepo);

      const { result } = renderHook(() => useContactSearch());
      let searchResult: any;
      await act(async () => {
        searchResult = await result.current.searchContacts('test');
      });

      expect(mockContactRepo.searchByName).toHaveBeenCalledWith('test');
      expect(searchResult[0].company).toEqual(mockCompany);
    });

    it('should return empty array when repository is not available', async () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useContactSearch());
      let searchResult: any;
      await act(async () => {
        searchResult = await result.current.searchContacts('test');
      });
      expect(searchResult).toEqual([]);
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

    it('should handle upsert error', async () => {
      const mockContactRepo = {
        upsert: jest.fn().mockRejectedValue(new Error('error')),
      };
      (dataAccess.ContactRepository as jest.Mock).mockImplementation(() => mockContactRepo);

      const { result } = renderHook(() => useContactActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertContact({
          firstName: 'New',
          lastName: 'Contact',
        });
      });

      expect(actionResult.success).toBe(false);
    });

    it('should return error when names are missing', async () => {
      const { result } = renderHook(() => useContactActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertContact({ firstName: '', lastName: '' });
      });
      expect(actionResult.success).toBe(false);
      expect(actionResult.message).toBe('Contact first and last names are required');
    });

    it('should return error when repository is not available for upsert', async () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useContactActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertContact(mockContact);
      });
      expect(actionResult.success).toBe(false);
    });

    it('should remove contact', async () => {
      const mockRepo = {
        deleteById: jest.fn().mockResolvedValue(undefined),
      };
      (dataAccess.ContactRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useContactActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.removeContact('1');
      });

      expect(mockRepo.deleteById).toHaveBeenCalledWith('1');
      expect(actionResult.success).toBe(true);
    });

    it('should handle remove error', async () => {
      const mockRepo = {
        deleteById: jest.fn().mockRejectedValue(new Error('error')),
      };
      (dataAccess.ContactRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useContactActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.removeContact('1');
      });

      expect(actionResult.success).toBe(false);
    });
  });
});
