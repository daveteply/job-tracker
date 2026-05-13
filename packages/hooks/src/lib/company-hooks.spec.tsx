import { act, renderHook } from '@testing-library/react';
import { of } from 'rxjs';

import * as dataAccess from '@job-tracker/data-access';
import { RoleStatus } from '@job-tracker/domain';
import { CompanyDTO, CompanyWithChildrenDTO } from '@job-tracker/validation';

import {
  useCompanies,
  useCompaniesWithChildren,
  useCompany,
  useCompanyActions,
  useCompanyRepository,
  useCompanySearch,
  useGroupedCompanies,
} from './company-hooks';

// Mock data-access
jest.mock('@job-tracker/data-access', () => ({
  useDb: jest.fn(),
  CompanyRepository: jest.fn().mockImplementation(() => ({
    getById$: jest.fn(),
    list$: jest.fn(),
    searchByName: jest.fn(),
    upsert: jest.fn(),
    deleteById: jest.fn(),
    subscribeToDeletionCheck: jest.fn(),
  })),
  ContactRepository: jest.fn(),
  RoleRepository: jest.fn(),
}));

// Mock other hooks
jest.mock('./contact-hooks', () => ({
  useContactRepository: jest.fn(),
}));
jest.mock('./role-hooks', () => ({
  useRoleRepository: jest.fn(),
}));

describe('company-hooks', () => {
  const mockDb = {} as any;
  const mockCompany: CompanyDTO = {
    id: '1',
    name: 'Test Company',
    search: 'test company',
    version: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (dataAccess.useDb as jest.Mock).mockReturnValue(mockDb);
  });

  describe('useCompanyRepository', () => {
    it('should return repository when db is available', () => {
      const { result } = renderHook(() => useCompanyRepository());
      expect(result.current).toBeDefined();
    });

    it('should return null when db is not available', () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useCompanyRepository());
      expect(result.current).toBeNull();
    });
  });

  describe('useCompany', () => {
    it('should return company and loading state', () => {
      const mockRepo = {
        getById$: jest.fn().mockReturnValue(of(mockCompany)),
      };
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useCompany('1'));
      expect(result.current.company).toEqual(mockCompany);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('useCompanies', () => {
    it('should return list of companies', () => {
      const mockRepo = {
        list$: jest.fn().mockReturnValue(of([mockCompany])),
      };
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useCompanies());
      expect(result.current.companies).toEqual([mockCompany]);
    });
  });

  describe('useCompaniesWithChildren', () => {
    it('should return companies with roles and contacts', () => {
      const mockCompanyRepo = { list$: jest.fn().mockReturnValue(of([mockCompany])) };
      const mockRoleRepo = { list$: jest.fn().mockReturnValue(of([])) };
      const mockContactRepo = { list$: jest.fn().mockReturnValue(of([])) };

      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => mockCompanyRepo);
      (require('./role-hooks').useRoleRepository as jest.Mock).mockReturnValue(mockRoleRepo);
      (require('./contact-hooks').useContactRepository as jest.Mock).mockReturnValue(
        mockContactRepo,
      );

      const { result } = renderHook(() => useCompaniesWithChildren());
      expect(result.current.companies).toHaveLength(1);
    });
  });

  describe('useGroupedCompanies', () => {
    it('should group companies into active and inactive based on roles', () => {
      const companies: Partial<CompanyWithChildrenDTO>[] = [
        {
          id: '1',
          name: 'Active Company',
          roles: [
            { id: 'r1', status: RoleStatus.Applied, companyId: '1' } as any,
            { id: 'r2', status: RoleStatus.NotSelected, companyId: '1' } as any,
          ],
        },
        {
          id: '2',
          name: 'Inactive Company',
          roles: [
            { id: 'r3', status: RoleStatus.NotSelected, companyId: '2' } as any,
            { id: 'r4', status: RoleStatus.Withdrawn, companyId: '2' } as any,
          ],
        },
        {
          id: '3',
          name: 'Company with no roles',
          roles: [],
        },
        {
          id: '4',
          name: 'Company with only active roles',
          roles: [{ id: 'r5', status: RoleStatus.Offer, companyId: '4' } as any],
        },
      ];

      const { result } = renderHook(() =>
        useGroupedCompanies(companies as CompanyWithChildrenDTO[]),
      );

      expect(result.current.active).toHaveLength(3);
      expect(result.current.active.map((c) => c.id)).toContain('1');
      expect(result.current.active.map((c) => c.id)).toContain('3');
      expect(result.current.active.map((c) => c.id)).toContain('4');

      expect(result.current.inactive).toHaveLength(1);
      expect(result.current.inactive[0].id).toBe('2');
    });

    it('should handle empty company list', () => {
      const { result } = renderHook(() => useGroupedCompanies([]));
      expect(result.current.active).toHaveLength(0);
      expect(result.current.inactive).toHaveLength(0);
    });
  });

  describe('useCompanySearch', () => {
    it('should call repository searchByName', async () => {
      const mockRepo = {
        searchByName: jest.fn().mockResolvedValue([mockCompany]),
      };
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useCompanySearch());
      let searchResult: CompanyDTO[] = [];
      await act(async () => {
        searchResult = await result.current.searchCompanies('test');
      });

      expect(mockRepo.searchByName).toHaveBeenCalledWith('test');
      expect(searchResult).toEqual([mockCompany]);
    });
  });

  describe('useCompanyActions', () => {
    it('should return error if database not initialized', async () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useCompanyActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertCompany({ name: 'New' });
      });
      expect(actionResult.success).toBe(false);
      expect(actionResult.message).toBe('Database not initialized');
    });

    it('should upsert company', async () => {
      const mockRepo = {
        upsert: jest.fn().mockResolvedValue({ id: '1' }),
      };
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useCompanyActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertCompany({ name: 'New Company' });
      });

      expect(mockRepo.upsert).toHaveBeenCalled();
      expect(actionResult.success).toBe(true);
    });

    it('should handle error during upsert', async () => {
      const mockRepo = {
        upsert: jest.fn().mockRejectedValue(new Error('Fail')),
      };
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useCompanyActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertCompany({ name: 'New' });
      });
      expect(actionResult.success).toBe(false);
      expect(actionResult.message).toBe('Failed to save company');
    });

    it('should remove company', async () => {
      const mockRepo = {
        deleteById: jest.fn().mockResolvedValue(true),
      };
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useCompanyActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.removeCompany('1');
      });

      expect(mockRepo.deleteById).toHaveBeenCalledWith('1');
      expect(actionResult.success).toBe(true);
    });

    it('should handle error during remove', async () => {
      const mockRepo = {
        deleteById: jest.fn().mockRejectedValue(new Error('Fail')),
      };
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useCompanyActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.removeCompany('1');
      });
      expect(actionResult.success).toBe(false);
      expect(actionResult.message).toBe('Failed to remove company');
    });
  });
});
