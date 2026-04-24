'use client';

import { EventWithChildrenDTO } from '@job-tracker/validation';
import EventInfoCard from './event-info-card';
import { useTranslations } from 'next-intl';

export interface EventListProps {
  events: EventWithChildrenDTO[];
  showControls?: boolean;
}

export function EventList(props: EventListProps) {
  const t = useTranslations('Events');

  return (
    <div className="flex flex-wrap">
      {props.events && props.events.length ? (
        <>
          {props.events.map((event: EventWithChildrenDTO) => (
            <EventInfoCard key={event.id} event={event} showControls={props.showControls} />
          ))}
        </>
      ) : (
        <p className="px-1 text-sm italic opacity-50">{t('noEventsFound')}</p>
      )}
    </div>
  );
}

export default EventList;
