import { EventCategoryType } from '@job-tracker/domain';

export interface EventTypeDocument {
  id: string;
  serverId: number | null;
  updatedAt: string;
  createdAt?: string;

  name: string;
  category: EventCategoryType;
  isSystemDefined: boolean;
}
