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

      <div className="flex flex-col gap-4">
        <div className="flex gap-1 text-sm opacity-80">
          {event.direction}
          <span>{t('on')}</span>
          <FormattedDate dateValue={event.occurredAt} useRelativeTime={false} />
          {event.source && (
            <>
              <span>•</span>
              <span>{t('sourceLabel')}</span>
              {event.source}
            </>
          )}
        </div>

        {event.company && (
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-neutral-content/60">
              {t('sectionCompany')}
            </h2>
            <CompanyInfoCard company={event.company} />
          </div>
        )}

        {event.contact && (
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-neutral-content/60">
              {t('sectionContact')}
            </h2>
            <ContactInfoCard contact={event.contact} />
          </div>
        )}

        {event.role && (
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-neutral-content/60">
              {t('sectionRole')}
            </h2>
            <RoleInfoCard role={event.role} />
          </div>
        )}

        {event.eventType && (
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-neutral-content/60">
              {t('sectionEventType')}
            </h2>
            <EventTypeInfoCard eventType={event.eventType} />
          </div>
        )}

        {event.reminders && event.reminders.length > 0 && (
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-neutral-content/60">
              Reminders
            </h2>
            <div className="card bg-base-300 rounded-xl p-4 shadow-sm">
              <ul className="space-y-2">
                {event.reminders.map((reminder) => (
                  <li key={reminder.id} className="text-sm flex items-center justify-between">
                    <span>
                      <FormattedDate dateValue={reminder.remindAt} useRelativeTime={false} />
                    </span>
                    {reminder.completedAt && (
                      <span className="badge badge-success badge-sm italic">Completed</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {(event.summary || event.details) && (
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-neutral-content/60">
              {t('sectionDescription')}
            </h2>
            <div className="card bg-base-300 rounded-xl p-4 shadow-sm">
              <ul className="space-y-2">
                {event.summary && (
                  <li className="text-sm">
                    <span className="font-semibold">{t('summaryLabel')}</span> {event.summary}
                  </li>
                )}
                {event.details && (
                  <li className="text-sm">
                    <span className="font-semibold">{t('detailsLabel')}</span> {event.details}
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5">
        <Link className="btn" href="/activity">
          {t('backToActivity')}
        </Link>
      </div>
    </>
  );
}
