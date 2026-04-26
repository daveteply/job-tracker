'use client';

import { ReminderWithChildrenDTO } from '@job-tracker/validation';

import BaseInfoCard from '../common/base-info-card';
import FormattedDate from '../common/formatted-date';

export interface ReminderCardProps {
  reminder: ReminderWithChildrenDTO;
  showChevron?: boolean;
}

export function ReminderInfoCard({
  reminder,
  showChevron = true,
}: ReminderCardProps) {
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

  return (
    <BaseInfoCard
      title={title}
      showChevron={showChevron}
      detailsUrl={`/reminders/${reminder.id}`}
    />
  );
}

export default ReminderInfoCard;
