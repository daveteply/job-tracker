'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { combineLatest, firstValueFrom, map } from 'rxjs';

import { type EntitySelection, resolveCompanyId } from '@job-tracker/app-logic';
import { EMPTY_DELETION_BLOCKERS } from '@job-tracker/app-logic';
import { CompanyRepository, DeletionCheck, RoleRepository, useDb } from '@job-tracker/data-access';
import {
  ACTIVE_STATUSES,
  INACTIVE_STATUSES,
  PIPELINE_STATUSES,
  RoleStatus,
} from '@job-tracker/domain';
import {
  CompanyDTO,
  RoleDTO,
  RoleWithCompanyDTO,
  RoleWithEventsDTO,
} from '@job-tracker/validation';

import { useEventRepository } from './event-hooks';
import { useObservable } from './use-observable';

export { ACTIVE_STATUSES, INACTIVE_STATUSES, PIPELINE_STATUSES, RoleStatus };

export function useRoleStatusGroups() {
  return useMemo(
    () => ({
      active: ACTIVE_STATUSES,
      inactive: INACTIVE_STATUSES,
      pipeline: PIPELINE_STATUSES,
    }),
    [],
  );
}

export function useGroupedRoles(roles: RoleWithEventsDTO[]) {
  const { inactive: inactiveStatuses, pipeline: pipelineStatuses } = useRoleStatusGroups();

  return useMemo(() => {
    const active = roles.filter((role) => !inactiveStatuses.includes(role.status));
    const inactive = roles.filter((role) => inactiveStatuses.includes(role.status));
    const pipeline = roles.filter((role) => pipelineStatuses.includes(role.status));

    return { active, inactive, pipeline };
  }, [roles, inactiveStatuses, pipelineStatuses]);
}

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
  const eventRepository = useEventRepository();
  const [data, setData] = useState<RoleWithEventsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roleRepository && companyRepository && eventRepository && id) {
      setLoading(true);

      roleRepository
        .getById(id)
        .then(async (role) => {
          if (!role) {
            setData(null);
            return;
          }

          const company = role.companyId ? await companyRepository.getById(role.companyId) : null;
          const events = await firstValueFrom(eventRepository.listByRoleId$(id));

          setData({
            ...role,
            company,
            events,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [roleRepository, companyRepository, eventRepository, id]);

  return { role: data, loading };
}

export function useRolesByCompany(companyId: string) {
  const repository = useRoleRepository();

  const roles$ = useMemo(() => {
    return repository?.listByCompanyId$(companyId);
  }, [repository, companyId]);

  const roles = useObservable<RoleDTO[]>(roles$, []);

  return {
    roles,
    loading: !repository,
  };
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

export function useRolesWithEvents() {
  const db = useDb();
  const roleRepository = useRoleRepository();
  const companyRepository = useMemo(() => {
    if (!db) return null;
    return new CompanyRepository(db);
  }, [db]);
  const eventRepository = useEventRepository();

  const rolesWithEvents$ = useMemo(() => {
    if (!roleRepository || !companyRepository || !eventRepository) {
      return undefined;
    }

    return combineLatest([
      roleRepository.list$(),
      companyRepository.list$(),
      eventRepository.list$(),
    ]).pipe(
      map(([roles, companies, events]) => {
        const companiesById = new Map(companies.map((company) => [company.id, company]));

        return roles.map<RoleWithEventsDTO>((role) => ({
          ...role,
          company: role.companyId ? (companiesById.get(role.companyId) ?? null) : null,
          events: events.filter((event) => event.roleId === role.id),
        }));
      }),
    );
  }, [roleRepository, companyRepository, eventRepository]);

  const roles = useObservable<RoleWithEventsDTO[]>(rolesWithEvents$, []);

  return {
    roles,
    loading: !roleRepository || !companyRepository || !eventRepository,
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
  const roleRepository = useRoleRepository();
  const db = useDb();
  const companyRepository = useMemo(() => {
    if (!db) return null;
    return new CompanyRepository(db);
  }, [db]);

  const searchRoles = useCallback(
    async (query: string, companyId?: string | null): Promise<RoleWithCompanyDTO[]> => {
      if (!roleRepository || !companyRepository) {
        return [];
      }

      const roles = await roleRepository.searchByName(query, undefined, companyId);
      const companyIds = [...new Set(roles.map((r) => r.companyId).filter(Boolean))];
      const companies = await Promise.all(
        companyIds.map((id) => companyRepository.getById(id as string)),
      );
      const companiesById = new Map(
        companies.filter((c): c is CompanyDTO => !!c).map((c) => [c.id, c]),
      );

      return roles.map((role) => ({
        ...role,
        company: role.companyId ? (companiesById.get(role.companyId) ?? null) : null,
      }));
    },
    [roleRepository, companyRepository],
  );

  return {
    searchRoles,
    loading: !roleRepository || !companyRepository,
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
