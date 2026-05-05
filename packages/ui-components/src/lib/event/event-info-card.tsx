'use client';

import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import { DirectionType } from '@job-tracker/domain';
import { EventWithChildrenDTO } from '@job-tracker/validation';

import BaseInfoCard from '../common/base-info-card';
import ExternalLink from '../common/external-link';
import FormattedDate from '../common/formatted-date';

import EventActionMenu from './event-action-menu';

export interface EventInfoCardProps {
  event: EventWithChildrenDTO;
  showControls?: boolean;
  showChevron?: boolean;
  showFull?: boolean;
  showReminders?: boolean;
}

const EVENT_CATEGORY_COLOR_MAP: Record<string, string> = {
  Application: 'border-l-primary',
  Communication: 'border-l-info',
  Interview: 'border-l-success',
  Outcome: 'border-l-accent',
};

export function EventInfoCard({
  event,
  showControls = true,
  showChevron = true,
  showFull = true,
  showReminders = true,
}: EventInfoCardProps) {
  const tEnum = useTranslations('Enums');
  const tEvent = useTranslations('SystemEventTypes');
  const tCard = useTranslations('EventInfoCard');

  const reminderCount = event.reminders?.length ?? 0;

  const borderClass =
    EVENT_CATEGORY_COLOR_MAP[event.eventType?.category || ''] || EVENT_CATEGORY_COLOR_MAP.default;

  let eventName = event.eventType?.name;
  if (event.eventType?.isSystemDefined && event.eventType?.translationKey) {
    try {
      eventName = tEvent(event.eventType.translationKey);
    } catch (e) {
      // Fallback to name if translation key is missing (legacy data)
      console.warn(`Missing translation for ${event.eventType.translationKey}`);
    }
  }

  const title = (
    <div className="flex min-w-0 items-center">
      <span className="badge badge-info mr-1 truncate text-xs">{eventName}</span>
      <span className="tooltip shrink-0" data-tip={tEnum(`DirectionType.${event.direction}`)}>
        {event.direction === DirectionType.Inbound ? (
          <div className="flex items-center text-xs">
            <ChevronDoubleRightIcon className="size-4" />
            <span className="ml-1 hidden sm:inline">{tEnum('DirectionType.Inbound')}</span>
          </div>
        ) : (
          <div className="flex items-center text-xs">
            <ChevronDoubleLeftIcon className="size-4" />
            <span className="ml-1 hidden sm:inline">{tEnum('DirectionType.Outbound')}</span>
          </div>
        )}
      </span>
      {reminderCount > 0 && (!showFull || !showReminders) && (
        <span className="badge badge-ghost badge-sm ml-2">{reminderCount} reminders</span>
      )}
    </div>
  );

  const controls = (
    <div className="flex shrink-0 items-center gap-2">
      <span className="text-neutral-content xs:inline hidden text-xs">
        <FormattedDate dateValue={event.occurredAt} />
      </span>
      {showControls && <EventActionMenu id={event.id} />}
    </div>
  );

  return (
    <BaseInfoCard
      title={title}
      controls={controls}
      detailsUrl={`/events/${event.id}`}
      showChevron={showChevron}
      showFull={showFull}
      className={`card bg-base-300 w-full rounded-xl border-l-5 shadow-sm transition-transform hover:shadow-md active:scale-[0.99] ${borderClass}`}
    >
      <div className="space-y-3">
        {/* Main Content */}
        {(event.company || event.role) && (
          <div className="space-y-1">
            {event.company && (
              <p className="truncate text-sm font-semibold">{event.company?.name}</p>
            )}
            {event.role && <p className="truncate text-sm">{event.role?.title}</p>}
          </div>
        )}

        {/* Reminders Section */}
        {showReminders && event.reminders && event.reminders.length > 0 && (
          <div>
            <h3 className="mb-1 text-xs font-semibold uppercase opacity-60">Reminders</h3>
            <ul className="list-inside list-disc text-xs">
              {event.reminders.map((reminder) => (
                <li key={reminder.id}>
                  <FormattedDate dateValue={reminder.remindAt} />
                  {reminder.completedAt && (
                    <span className="ml-2 badge badge-success badge-xs italic">Completed</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Metadata Row */}
        {(event.role || event.company || event.contact) && (
          <div className="text-neutral-content flex items-center justify-between text-xs">
            {(event.role || event.company) && (
              <span className="flex items-center gap-1">
                <ExternalLink url={event.role?.jobPostingUrl ?? event.company?.website ?? ''} />
              </span>
            )}
            {event.contact && (
              <span className="ml-2 flex items-center gap-1 truncate">
                <span>
                  {event.direction === DirectionType.Inbound ? tCard('from') : tCard('to')}
                </span>
                <span className="truncate">
                  {event.contact.firstName} {event.contact.lastName}
                </span>
              </span>
            )}
          </div>
        )}
        {event.summary && <p className="text-sm">{event.summary}</p>}
        {event.details && <p className="text-sm opacity-80">{event.details}</p>}
      </div>
    </BaseInfoCard>
  );
}

export default EventInfoCard;
