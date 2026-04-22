'use client';

import { EventTypeDTO } from '@job-tracker/validation';

export interface EventTypeCardProps {
  eventType: EventTypeDTO;
  renderFull?: boolean;
}

export function EventTypeInfoCard({ eventType, renderFull = true }: EventTypeCardProps) {
  return (
    <div className="card bg-base-300 card-sm shadow-sm">
      <div className="card-body">
        {renderFull ? (
          <>
            <h2 className="card-title">{eventType.name}</h2>
            <ul>
              <li>{eventType.category}</li>
              <li>{eventType.isSystemDefined}</li>
            </ul>
          </>
        ) : (
          <div className="flex">
            <h2 className="card-title pr-1">{eventType.name} </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventTypeCardProps;
