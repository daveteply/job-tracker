'use client';

import { use } from 'react';

import { useTranslations } from 'next-intl';

import { EntitySelection } from '@job-tracker/app-logic';
import {
  useCompanySearch,
  useContactSearch,
  useEventActions,
  useEventTypes,
  useEventWithChildren,
  useRoleSearch,
} from '@job-tracker/hooks';
import { EventForm, PageLoading } from '@job-tracker/ui-components';
import { EventDTO } from '@job-tracker/validation';

type EventEditFormData = EventDTO & {
  company?: EntitySelection | null;
  contact?: EntitySelection | null;
  role?: EntitySelection | null;
  hasReminder?: boolean;
  remindAt?: string | Date | null;
};

export default function EventUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations('Events');
  const { event, loading } = useEventWithChildren(id);

  const { upsertEvent } = useEventActions();
  const { searchCompanies } = useCompanySearch();
  const { searchContacts } = useContactSearch();
  const { searchRoles } = useRoleSearch();
  const { eventTypes, loading: eventTypesLoading } = useEventTypes();

  if (loading || eventTypesLoading) return <PageLoading entityName={t('eventEntityName')} />;
  if (!event) return <div>{t('notFound')}</div>;

  const handleUpdate = async (data: EventEditFormData) => {
    return upsertEvent({ ...data, id });
  };

  const initialData: EventEditFormData = {
    ...event,
    company: event.company
      ? {
          id: event.company.id,
          name: event.company.name,
          isNew: false,
          shouldRemove: false,
        }
      : null,
    contact: event.contact
      ? {
          id: event.contact.id,
          firstName: event.contact.firstName,
          lastName: event.contact.lastName,
          isNew: false,
          shouldRemove: false,
        }
      : null,
    role: event.role
      ? {
          id: event.role.id,
          title: event.role.title,
          isNew: false,
          shouldRemove: false,
        }
      : null,
    hasReminder: event.reminders.length > 0,
    remindAt: event.reminders[0]?.remindAt || null,
  };

  return (
    <>
      <h1 className="mb-5 text-xl">{t('editTitle')}</h1>
      <EventForm
        isEdit={true}
        initialData={initialData}
        onSubmitAction={handleUpdate}
        onSearchCompany={searchCompanies}
        onSearchContact={searchContacts}
        onSearchRole={searchRoles}
        eventTypes={eventTypes}
        eventTypesLoading={eventTypesLoading}
        postActionRoute={`/events/${id}`}
        companyPlaceholder={t('formCompanyPlaceholder')}
        contactPlaceholder={t('formContactPlaceholder')}
        rolePlaceholder={t('formRolePlaceholder')}
        createCompanyLabel={(name) => t('formCreateCompany', { name })}
        createContactLabel={(firstNameLastName) => t('formCreateContact', { firstNameLastName })}
        createRoleLabel={(title) => t('formCreateRole', { title })}
        validateContact={(input) => {
          const trimmed = input.trim();
          if (!trimmed) return null;
          const parts = trimmed.split(/\s+/);
          if (parts.length < 2) return t('formContactValidation');
          return null;
        }}
      ></EventForm>
    </>
  );
}
