'use client';

import { use } from 'react';
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
import { useTranslations } from 'next-intl';

type EventEditFormData = EventDTO & {
  company?: {
    id?: string;
    name?: string;
    isNew?: boolean;
    shouldRemove?: boolean;
    displayValue?: string;
  } | null;

  contact?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    isNew?: boolean;
    shouldRemove?: boolean;
    displayValue?: string;
  } | null;

  role?: {
    id?: string;
    title?: string;
    isNew?: boolean;
    shouldRemove?: boolean;
    displayValue?: string;
  } | null;

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

  if (loading || eventTypesLoading) return <PageLoading entityName="event" />;
  if (!event) return <div>Event not found</div>;

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
        }
      : null,
    contact: event.contact
      ? {
          id: event.contact.id,
          firstName: event.contact.firstName,
          lastName: event.contact.lastName,
          isNew: false,
        }
      : null,
    role: event.role
      ? {
          id: event.role.id,
          title: event.role.title,
          isNew: false,
        }
      : null,
    hasReminder: !!event.reminder,
    remindAt: event.reminder?.remindAt || null,
  };

  return (
    <>
      <h1 className="mb-5 text-xl">Edit Event</h1>
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
      ></EventForm>
    </>
  );
}
