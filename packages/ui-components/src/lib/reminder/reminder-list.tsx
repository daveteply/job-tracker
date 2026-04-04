'use client';

import ReminderInfoCard from './reminder-info-card';
import { ReminderDTO } from '@job-tracker/validation';

export interface ReminderListProps {
  reminders: ReminderDTO[];
}

export function ReminderList({ reminders }: ReminderListProps) {
  return (
    <div className="flex flex-col gap-3">
      {reminders && reminders.length ? (
        <>
          {reminders.map((reminder) => (
            <ReminderInfoCard key={reminder.id} Reminder={reminder} />
          ))}
        </>
      ) : (
        <p>No Reminders found</p>
      )}
    </div>
  );
}

export default ReminderList;
