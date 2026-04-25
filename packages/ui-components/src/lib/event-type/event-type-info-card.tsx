'use client';

import { EventTypeDTO } from '@job-tracker/validation';
import BaseInfoCard from '../common/base-info-card';

export interface EventTypeCardProps {
  eventType: EventTypeDTO;
  renderFull?: boolean;
  showChevron?: boolean;
}

export function EventTypeInfoCard({
  eventType,
  renderFull = true,
  showChevron = true,
}: EventTypeCardProps) {
  return (
    <BaseInfoCard
      title={eventType.name}
      showFull={renderFull}
      showChevron={showChevron}
    >
      <ul>
        <li>{eventType.category}</li>
        <li>{eventType.isSystemDefined ? 'System' : 'User'}</li>
      </ul>
    </BaseInfoCard>
  );
}

export default EventTypeInfoCard;
