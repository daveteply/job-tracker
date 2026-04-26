'use client';

import { useEffect, useMemo, useState } from 'react';

import { combineLatest, map } from 'rxjs';

import {
  CompanyRepository,
  ContactRepository,
  EventRepository,
  EventTypeRepository,
  ReminderRepository,
  RoleRepository,
  useDb,
} from '@job-tracker/data-access';
import {
  EventWithChildrenDTO,
  ReminderDTO,
  ReminderWithChildrenDTO,
} from '@job-tracker/validation';

import { useObservable } from './use-observable';

export function useReminderRepository() {
  const db = useDb();

  return useMemo(() => {
    if (!db) return null;
    return new ReminderRepository(db);
  }, [db]);
}

export function useReminder(id: string) {
  const repository = useReminderRepository();
  const [data, setData] = useState<ReminderDTO | null>(null);
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

  return { reminder: data, loading };
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

export function useRemindersWithChildren() {
  const db = useDb();
  const reminderRepository = useReminderRepository();

  const eventRepository = useMemo(() => {
    if (!db) return null;
    return new EventRepository(db);
  }, [db]);

  const eventTypeRepository = useMemo(() => {
    if (!db) return null;
    return new EventTypeRepository(db);
  }, [db]);

  const companyRepository = useMemo(() => {
    if (!db) return null;
    return new CompanyRepository(db);
  }, [db]);

  const contactRepository = useMemo(() => {
    if (!db) return null;
    return new ContactRepository(db);
  }, [db]);

  const roleRepository = useMemo(() => {
    if (!db) return null;
    return new RoleRepository(db);
  }, [db]);

  const remindersWithChildren$ = useMemo(() => {
    if (
      !reminderRepository ||
      !eventRepository ||
      !eventTypeRepository ||
      !companyRepository ||
      !contactRepository ||
      !roleRepository
    ) {
      return undefined;
    }

    return combineLatest([
      reminderRepository.list$(),
      eventRepository.list$(),
      eventTypeRepository.list$(),
      companyRepository.list$(),
      contactRepository?.list$(),
      roleRepository?.list$(),
    ]).pipe(
      map(([reminders, events, eventTypes, companies, contacts, roles]) => {
        const eventTypeId = new Map(eventTypes.map((eventType) => [eventType.id, eventType]));
        const companiesById = new Map(companies.map((company) => [company.id, company]));
        const contactsById = new Map(contacts.map((contact) => [contact.id, contact]));
        const rolesById = new Map(roles.map((role) => [role.id, role]));

        const eventsWithChildrenById = new Map<string, EventWithChildrenDTO>(
          events.map((event) => [
            event.id,
            {
              ...event,
              eventType: event.eventTypeId ? (eventTypeId.get(event.eventTypeId) ?? null) : null,
              company: event.companyId ? (companiesById.get(event.companyId) ?? null) : null,
              contact: event.contactId ? (contactsById.get(event.contactId) ?? null) : null,
              role: event.roleId ? (rolesById.get(event.roleId) ?? null) : null,
            },
          ]),
        );

        return reminders.map<ReminderWithChildrenDTO>((reminder) => ({
          ...reminder,
          event: reminder.eventId ? (eventsWithChildrenById.get(reminder.eventId) ?? null) : null,
        }));
      }),
    );
  }, [
    reminderRepository,
    eventRepository,
    eventTypeRepository,
    companyRepository,
    contactRepository,
    roleRepository,
  ]);

  const reminders = useObservable<ReminderWithChildrenDTO[]>(remindersWithChildren$, []);

  return {
    reminders,
    loading: !reminderRepository,
  };
}

export function useReminderActions() {
  const repository = useReminderRepository();

  return {
    upsertReminder: async (reminder: Partial<ReminderDTO>) => {
      if (!repository) {
        return { success: false, message: 'Database not initialized' };
      }

      try {
        const id = reminder.id || crypto.randomUUID();

        await repository.upsert({
          ...reminder,
          id,
        });

        return { success: true, message: 'Reminder saved successfully', id };
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
    completeReminder: async (id: string) => {
      if (!repository) {
        return { success: false, message: 'Database not initialized' };
      }

      try {
        await repository.update(id, { completedAt: new Date() });
        return { success: true, message: 'Reminder completed' };
      } catch (error) {
        console.error('Failed to complete Reminder:', error);
        return { success: false, message: 'Failed to complete Reminder' };
      }
    },
  };
}
