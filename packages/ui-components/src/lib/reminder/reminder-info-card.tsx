'use client';

import { MouseEvent } from 'react';

import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import { useTranslations } from 'next-intl';

import { useReminderActions } from '@job-tracker/hooks';
import { ReminderWithChildrenDTO } from '@job-tracker/validation';

import BaseInfoCard from '../common/data-display/base-info-card';
import FormattedDate from '../common/data-display/formatted-date';

export interface ReminderCardProps {
  reminder: ReminderWithChildrenDTO;
  showChevron?: boolean;
}

const getDaysDifference = (dateValue: Date | string): number => {
  if (!dateValue) return 0;

  let eventYear: number;
  let eventMonth: number;
  let eventDay: number;

  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    const [y, m, d] = dateValue.split('-').map(Number);
    eventYear = y;
    eventMonth = m - 1;
    eventDay = d;
  } else {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return 0;
    if (
      d.getUTCHours() === 0 &&
      d.getUTCMinutes() === 0 &&
      d.getUTCSeconds() === 0 &&
      d.getUTCMilliseconds() === 0
    ) {
      eventYear = d.getUTCFullYear();
      eventMonth = d.getUTCMonth();
      eventDay = d.getUTCDate();
    } else {
      eventYear = d.getFullYear();
      eventMonth = d.getMonth();
      eventDay = d.getDate();
    }
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  const eventMidnight = new Date(eventYear, eventMonth, eventDay);
  const currentMidnight = new Date(currentYear, currentMonth, currentDay);

  const diffInMs = eventMidnight.getTime() - currentMidnight.getTime();
  return Math.round(diffInMs / (1000 * 60 * 60 * 24));
};

export function ReminderInfoCard({ reminder, showChevron = true }: ReminderCardProps) {
  const t = useTranslations('Reminders');
  const tSystemEventTypes = useTranslations('SystemEventTypes');
  const { completeReminder } = useReminderActions();

  const event = reminder.event;
  const eventTypeName = event?.eventType
    ? (event.eventType.isSystemDefined && event.eventType.translationKey
        ? tSystemEventTypes(event.eventType.translationKey)
        : event.eventType.name)
    : '';

  const contactName = event?.contact
    ? `${event.contact.firstName} ${event.contact.lastName}`.trim()
    : null;
  const companyName = event?.company?.name;

  let titleText = '';
  if (contactName) {
    titleText = t('followUpWith', { name: contactName });
  } else if (companyName) {
    titleText = t('followUpAt', { company: companyName });
  } else if (eventTypeName) {
    titleText = t('followUpOn', { event: eventTypeName });
  } else {
    titleText = t('followUpDefault');
  }

  const subtitleText = event?.summary || '';

  const diffDays = getDaysDifference(reminder.remindAt);
  const isOverdueYesterday = !reminder.completedAt && diffDays === -1;
  const isOverdue = !reminder.completedAt && diffDays < -1;
  const isDueToday = !reminder.completedAt && diffDays === 0;
  const isDueTomorrow = !reminder.completedAt && diffDays === 1;

  let dateStatusText = '';
  let dateColorClass = 'opacity-50';

  if (reminder.completedAt) {
    dateStatusText = t('completedLabel');
    dateColorClass = 'text-success font-semibold';
  } else if (isOverdueYesterday) {
    dateStatusText = t('overdueYesterday');
    dateColorClass = 'text-error font-semibold';
  } else if (isOverdue) {
    dateStatusText = t('overdueBy', { days: Math.abs(diffDays) });
    dateColorClass = 'text-error font-semibold';
  } else if (isDueToday) {
    dateStatusText = t('dueToday');
    dateColorClass = 'text-warning font-semibold';
  } else if (isDueTomorrow) {
    dateStatusText = t('dueTomorrow');
    dateColorClass = 'text-primary font-semibold';
  } else {
    dateStatusText = t('dueInDays', { days: diffDays });
  }

  const handleComplete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await completeReminder(reminder.id);
  };

  const title = (
    <div className="min-w-0 flex-1">
      <h3 className="card-title truncate text-sm">{titleText}</h3>
      {subtitleText && (
        <p className="truncate text-xs opacity-70">
          {subtitleText}
        </p>
      )}
      <p className={`mt-1 text-[10px] uppercase ${dateColorClass}`}>
        {dateStatusText} — <FormattedDate dateValue={reminder.remindAt} useRelativeTime={false}></FormattedDate>
      </p>
    </div>
  );

  const completeButton = (
    <button
      type="button"
      onClick={handleComplete}
      className="btn btn-ghost btn-circle btn-xs text-success hover:bg-success/20"
      title={t('markAsComplete')}
      aria-label={t('markAsComplete')}
    >
      <CheckIcon className="size-4" />
    </button>
  );

  return (
    <BaseInfoCard
      title={title}
      showChevron={showChevron}
      detailsUrl={`/reminders/${reminder.id}`}
      className={isOverdue ? 'border-l-4 border-error' : ''}
      controls={!reminder.completedAt ? completeButton : undefined}
    />
  );
}

export default ReminderInfoCard;
