import { act, renderHook } from '@testing-library/react';
import { of } from 'rxjs';

import * as dataAccess from '@job-tracker/data-access';
import { RoleStatus } from '@job-tracker/domain';
import { RoleDTO, RoleWithEventsDTO } from '@job-tracker/validation';

import {
  useGroupedRoles,
  useRoleActions,
  useRoleRepository,
  useRolesByCompany,
  useRoleSearch,
  useRoleStatusGroups,
  useRolesWithCompany,
  useRoleWithCompany,
} from './role-hooks';

// Mock data-access
jest.mock('@job-tracker/data-access', () => ({
  useDb: jest.fn(),
  RoleRepository: jest.fn().mockImplementation(() => ({
    getById$: jest.fn(),
    list$: jest.fn(),
    searchByName: jest.fn(),
    upsert: jest.fn(),
    deleteById: jest.fn(),
    subscribeToDeletionCheck: jest.fn(),
  })),
  CompanyRepository: jest.fn().mockImplementation(() => ({
    getById: jest.fn(),
    upsert: jest.fn(),
  })),
}));

// Mock other hooks
jest.mock('./event-hooks', () => ({
  useEventRepository: jest.fn(),
}));

describe('role-hooks', () => {
  const mockDb = {} as any;
  const mockRole: RoleDTO = {
    id: '1',
    title: 'Test Role',
    status: RoleStatus.Applied,
    companyId: 'c1',
    version: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (dataAccess.useDb as jest.Mock).mockReturnValue(mockDb);
  });

  describe('useRoleStatusGroups', () => {
    it('should return status groups', () => {
      const { result } = renderHook(() => useRoleStatusGroups());
      expect(result.current.active).toBeDefined();
      expect(result.current.inactive).toBeDefined();
      expect(result.current.pipeline).toBeDefined();
    });
  });

  describe('useGroupedRoles', () => {
    it('should group roles into active, inactive, and pipeline', () => {
      const roles: Partial<RoleWithEventsDTO>[] = [
        { id: '1', status: RoleStatus.Lead }, // Active, Pipeline
        { id: '2', status: RoleStatus.Interviewing }, // Active, Pipeline
        { id: '3', status: RoleStatus.Accepted }, // Active, Not Pipeline
        { id: '4', status: RoleStatus.NotSelected }, // Inactive, Not Pipeline
        { id: '5', status: RoleStatus.Ghosted }, // Inactive, Not Pipeline
      ];

      const { result } = renderHook(() => useGroupedRoles(roles as RoleWithEventsDTO[]));

      expect(result.current.active).toHaveLength(3);
      expect(result.current.active.map((r) => r.id)).toEqual(['1', '2', '3']);

      expect(result.current.inactive).toHaveLength(2);
      expect(result.current.inactive.map((r) => r.id)).toEqual(['4', '5']);

      expect(result.current.pipeline).toHaveLength(2);
      expect(result.current.pipeline.map((r) => r.id)).toEqual(['1', '2']);
    });
  });

  describe('useRoleRepository', () => {
    it('should return repository when db is available', () => {
      const { result } = renderHook(() => useRoleRepository());
      expect(result.current).toBeDefined();
    });
  });

  describe('useRoleSearch', () => {
    it('should call repository searchByName', async () => {
      const mockRoleRepo = new dataAccess.RoleRepository(mockDb);
      const mockCompanyRepo = new dataAccess.CompanyRepository(mockDb);
      (mockRoleRepo.searchByName as jest.Mock).mockResolvedValue([mockRole]);
      (dataAccess.RoleRepository as jest.Mock).mockReturnValue(mockRoleRepo);
      (dataAccess.CompanyRepository as jest.Mock).mockReturnValue(mockCompanyRepo);

      const { result } = renderHook(() => useRoleSearch());
      let searchResult: any[] = [];
      await act(async () => {
        searchResult = await result.current.searchRoles('test');
      });

      expect(mockRoleRepo.searchByName).toHaveBeenCalled();
      expect(searchResult[0].id).toBe('1');
    });
  });

  describe('useRoleWithCompany', () => {
    it('should return role with company and events', () => {
      const mockRoleRepo = { getById$: jest.fn().mockReturnValue(of(mockRole)) };
      const mockCompanyRepo = { list$: jest.fn().mockReturnValue(of([])) };
      const mockEventRepo = { listByRoleId$: jest.fn().mockReturnValue(of([])) };
      (dataAccess.RoleRepository as jest.Mock).mockImplementation(() => mockRoleRepo);
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => mockCompanyRepo);
      (require('./event-hooks').useEventRepository as jest.Mock).mockReturnValue(mockEventRepo);

      const { result } = renderHook(() => useRoleWithCompany('1'));
      expect(result.current.role?.id).toBe('1');
    });
  });

  describe('useRolesByCompany', () => {
    it('should return roles for a company', () => {
      const mockRoleRepo = { listByCompanyId$: jest.fn().mockReturnValue(of([mockRole])) };
      (dataAccess.RoleRepository as jest.Mock).mockImplementation(() => mockRoleRepo);

      const { result } = renderHook(() => useRolesByCompany('c1'));
      expect(result.current.roles).toHaveLength(1);
    });
  });

  describe('useRolesWithCompany', () => {
    it('should return roles with their companies', () => {
      const mockRoleRepo = { list$: jest.fn().mockReturnValue(of([mockRole])) };
      const mockCompanyRepo = {
        list$: jest.fn().mockReturnValue(of([{ id: 'c1', name: 'Company' }])),
      };
      (dataAccess.RoleRepository as jest.Mock).mockImplementation(() => mockRoleRepo);
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => mockCompanyRepo);

      const { result } = renderHook(() => useRolesWithCompany());
      expect(result.current.roles[0].company?.id).toBe('c1');
    });
  });

  describe('useRoleActions', () => {
    it('should upsert role', async () => {
      const mockRoleRepo = {
        upsert: jest.fn().mockResolvedValue({ id: '1' }),
      };
      const mockCompanyRepo = {
        upsert: jest.fn().mockResolvedValue({ id: 'c1' }),
      };
      (dataAccess.RoleRepository as jest.Mock).mockImplementation(() => mockRoleRepo);
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => mockCompanyRepo);

      const { result } = renderHook(() => useRoleActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertRole({
          title: 'New Role',
          company: { displayValue: 'Test Company' },
        });
      });

      expect(mockRoleRepo.upsert).toHaveBeenCalled();
      expect(actionResult.success).toBe(true);
    });
  });
});
