'use client';

import ReminderInfoCard from './reminder-info-card';
import { ReminderWithChildrenDTO } from '@job-tracker/validation';
import { AnimatedList } from '../common/animated-list';

export interface ReminderListProps {
  reminders: ReminderWithChildrenDTO[];
  onComplete?: (id: string) => void;
}

export function ReminderList({ reminders, onComplete }: ReminderListProps) {
  if (!reminders || !reminders.length) {
    return <p className="text-sm italic opacity-50">No reminders found</p>;
  }

  return (
    <AnimatedList
      items={reminders}
      getItemId={(reminder) => reminder.id}
      renderItem={(reminder) => (
        <ReminderInfoCard reminder={reminder} onComplete={onComplete} />
      )}
    />
  );
}

export default ReminderList;
