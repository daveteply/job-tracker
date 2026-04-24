'use client';

import { EventTypeDTO } from '@job-tracker/validation';
import BaseInfoCard from '../common/base-info-card';

export interface EventTypeCardProps {
  eventType: EventTypeDTO;
  renderFull?: boolean;
}

export function EventTypeInfoCard({ eventType, renderFull = true }: EventTypeCardProps) {
  return (
    <BaseInfoCard
      title={eventType.name}
      showFull={renderFull}
    >
      <ul>
        <li>{eventType.category}</li>
        <li>{eventType.isSystemDefined ? 'System' : 'User'}</li>
      </ul>
    </BaseInfoCard>
  );
}

export default EventTypeInfoCard;
