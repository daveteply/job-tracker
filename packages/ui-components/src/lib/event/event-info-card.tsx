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
  const borderClass =
    EVENT_CATEGORY_COLOR_MAP[event.eventType?.category || ''] || EVENT_CATEGORY_COLOR_MAP.default;
  return (
    <div
      className={`relative w-full mb-3 card bg-base-300 shadow-sm rounded-xl active:scale-[0.99] transition-transform border-l-5 hover:shadow-md
 ${borderClass}`}
    >
      {/* The invisible primary link */}
      <Link
        href={`/events/${event.id}`}
        className="absolute inset-0 z-10"
        aria-label="Go to Event Details page"
      />

      <div className="card-body p-4 space-y-2">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40">
          <ChevronRightIcon className="w-5 h-5" />
        </div>

        {/* Top Row: Status + Timestamp  */}
        <div className="flex items-center justify-between">
          <div className="flex">
            <span className="badge badge-info text-xs truncate mr-1">{event.eventType?.name}</span>
            <span className="tooltip z-10" data-tip={event.direction}>
              {event.direction === DirectionType.Inbound ? (
                <div className="flex items-center">
                  <ChevronDoubleRightIcon className="size-5" />
                  <span className="text-xs">Inbound</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <ChevronDoubleLeftIcon className="size-5" />
                  <span className="text-xs">Outbound</span>
                </div>
              )}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-neutral-content">
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
              <p className="font-semibold text-sm truncate">{event.company?.name}</p>
            )}
            {event.role && <p className="text-sm truncate">{event.role?.title}</p>}
          </div>
        )}

        {/* Metadata Row */}
        {(event.role || event.company || event.contact) && (
          <div className="flex items-center justify-between text-xs text-neutral-content">
            {(event.role || event.company) && (
              <span className="flex items-center gap-1">
                <ExternalLink url={event.role?.jobPostingUrl ?? event.company?.website ?? ''} />
              </span>
            )}
            {event.contact && (
              <span className="flex items-center gap-1">
                <span>{event.direction === DirectionType.Inbound ? 'from' : 'to'}</span>
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
