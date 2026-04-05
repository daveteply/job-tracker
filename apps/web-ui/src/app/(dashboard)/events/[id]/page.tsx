'use client';

import { use } from 'react';
import { useEventWithChildren } from '@job-tracker/hooks';
import {
  CompanyInfoCard,
  ContactInfoCard,
  EventTypeInfoCard,
  FormattedDate,
  PageLoading,
  RoleInfoCard,
} from '@job-tracker/ui-components';
import Link from 'next/link';
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { event, loading } = useEventWithChildren(id);

  if (loading) return <PageLoading entityName="contact" />;
  if (!event) return <div>Event not found</div>;

  return (
    <>
      <div className="flex mb-3">
        <h1 className="text-xl pr-2">Event Details</h1>
        <Link className="btn btn-circle btn-sm text-primary" href={`${id}/edit`} title="Edit Event">
          <PencilIcon className="size-5" />
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error"
          href={`${id}/delete`}
          title="Delete Event"
        >
          <TrashIcon className="size-6" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-1">
          {event.direction}
          <span>on</span>
          <FormattedDate dateValue={event.occurredAt} useRelativeTime={false} />
        </div>
        <p>
          {event.source && <span>Source: </span>}
          {event.source}
        </p>

        {event.company && <CompanyInfoCard company={event.company} />}
        {event.contact && <ContactInfoCard contact={event.contact} />}
        {event.role && <RoleInfoCard role={event.role} />}
        {event.eventType && <EventTypeInfoCard eventType={event.eventType} />}
        <ul>
          <li>
            {event.summary && <span>Summary: </span>}
            {event.summary}
          </li>
          <li>
            {event.details && <span>Details: </span>}
            {event.details}
          </li>
          <li></li>
        </ul>
      </div>

      <div className="mt-5">
        <Link className="btn" href="/activity">
          Back to Activity
        </Link>
      </div>
    </>
  );
}
