'use client';

import ReminderInfoCard from './reminder-info-card';
import { ReminderWithChildrenDTO } from '@job-tracker/validation';
import { AnimatedList } from '../common/animated-list';
import { useTranslations } from 'next-intl';

export interface ReminderListProps {
  reminders: ReminderWithChildrenDTO[];
  onComplete?: (id: string) => void;
  noRemindersMessage?: string;
}

export function ReminderList({
  reminders,
  onComplete,
  noRemindersMessage,
}: ReminderListProps) {
  const t = useTranslations('Reminders');
  const message = noRemindersMessage || t('noRemindersFound');

  if (!reminders || !reminders.length) {
    return <p className="px-1 text-sm italic opacity-50">{message}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <AnimatedList
        items={reminders}
        getItemId={(reminder) => reminder.id}
        renderItem={(reminder) => (
          <ReminderInfoCard reminder={reminder} onComplete={onComplete} />
        )}
      />
    </div>
  );
}

export default ReminderList;
