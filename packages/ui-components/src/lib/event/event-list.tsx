'use client';

import { useTranslations } from 'next-intl';

import { EventWithChildrenDTO } from '@job-tracker/validation';

import EventInfoCard from './event-info-card';

export interface EventListProps {
  events: EventWithChildrenDTO[];
  showControls?: boolean;
  noEventsMessage?: string;
  showFull?: boolean;
  showReminders?: boolean;
  onToggleShowFull?: () => void;
  eventExpandedStates?: Record<string, boolean>;
  onToggleEventExpand?: (eventId: string) => void;
  showExpandToggle?: boolean;
}

export function EventList({
  events,
  showControls,
  noEventsMessage,
  showFull = false,
  showReminders = false,
  onToggleShowFull,
  eventExpandedStates = {},
  onToggleEventExpand,
}: EventListProps) {
  const t = useTranslations('Events');
  const message = noEventsMessage || t('noEventsFound');

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events && events.length ? (
          <>
            {events.map((event: EventWithChildrenDTO) => {
              const isCardExpanded = eventExpandedStates[event.id] ?? showFull;
              return (
                <EventInfoCard
                  key={event.id}
                  event={event}
                  showControls={showControls}
                  showFull={isCardExpanded}
                  showReminders={showReminders}
                  onToggleShowFull={() => {
                    if (onToggleEventExpand) {
                      onToggleEventExpand(event.id);
                    } else {
                      onToggleShowFull?.();
                    }
                  }}
                />
              );
            })}
          </>
        ) : (
          <p className="px-1 text-sm italic opacity-50">{message}</p>
        )}
      </div>
    </div>
  );
}

export default EventList;
