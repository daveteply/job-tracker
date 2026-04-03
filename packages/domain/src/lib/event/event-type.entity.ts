import { EventCategoryType } from '../common/event-category-type';

export interface EventTypeEntity {
  id: string;
  serverId: number;

  name: string;
  category: EventCategoryType;
  isSystemDefined: boolean;

  updatedAt?: string;
  createdAt?: string;
}
