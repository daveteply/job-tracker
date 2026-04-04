'use client';

import Link from 'next/link';
import { PencilIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { ReminderWithChildrenDTO } from '@job-tracker/validation';

export interface ReminderCardProps {
  reminder: ReminderWithChildrenDTO;
  showControls?: boolean;
  onComplete?: (id: string) => void;
}

export function ReminderInfoCard({ reminder, showControls = true, onComplete }: ReminderCardProps) {
  const event = reminder.event;
  const title = event?.summary || 'Follow up';
  const contactName = event?.contact
    ? `${event.contact.firstName} ${event.contact.lastName}`.trim()
    : null;
  const companyName = event?.company?.name;

  return (
    <div className="card bg-base-300 card-sm shadow-sm">
      <div className="card-body py-3 px-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="card-title text-sm truncate">{title}</h3>
            {(contactName || companyName) && (
              <p className="text-xs opacity-70 truncate">
                {contactName} {companyName ? `@ ${companyName}` : ''}
              </p>
            )}
            <p className="text-[10px] font-medium mt-1 uppercase opacity-50">
              {reminder.remindAt.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
          {showControls && (
            <div className="flex gap-2">
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
          )}
        </div>
      </div>
    </div>
  );
}

export default ReminderInfoCard;
