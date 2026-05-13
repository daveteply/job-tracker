'use client';

import { useMemo } from 'react';

import { useDb, UserSettingsRepository } from '@job-tracker/data-access';
import { UserSettingsDTO } from '@job-tracker/validation';

import { getLocaleCookie, setLocaleCookie } from './locale-cookie';
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
    return repository?.getById$();
  }, [repository]);

  const [settings, observableLoading] = useObservable<UserSettingsDTO | null>(settings$, null);

  // Sync locale to cookie when it changes in RxDB
  useMemo(() => {
    if (settings?.locale) {
      const currentCookie = getLocaleCookie();
      if (currentCookie !== settings.locale) {
        setLocaleCookie(settings.locale);
      }
    }
  }, [settings?.locale]);

  const updateSettings = async (updates: Partial<UserSettingsDTO>) => {
    if (!repository) return;
    return repository.update('current', updates);
  };

  return {
    settings,
    updateSettings,
    isLoading: !!repository && (observableLoading || settings === null),
  };
}
