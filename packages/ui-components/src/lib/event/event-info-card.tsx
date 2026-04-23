'use client';

import FormattedDate from '../common/formatted-date';
import Link from 'next/link';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';
import ExternalLink from '../common/external-link';
import { EventWithChildrenDTO } from '@job-tracker/validation';
import { DirectionType } from '@job-tracker/domain';
import EventActionMenu from './event-action-menu';
import { useTranslations } from 'next-intl';

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

  return (
    <div
      className={`card bg-base-300 relative mb-3 w-full rounded-xl border-l-5 shadow-sm transition-transform hover:shadow-md active:scale-[0.99] ${borderClass}`}
    >
      {/* The invisible primary link */}
      <Link
        href={`/events/${event.id}`}
        className="absolute inset-0 z-10"
        aria-label={tCard('detailsAriaLabel')}
      />

      <div className="card-body space-y-2 p-4">
        <div className="absolute top-1/2 right-3 -translate-y-1/2 opacity-40">
          <ChevronRightIcon className="h-5 w-5" />
        </div>

        {/* Top Row: Status + Timestamp  */}
        <div className="flex items-center justify-between">
          <div className="flex">
            <span className="badge badge-info mr-1 truncate text-xs">{eventName}</span>
            <span className="tooltip z-10" data-tip={tEnum(`DirectionType.${event.direction}`)}>
              {event.direction === DirectionType.Inbound ? (
                <div className="flex items-center">
                  <ChevronDoubleRightIcon className="size-5" />
                  <span className="text-xs">{tEnum('DirectionType.Inbound')}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <ChevronDoubleLeftIcon className="size-5" />
                  <span className="text-xs">{tEnum('DirectionType.Outbound')}</span>
                </div>
              )}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-neutral-content text-xs">
              <FormattedDate dateValue={event.occurredAt} />
            </span>
            {showControls && (
              <div className="relative z-20">
                <EventActionMenu id={event.id} />
              </div>
            )}
          </div>
        </div>

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
              <span className="flex items-center gap-1">
                <span>
                  {event.direction === DirectionType.Inbound ? tCard('from') : tCard('to')}
                </span>
                <span>
                  {event.contact.firstName} {event.contact.lastName}
                </span>
              </span>
            )}
          </div>
        )}
        {event.summary && <p>{event.summary}</p>}
        {event.details && <p>{event.details}</p>}
      </div>
    </div>
  );
}

export default EventInfoCard;
