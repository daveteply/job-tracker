'use client';

import { useTranslations } from 'next-intl';

import { EventWithChildrenDTO } from '@job-tracker/validation';

import EventInfoCard from './event-info-card';

export interface EventListProps {
  events: EventWithChildrenDTO[];
  showControls?: boolean;
  noEventsMessage?: string;
}

export function EventList({ events, showControls, noEventsMessage }: EventListProps) {
  const t = useTranslations('Events');
  const message = noEventsMessage || t('noEventsFound');

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events && events.length ? (
        <>
          {events.map((event: EventWithChildrenDTO) => (
            <EventInfoCard key={event.id} event={event} showControls={showControls} />
          ))}
        </>
      ) : (
        <p className="px-1 text-sm italic opacity-50">{message}</p>
      )}
    </div>
  );
}

export default EventList;
