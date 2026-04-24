'use client';

import FormattedDate from '../common/formatted-date';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid';
import ExternalLink from '../common/external-link';
import { EventWithChildrenDTO } from '@job-tracker/validation';
import { DirectionType } from '@job-tracker/domain';
import EventActionMenu from './event-action-menu';
import { useTranslations } from 'next-intl';
import BaseInfoCard from '../common/base-info-card';

export interface EventInfoCardProps {
  event: EventWithChildrenDTO;
  showControls?: boolean;
}

const EVENT_CATEGORY_COLOR_MAP: Record<string, string> = {
  Application: 'border-l-primary',
  Communication: 'border-l-info',
  Interview: 'border-l-success',
  Outcome: 'border-l-accent',
};

export function EventInfoCard({ event, showControls = true }: EventInfoCardProps) {
  const tEnum = useTranslations('Enums');
  const tEvent = useTranslations('SystemEventTypes');
  const tCard = useTranslations('EventInfoCard');

  const borderClass =
    EVENT_CATEGORY_COLOR_MAP[event.eventType?.category || ''] || EVENT_CATEGORY_COLOR_MAP.default;

  const eventName = event.eventType?.isSystemDefined
    ? tEvent(event.eventType.name)
    : event.eventType?.name;

  const title = (
    <div className="flex items-center min-w-0">
      <span className="badge badge-info mr-1 truncate text-xs">{eventName}</span>
      <span className="tooltip shrink-0" data-tip={tEnum(`DirectionType.${event.direction}`)}>
        {event.direction === DirectionType.Inbound ? (
          <div className="flex items-center text-xs">
            <ChevronDoubleRightIcon className="size-4" />
            <span className="hidden sm:inline ml-1">{tEnum('DirectionType.Inbound')}</span>
          </div>
        ) : (
          <div className="flex items-center text-xs">
            <ChevronDoubleLeftIcon className="size-4" />
            <span className="hidden sm:inline ml-1">{tEnum('DirectionType.Outbound')}</span>
          </div>
        )}
      </span>
    </div>
  );

  const controls = (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-neutral-content text-xs hidden xs:inline">
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
      className={`card bg-base-300 w-full rounded-xl border-l-5 shadow-sm transition-transform hover:shadow-md active:scale-[0.99] ${borderClass}`}
    >
      <div className="space-y-2">
        {/* Main Content */}
        {(event.company || event.role) && (
          <div className="space-y-1">
            {event.company && (
              <p className="truncate text-sm font-semibold">{event.company?.name}</p>
            )}
            {event.role && <p className="truncate text-sm">{event.role?.title}</p>}
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
              <span className="flex items-center gap-1 truncate ml-2">
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
