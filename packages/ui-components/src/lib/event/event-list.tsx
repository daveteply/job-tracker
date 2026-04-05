import { EventWithChildrenDTO } from '@job-tracker/validation';
import EventInfoCard from './event-info-card';

export interface EventListProps {
  events: EventWithChildrenDTO[];
  showControls?: boolean;
}

export function EventList(props: EventListProps) {
  return (
    <div className="flex flex-wrap">
      {props.events && props.events.length ? (
        <>
          {props.events.map((event: EventWithChildrenDTO) => (
            <EventInfoCard key={event.id} event={event} showControls={props.showControls} />
          ))}
        </>
      ) : (
        <p className="text-sm opacity-50 italic px-1">No Events found</p>
      )}
    </div>
  );
}

export default EventList;
