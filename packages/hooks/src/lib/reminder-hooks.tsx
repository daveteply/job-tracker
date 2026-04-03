'use client';

import { ReminderRepository, useDb } from '@job-tracker/data-access';
import { ReminderDTO } from '@job-tracker/validation';
import { useMemo } from 'react';
import { useObservable } from './use-observable';

export function useReminderRepository() {
  const db = useDb();

  return useMemo(() => {
    if (!db) return null;
    return new ReminderRepository(db);
  }, [db]);
}

export function useReminders() {
  const repository = useReminderRepository();

  const reminders$ = useMemo(() => {
    return repository?.list$();
  }, [repository]);

  const reminders = useObservable<ReminderDTO[]>(reminders$, []);

  return {
    reminders,
    loading: !repository,
  };
}

export function useReminderActions() {
  const repository = useReminderRepository();

  return {
    upsertReminder: async (reminder: Partial<ReminderDTO> & { id: string }) => {
      if (!repository) {
        return { success: false, message: 'Database not initialized' };
      }

      try {
        await repository.upsert(reminder);
        return { success: true, message: 'Reminder saved successfully' };
      } catch (error) {
        console.error('Failed to upsert Reminder:', error);
        return { success: false, message: 'Failed to save Reminder' };
      }
    },
    removeReminder: async (id: string) => {
      if (!repository) {
        return { success: false, message: 'Database not initialized' };
      }

      try {
        await repository.deleteById(id);
        return { success: true, message: 'Reminder removed successfully' };
      } catch (error) {
        console.error('Failed to remove Reminder:', error);
        return { success: false, message: 'Failed to remove Reminder' };
      }
    },
  };
}
