'use client';

import { EventTypeRepository, useDb } from '@job-tracker/data-access';
import { EventTypeDTO } from '@job-tracker/validation';
import { useCallback, useMemo } from 'react';
import { useObservable } from './use-observable';

export function useEventTypeRepository() {
  const db = useDb();

  return useMemo(() => {
    if (!db) return null;
    return new EventTypeRepository(db);
  }, [db]);
}

export function useEventTypes() {
  const repository = useEventTypeRepository();

  const eventTypes$ = useMemo(() => {
    return repository?.list$();
  }, [repository]);

  const eventTypes = useObservable<EventTypeDTO[]>(eventTypes$, []);

  return {
    eventTypes,
    loading: !repository,
  };
}

export function useEventTypeSearch() {
  const repository = useEventTypeRepository();

  const searchEventTypes = useCallback(
    async (query: string): Promise<EventTypeDTO[]> => {
      if (!repository) {
        return [];
      }

      return repository.searchByName(query);
    },
    [repository],
  );

  return {
    searchEventTypes,
    loading: !repository,
  };
}

export function useEventTypeActions() {
  const repository = useEventTypeRepository();

  return {
    upsertEventType: async (eventType: Partial<EventTypeDTO>) => {
      if (!repository) {
        return { success: false, message: 'Database not initialized' };
      }

      try {
        const id = eventType.id || crypto.randomUUID();
        const name = eventType.name;

        if (!name) {
          return { success: false, message: 'Event Type name is required' };
        }

        await repository.upsert({
          ...eventType,
          id,
          name,
        });

        return { success: true, message: 'Event Type saved successfully' };
      } catch (error) {
        console.error('Failed to upsert Event Type:', error);
        return { success: false, message: 'Failed to save Event Type' };
      }
    },
    removeEventType: async (id: string) => {
      if (!repository) {
        return { success: false, message: 'Database not initialized' };
      }

      try {
        await repository.remove(id);
        return { success: true, message: 'Event Type removed successfully' };
      } catch (error) {
        console.error('Failed to remove Event Type:', error);
        return { success: false, message: 'Failed to remove Event Type' };
      }
    },
  };
}
