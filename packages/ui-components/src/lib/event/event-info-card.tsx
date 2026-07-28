'use client';

import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/outline/ChevronUpIcon';
import InboxArrowDownIcon from '@heroicons/react/24/solid/InboxArrowDownIcon';
import PaperAirplaneIcon from '@heroicons/react/24/solid/PaperAirplaneIcon';
import { useTranslations } from 'next-intl';

import { DirectionType } from '@job-tracker/domain';
import { EventWithChildrenDTO } from '@job-tracker/validation';

import BaseInfoCard from '../common/data-display/base-info-card';
import ExternalLink from '../common/data-display/external-link';
import FormattedDate from '../common/data-display/formatted-date';

import EventActionMenu from './event-action-menu';

export interface EventInfoCardProps {
  event: EventWithChildrenDTO;
  showControls?: boolean;
  showChevron?: boolean;
  showFull?: boolean;
  showReminders?: boolean;
  onToggleShowFull?: () => void;
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
  onToggleShowFull,
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
    } catch {
      // Fallback to name if translation key is missing (legacy data)
      console.warn(`Missing translation for ${event.eventType.translationKey}`);
    }
  }

  const hasCompanyOrRole = Boolean(event.company?.name || event.role?.title);

  const title = (
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="badge badge-info truncate text-xs font-semibold">{eventName}</span>
        <span
          className="tooltip flex shrink-0 items-center"
          data-tip={tEnum(`DirectionType.${event.direction}`)}
        >
          {event.direction === DirectionType.Inbound ? (
            <div className="bg-success/20 text-success flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
              <InboxArrowDownIcon className="mr-1 size-3.5" />
              <span>{tEnum('DirectionType.Inbound')}</span>
            </div>
          ) : (
            <div className="bg-primary/20 text-primary flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
              <PaperAirplaneIcon className="mr-1 size-3.5" />
              <span>{tEnum('DirectionType.Outbound')}</span>
            </div>
          )}
        </span>
        {onToggleShowFull && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleShowFull();
            }}
            className="badge badge-ghost badge-sm ml-1 shrink-0 cursor-pointer border-none transition-colors hover:bg-base-content/20 gap-1"
            title={showFull ? 'Collapse details' : 'Expand details'}
            aria-label={showFull ? 'Collapse details' : 'Expand details'}
          >
            {reminderCount > 0 && <span>{reminderCount}</span>}
            {showFull ? (
              <ChevronUpIcon className="size-3" />
            ) : (
              <ChevronDownIcon className="size-3" />
            )}
          </button>
        )}
      </div>
      {hasCompanyOrRole && (
        <div className="truncate text-xs font-medium opacity-70">
          {event.company?.name && <span>{event.company.name}</span>}
          {event.company?.name && event.role?.title && <span className="mx-1.5">•</span>}
          {event.role?.title && <span>{event.role.title}</span>}
        </div>
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

        {/* Reminders Section */}
        {showReminders && event.reminders && event.reminders.length > 0 && (
          <div>
            <h3 className="mb-1 text-xs font-semibold uppercase opacity-60">
              {tCard('reminders')}
            </h3>
            <p className="mb-1.5 text-xs font-medium text-base-content/80">
              {tCard('remindersCount', { count: reminderCount })}
            </p>
            <ul className="list-inside list-disc text-xs">
              {event.reminders.map((reminder) => (
                <li key={reminder.id}>
                  <FormattedDate dateValue={reminder.remindAt} />
                  {reminder.completedAt && (
                    <span className="badge badge-success badge-xs ml-2 italic">Completed</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {showFull && !showReminders && reminderCount > 0 && (
          <p className="text-xs font-medium text-base-content/80">
            {tCard('remindersCount', { count: reminderCount })}
          </p>
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
