'use client';

import { useEventActions, useEventWithChildren } from '@job-tracker/hooks';
import { EntityDelete, EventInfoCard, PageLoading } from '@job-tracker/ui-components';
import { use } from 'react';

export default function DeleteEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { event, loading } = useEventWithChildren(id);

  const { removeEvent } = useEventActions();

  if (loading) return <PageLoading entityName="Event" />;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="pr-1 text-xl">Event - Delete</h1>

      <>
        <EventInfoCard event={event} showControls={false}></EventInfoCard>
        <EntityDelete
          id={event.id}
          entityName="event"
          postActionRoute="/activity"
          onDeleteAction={removeEvent}
        />
      </>
    </div>
  );
}
