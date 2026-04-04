'use client';

import Link from 'next/link';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { ReminderDTO } from '@job-tracker/validation';

export interface ReminderCardProps {
  Reminder: ReminderDTO;
  showFull?: boolean;
  showControls?: boolean;
}

export function ReminderInfoCard({
  Reminder,
  showFull = true,
  showControls = true,
}: ReminderCardProps) {
  return (
    <div className="card bg-base-300 card-sm shadow-sm">
      <div className="card-body">
        {showFull ? (
          <>
            <div className="flex justify-between">
              <h2 className="card-title">{Reminder.remindAt.toDateString()}</h2>
              {showControls && (
                <div className="flex gap-1">
                  <Link href={`/reminders/${Reminder.id}/edit`}>
                    <PencilIcon className="size-5" />
                  </Link>
                  <Link href={`/reminders/${Reminder.id}/delete`} className="text-error">
                    <TrashIcon className="size-5" />
                  </Link>
                </div>
              )}
            </div>
            {/* <ul>
              {Reminder.website && (
                <li>
                  <ExternalLink url={Reminder.website} />
                </li>
              )}
              <li>{Reminder.industry}</li>
              <li>{Reminder.sizeRange}</li>
              <li>{Reminder.notes}</li>
            </ul> */}
          </>
        ) : (
          <div className="flex">
            {/* <h2 className="card-title pr-1">{Reminder.name}</h2>
            <ExternalLink url={Reminder.website || ''} /> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReminderInfoCard;
