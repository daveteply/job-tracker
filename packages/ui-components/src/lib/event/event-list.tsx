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
        <p className="px-1 text-sm italic opacity-50">No Events found</p>
      )}
    </div>
  );
}

export default EventList;
