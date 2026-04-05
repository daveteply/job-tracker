'use client';

import { EntitySelection, resolveCompanyId, resolveEntityId } from '@job-tracker/app-logic';
import {
  CompanyRepository,
  ContactRepository,
  EventRepository,
  EventTypeRepository,
  ReminderRepository,
  RoleRepository,
  useDb,
} from '@job-tracker/data-access';
import { RoleStatus } from '@job-tracker/domain';
import { EventDTO, EventWithChildrenDTO } from '@job-tracker/validation';
import { useEffect, useMemo, useState } from 'react';
import { combineLatest, map } from 'rxjs';
import { useObservable } from './use-observable';

export function useEventRepository() {
  const db = useDb();

  return useMemo(() => {
    if (!db) return null;
    return new EventRepository(db);
  }, [db]);
}

export function useEventWithChildren(id: string) {
  const db = useDb();
  const eventRepository = useEventRepository();

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

  const reminderRepository = useMemo(() => {
    if (!db) return null;
    return new ReminderRepository(db);
  }, [db]);

  const [data, setData] = useState<EventWithChildrenDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      eventRepository &&
      eventTypeRepository &&
      companyRepository &&
      contactRepository &&
      roleRepository &&
      reminderRepository &&
      id
    ) {
      setLoading(true);

      eventRepository
        .getById(id)
        .then(async (event) => {
          if (!event) {
            setData(null);
            return;
          }

          const eventType = await eventTypeRepository.getById(event.eventTypeId);
          const company = event.companyId ? await companyRepository.getById(event.companyId) : null;
          const contact = event.contactId ? await contactRepository.getById(event.contactId) : null;
          const role = event.roleId ? await roleRepository.getById(event.roleId) : null;
          const reminder = await reminderRepository.getByEventId(event.id);

          setData({
            ...event,
            eventType,
            company,
            contact,
            role,
            reminder,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [
    eventRepository,
    eventTypeRepository,
    companyRepository,
    contactRepository,
    roleRepository,
    reminderRepository,
    id,
  ]);

  return { event: data, loading };
}

export function useEventsWithChildren() {
  const db = useDb();
  const eventRepository = useEventRepository();

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

  const reminderRepository = useMemo(() => {
    if (!db) return null;
    return new ReminderRepository(db);
  }, [db]);

  const eventsWithChildren$ = useMemo(() => {
    if (
      !eventRepository ||
      !eventTypeRepository ||
      !companyRepository ||
      !contactRepository ||
      !roleRepository ||
      !reminderRepository
    ) {
      return undefined;
    }

    return combineLatest([
      eventRepository.list$(),
      eventTypeRepository.list$(),
      companyRepository.list$(),
      contactRepository?.list$(),
      roleRepository?.list$(),
      reminderRepository?.list$(),
    ]).pipe(
      map(([events, eventTypes, companies, contacts, roles, reminders]) => {
        const eventTypeId = new Map(eventTypes.map((eventType) => [eventType.id, eventType]));
        const companiesById = new Map(companies.map((company) => [company.id, company]));
        const contactsById = new Map(contacts.map((contact) => [contact.id, contact]));
        const rolesById = new Map(roles.map((role) => [role.id, role]));
        const remindersByEventId = new Map(
          reminders.map((reminder) => [reminder.eventId, reminder]),
        );

        return events.map<EventWithChildrenDTO>((event) => ({
          ...event,
          eventType: event.eventTypeId ? (eventTypeId.get(event.eventTypeId) ?? null) : null,
          company: event.companyId ? (companiesById.get(event.companyId) ?? null) : null,
          contact: event.contactId ? (contactsById.get(event.contactId) ?? null) : null,
          role: event.roleId ? (rolesById.get(event.roleId) ?? null) : null,
          reminder: remindersByEventId.get(event.id) ?? null,
        }));
      }),
    );
  }, [
    eventRepository,
    eventTypeRepository,
    companyRepository,
    contactRepository,
    roleRepository,
    reminderRepository,
  ]);

  const events = useObservable<EventWithChildrenDTO[]>(eventsWithChildren$, []);

  return {
    events,
    loading: !eventRepository || !companyRepository,
  };
}

export function useEventActions() {
  const db = useDb();
  const repository = useEventRepository();

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

  const reminderRepository = useMemo(() => {
    if (!db) return null;
    return new ReminderRepository(db);
  }, [db]);

  type EventUpsertInput = Partial<EventDTO> & {
    company?: EntitySelection | null;
    contact?: EntitySelection | null;
    role?: EntitySelection | null;
    hasReminder?: boolean;
    remindAt?: Date | string | null;
  };

  return {
    upsertEvent: async (event: EventUpsertInput) => {
      if (!repository) {
        return { success: false, message: 'Database not initialized' };
      }

      try {
        const { company, contact, role, hasReminder, remindAt, ...eventData } = event;

        const resolvedCompanyId = await resolveCompanyId({
          selection: company,
          currentCompanyId: eventData.companyId,
          upsertCompany: companyRepository ? (input) => companyRepository.upsert(input) : undefined,
        });

        const resolvedContactId = await resolveEntityId({
          selection: contact,
          currentId: eventData.contactId,
          upsertEntity: contactRepository
            ? (input) => contactRepository.upsert(input as any)
            : undefined,
          nameField: 'lastName',
          additionalFields: { companyId: resolvedCompanyId || '' },
        });

        // Determine if we should set a default status for a new role or update an existing one
        let targetRoleStatus: RoleStatus | undefined;
        if (eventData.eventTypeId && eventTypeRepository) {
          const eventType = await eventTypeRepository.getById(eventData.eventTypeId);
          if (eventType?.targetStatus) {
            targetRoleStatus = eventType.targetStatus;
          }
        }

        const resolvedRoleId = await resolveEntityId({
          selection: role,
          currentId: eventData.roleId,
          upsertEntity: roleRepository
            ? (input) =>
                roleRepository.upsert({
                  ...(input as any),
                  // If it's a new role, use the target status from the event type
                  status: (input as any).status ?? targetRoleStatus ?? RoleStatus.Lead,
                })
            : undefined,
          nameField: 'title',
          additionalFields: { companyId: resolvedCompanyId || '' },
        });

        // If we have a resolved role and a target status, ensure the role's status is updated
        if (resolvedRoleId && targetRoleStatus && roleRepository) {
          const existingRole = await roleRepository.getById(resolvedRoleId);
          if (existingRole && existingRole.status !== targetRoleStatus) {
            await roleRepository.update(resolvedRoleId, { status: targetRoleStatus });
          }
        }

        const id = eventData.id || crypto.randomUUID();

        if (!eventData.eventTypeId) {
          return { success: false, message: 'Event type is required' };
        }

        await repository.upsert({
          ...eventData,
          id,
          companyId: resolvedCompanyId || '',
          contactId: resolvedContactId || '',
          roleId: resolvedRoleId || '',
          eventTypeId: eventData.eventTypeId,
        });

        // Handle Reminder
        if (reminderRepository) {
          const existingReminder = await reminderRepository.getByEventId(id);

          if (hasReminder && remindAt) {
            const reminderId = existingReminder?.id || crypto.randomUUID();
            await reminderRepository.upsert({
              id: reminderId,
              eventId: id,
              remindAt: remindAt instanceof Date ? remindAt : new Date(remindAt),
            });
          } else if (existingReminder) {
            // If hasReminder is false but an existing reminder was found, remove it
            await reminderRepository.deleteById(existingReminder.id);
          }
        }

        return { success: true, message: 'Event saved successfully' };
      } catch (error) {
        console.error('Failed to upsert Event:', error);
        return { success: false, message: 'Failed to save Event' };
      }
    },
    removeEvent: async (id: string) => {
      if (!repository) {
        return { success: false, message: 'Database not initialized' };
      }

      try {
        if (reminderRepository) {
          const existingReminder = await reminderRepository.getByEventId(id);
          if (existingReminder) {
            await reminderRepository.deleteById(existingReminder.id);
          }
        }

        await repository.remove(id);
        return { success: true, message: 'Event removed successfully' };
      } catch (error) {
        console.error('Failed to remove Event:', error);
        return { success: false, message: 'Failed to remove Event' };
      }
    },
  };
}
