'use client';

import ReminderInfoCard from './reminder-info-card';
import { ReminderWithChildrenDTO } from '@job-tracker/validation';

export interface ReminderListProps {
  reminders: ReminderWithChildrenDTO[];
  onComplete?: (id: string) => void;
}

export function ReminderList({ reminders, onComplete }: ReminderListProps) {
  return (
    <div className="flex flex-col gap-3">
      {reminders && reminders.length ? (
        <>
          {reminders.map((reminder) => (
            <ReminderInfoCard key={reminder.id} reminder={reminder} onComplete={onComplete} />
          ))}
        </>
      ) : (
        <p className="text-sm opacity-50 italic">No reminders found</p>
      )}
    </div>
  );
}

export default ReminderList;
