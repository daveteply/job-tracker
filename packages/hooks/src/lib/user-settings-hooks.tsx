'use client';

import { useMemo } from 'react';

import { useDb, UserSettingsRepository } from '@job-tracker/data-access';
import { UserSettingsDTO } from '@job-tracker/validation';

import { useObservable } from './use-observable';

export function useUserSettingsRepository() {
  const db = useDb();

  return useMemo(() => {
    if (!db) return null;
    return new UserSettingsRepository(db);
  }, [db]);
}

export function useUserSettings() {
  const repository = useUserSettingsRepository();

  const settings$ = useMemo(() => {
    return repository?.get$();
  }, [repository]);

  const settings = useObservable<UserSettingsDTO | null>(settings$, null);

  const updateSettings = async (updates: Partial<UserSettingsDTO>) => {
    if (!repository) return;
    return repository.update('current', updates);
  };

  return {
    settings,
    updateSettings,
    isLoading: settings === null && !!repository,
  };
}
