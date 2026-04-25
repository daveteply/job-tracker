'use client';

import ReminderInfoCard from './reminder-info-card';
import { ReminderWithChildrenDTO } from '@job-tracker/validation';
import { useTranslations } from 'next-intl';

export interface ReminderListProps {
  reminders: ReminderWithChildrenDTO[];
  noRemindersMessage?: string;
}

export function ReminderList({
  reminders,
  noRemindersMessage,
}: ReminderListProps) {
  const t = useTranslations('Reminders');
  const message = noRemindersMessage || t('noRemindersFound');

  if (!reminders || !reminders.length) {
    return <p className="px-1 text-sm italic opacity-50">{message}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {reminders.map((reminder) => (
        <ReminderInfoCard
          key={reminder.id}
          reminder={reminder}
        />
      ))}
    </div>
  );
}

export default ReminderList;
