'use client';

import { use } from 'react';

import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';
import { useTranslations } from 'next-intl';

import { useEventWithChildren } from '@job-tracker/hooks';
import {
  CompanyInfoCard,
  ContactInfoCard,
  EventTypeInfoCard,
  FormattedDate,
  PageLoading,
  RoleInfoCard,
} from '@job-tracker/ui-components';

import { Link } from '../../../../../i18n/routing';

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Events');
  const { id } = use(params);
  const { event, loading } = useEventWithChildren(id);

  if (loading) return <PageLoading entityName={t('eventEntityName')} />;
  if (!event) return <div>{t('notFound')}</div>;

  return (
    <>
      <div className="mb-3 flex">
        <h1 className="pr-2 text-xl">{t('detailsTitle')}</h1>
        <Link
          className="btn btn-circle btn-sm text-primary"
          href={`${id}/edit`}
          title={t('editEvent')}
        >
          <PencilIcon className="size-5" />
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error"
          href={`${id}/delete`}
          title={t('deleteEvent')}
        >
          <TrashIcon className="size-6" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-1">
          {event.direction}
          <span>{t('on')}</span>
          <FormattedDate dateValue={event.occurredAt} useRelativeTime={false} />
        </div>
        <p>
          {event.source && <span>{t('sourceLabel')}</span>}
          {event.source}
        </p>

        {event.company && <CompanyInfoCard company={event.company} />}
        {event.contact && <ContactInfoCard contact={event.contact} />}
        {event.role && <RoleInfoCard role={event.role} />}
        {event.eventType && <EventTypeInfoCard eventType={event.eventType} />}
        <ul>
          <li>
            {event.summary && <span>{t('summaryLabel')}</span>}
            {event.summary}
          </li>
          <li>
            {event.details && <span>{t('detailsLabel')}</span>}
            {event.details}
          </li>
        </ul>
      </div>

      <div className="mt-5">
        <Link className="btn" href="/activity">
          {t('backToActivity')}
        </Link>
      </div>
    </>
  );
}
