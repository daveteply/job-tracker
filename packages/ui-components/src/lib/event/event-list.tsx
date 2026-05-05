'use client';

import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
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
  showExpandToggle?: boolean;
}

export function EventList({
  events,
  showControls,
  noEventsMessage,
  showFull = false,
  showReminders = false,
  onToggleShowFull,
  showExpandToggle = false,
}: EventListProps) {
  const t = useTranslations('Events');
  const message = noEventsMessage || t('noEventsFound');

  return (
    <div className="relative">
      {showExpandToggle && onToggleShowFull && (
        <div className="absolute -top-10 right-0 z-10">
          <label className="swap text-xs font-medium uppercase opacity-70 transition-opacity hover:opacity-100">
            <input
              type="checkbox"
              checked={showFull}
              onChange={() => onToggleShowFull()}
              className="hidden"
            />
            <div className="swap-on flex items-center justify-end gap-1">
              <ArrowsPointingInIcon className="h-4 w-4" />
              <span>{t('collapse')}</span>
            </div>
            <div className="swap-off flex items-center justify-end gap-1">
              <ArrowsPointingOutIcon className="h-4 w-4" />
              <span>{t('expand')}</span>
            </div>
          </label>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events && events.length ? (
          <>
            {events.map((event: EventWithChildrenDTO) => (
              <EventInfoCard
                key={event.id}
                event={event}
                showControls={showControls}
                showFull={showFull}
                showReminders={showReminders}
              />
            ))}
          </>
        ) : (
          <p className="px-1 text-sm italic opacity-50">{message}</p>
        )}
      </div>
    </div>
  );
}

export default EventList;
