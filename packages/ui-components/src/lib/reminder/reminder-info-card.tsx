'use client';

import Link from 'next/link';
import { PencilIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { ReminderWithChildrenDTO } from '@job-tracker/validation';
import FormattedDate from '../common/formatted-date';
import BaseInfoCard from '../common/base-info-card';

export interface ReminderCardProps {
  reminder: ReminderWithChildrenDTO;
  showControls?: boolean;
  onComplete?: (id: string) => void;
}

export function ReminderInfoCard({ reminder, showControls = true, onComplete }: ReminderCardProps) {
  const event = reminder.event;
  const titleText = event?.summary || 'Follow up';
  const contactName = event?.contact
    ? `${event.contact.firstName} ${event.contact.lastName}`.trim()
    : null;
  const companyName = event?.company?.name;

  const title = (
    <div className="min-w-0 flex-1">
      <h3 className="card-title truncate text-sm">{titleText}</h3>
      {(contactName || companyName) && (
        <p className="truncate text-xs opacity-70">
          {contactName} {companyName ? `@ ${companyName}` : ''}
        </p>
      )}
      <p className="mt-1 text-[10px] font-medium uppercase opacity-50">
        <FormattedDate dateValue={reminder.remindAt}></FormattedDate>
      </p>
    </div>
  );

  const controls = showControls && (
    <div className="flex gap-1">
      {onComplete && !reminder.completedAt && (
        <button
          onClick={() => onComplete(reminder.id)}
          className="btn btn-ghost btn-xs btn-circle text-success"
          title="Mark as complete"
        >
          <CheckCircleIcon className="size-5" />
        </button>
      )}
      <Link href={`/events/${event?.id}/edit`} className="btn btn-ghost btn-xs btn-circle">
        <PencilIcon className="size-4" />
      </Link>
    </div>
  );

  return (
    <BaseInfoCard
      title={title}
      controls={controls}
      // No detailsUrl for now as there's no [id] page for reminders yet.
      // Could potentially link to the associated event if desired.
    />
  );
}

export default ReminderInfoCard;
