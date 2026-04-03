'use client';

import { EventList } from '@job-tracker/ui-components';
import { useEventsWithChildren } from '@job-tracker/hooks';

export default function EventsPage() {
  const { events, loading } = useEventsWithChildren();

  return (
    <>
      <div className="flex mb-3 justify-between">
        {loading}
        <h1 className="text-xl pr-1">Events</h1>
      </div>

      <EventList events={events} />
    </>
  );
}
