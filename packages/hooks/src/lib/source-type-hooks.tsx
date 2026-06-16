'use client';

import { useMemo } from 'react';

import { SourceTypeRepository, useDb } from '@job-tracker/data-access';
import { SourceTypeDTO } from '@job-tracker/validation';

import { useObservable } from './use-observable';

export function useSourceTypeRepository() {
  const db = useDb();

  return useMemo(() => {
    if (!db) return null;
    return new SourceTypeRepository(db);
  }, [db]);
}

export function useSourceTypes() {
  const repository = useSourceTypeRepository();

  const sourceTypes$ = useMemo(() => {
    return repository?.list$();
  }, [repository]);

  const [sourceTypes, loading] = useObservable<SourceTypeDTO[]>(sourceTypes$, []);
  return { sourceTypes, loading: !repository || loading };
}
