'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { combineLatest, map } from 'rxjs';

import { type EntitySelection,resolveCompanyId } from '@job-tracker/app-logic';
import { EMPTY_DELETION_BLOCKERS } from '@job-tracker/app-logic';
import { CompanyRepository, DeletionCheck, RoleRepository, useDb } from '@job-tracker/data-access';
import { RoleDTO, RoleWithCompanyDTO } from '@job-tracker/validation';

import { useObservable } from './use-observable';

export function useRoleRepository() {
  const db = useDb();

  return useMemo(() => {
    if (!db) return null;
    return new RoleRepository(db);
  }, [db]);
}

export function useRoleWithCompany(id: string) {
  const db = useDb();
  const roleRepository = useRoleRepository();
  const companyRepository = useMemo(() => {
    if (!db) return null;
    return new CompanyRepository(db);
  }, [db]);
  const [data, setData] = useState<RoleWithCompanyDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roleRepository && companyRepository && id) {
      setLoading(true);

      roleRepository
        .getById(id)
        .then(async (role) => {
          if (!role) {
            setData(null);
            return;
          }

          const company = role.companyId ? await companyRepository.getById(role.companyId) : null;

          setData({
            ...role,
            company,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [roleRepository, companyRepository, id]);

  return { role: data, loading };
}

export function useRolesWithCompany() {
  const db = useDb();
  const roleRepository = useRoleRepository();
  const companyRepository = useMemo(() => {
    if (!db) return null;
    return new CompanyRepository(db);
  }, [db]);

  const rolesWithCompany$ = useMemo(() => {
    if (!roleRepository || !companyRepository) {
      return undefined;
    }

    return combineLatest([roleRepository.list$(), companyRepository.list$()]).pipe(
      map(([roles, companies]) => {
        const companiesById = new Map(companies.map((company) => [company.id, company]));

        return roles.map<RoleWithCompanyDTO>((role) => ({
          ...role,
          company: role.companyId ? (companiesById.get(role.companyId) ?? null) : null,
        }));
      }),
    );
  }, [roleRepository, companyRepository]);

  const roles = useObservable<RoleWithCompanyDTO[]>(rolesWithCompany$, []);

  return {
    roles,
    loading: !roleRepository || !companyRepository,
  };
}

// Hook to check if a Role can be deleted (checks for related records)
export function useCanDeleteRole(roleId: string): DeletionCheck {
  const repository = useRoleRepository();
  const [canDelete, setCanDelete] = useState(false);
  const [blockers, setBlockers] = useState(EMPTY_DELETION_BLOCKERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleId || !repository) return;

    const unsubscribe = repository.subscribeToDeletionCheck(
      roleId,
      (newBlockers, canDeleteValue) => {
        setBlockers(newBlockers);
        setCanDelete(canDeleteValue);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [roleId, repository]);

  return { canDelete, blockers, loading };
}

export function useRoleSearch() {
  const repository = useRoleRepository();

  const searchRoles = useCallback(
    async (query: string): Promise<RoleDTO[]> => {
      if (!repository) {
        return [];
      }

      return repository.searchByName(query);
    },
    [repository],
  );

  return {
    searchRoles,
    loading: !repository,
  };
}

export function useRoleActions() {
  const db = useDb();
  const repository = useRoleRepository();
  const companyRepository = useMemo(() => {
    if (!db) return null;
    return new CompanyRepository(db);
  }, [db]);

  type RoleUpsertInput = Partial<RoleDTO> & {
    company?: EntitySelection | null;
  };

  return {
    upsertRole: async (role: RoleUpsertInput) => {
      if (!repository) {
        return { success: false, message: 'Database not initialized' };
      }

      try {
        const { company, ...roleData } = role;

        const id = roleData.id || crypto.randomUUID();
        const title = (roleData.title || company?.displayValue || '').trim();

        if (!title) {
          return { success: false, message: 'Role title is required' };
        }

        const resolvedCompanyId = await resolveCompanyId({
          selection: company,
          currentCompanyId: roleData.companyId,
          upsertCompany: companyRepository ? (input) => companyRepository.upsert(input) : undefined,
        });

        await repository.upsert({
          ...roleData,
          companyId: resolvedCompanyId,
          id,
          title,
        });

        return { success: true, message: 'Role saved successfully', id };
      } catch (error) {
        console.error('Failed to upsert Role:', error);
        return { success: false, message: 'Failed to save Role' };
      }
    },
    removeRole: async (id: string) => {
      if (!repository) {
        return { success: false, message: 'Database not initialized' };
      }

      try {
        await repository.deleteById(id);
        return { success: true, message: 'Role removed successfully' };
      } catch (error) {
        console.error('Failed to remove Role:', error);
        return { success: false, message: 'Failed to remove Role' };
      }
    },
  };
}
