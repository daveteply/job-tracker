'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CompanyRepository, DeletionCheck, useDb } from '@job-tracker/data-access';
import { CompanyDTO } from '@job-tracker/validation';
import { useObservable } from './use-observable';

export function useCompanyRepository() {
  const db = useDb();

  return useMemo(() => {
    if (!db) return null;
    return new CompanyRepository(db);
  }, [db]);
}

export function useCompany(id: string) {
  const repository = useCompanyRepository();
  const [data, setData] = useState<CompanyDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (repository && id) {
      setLoading(true);
      repository.getById(id).then((res) => {
        setData(res);
        setLoading(false);
      });
    }
  }, [repository, id]);

  return { company: data, loading };
}

export function useCompanies() {
  const repository = useCompanyRepository();

  const companies$ = useMemo(() => {
    return repository?.getAll$();
  }, [repository]);

  const companies = useObservable<CompanyDTO[]>(companies$, []);

  return {
    companies,
    loading: !repository,
  };
}

// Hook to check if a Company can be deleted (checks for related records)
export function useCanDeleteCompany(companyId: string): DeletionCheck {
  const repository = useCompanyRepository();
  const [canDelete, setCanDelete] = useState(false);
  const [blockers, setBlockers] = useState({
    events: 0,
    contacts: 0,
    roles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId || !repository) return;

    const unsubscribe = repository.subscribeToDeletionCheck(
      companyId,
      (newBlockers, canDeleteValue) => {
        setBlockers(newBlockers);
        setCanDelete(canDeleteValue);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [companyId, repository]);

  return { canDelete, blockers, loading };
}

export function useCompanySearch() {
  const repository = useCompanyRepository();

  const searchCompanies = useCallback(
    async (query: string): Promise<CompanyDTO[]> => {
      if (!repository) {
        return [];
      }

      return repository.searchByName(query);
    },
    [repository],
  );

  return {
    searchCompanies,
    loading: !repository,
  };
}

export function useCompanyActions() {
  const repository = useCompanyRepository();

  return {
    upsertCompany: async (company: Partial<CompanyDTO>) => {
      if (!repository) {
        return { success: false, message: 'Database not initialized' };
      }

      try {
        const id = company.id || crypto.randomUUID();
        const name = company.name;

        if (!name) {
          return { success: false, message: 'Company name is required' };
        }

        await repository.upsert({
          ...company,
          id,
          name,
        });

        return { success: true, message: 'Company saved successfully' };
      } catch (error) {
        console.error('Failed to upsert company:', error);
        return { success: false, message: 'Failed to save company' };
      }
    },
    removeCompany: async (id: string) => {
      if (!repository) {
        return { success: false, message: 'Database not initialized' };
      }

      try {
        await repository.remove(id);
        return { success: true, message: 'Company removed successfully' };
      } catch (error) {
        console.error('Failed to remove company:', error);
        return { success: false, message: 'Failed to remove company' };
      }
    },
  };
}
