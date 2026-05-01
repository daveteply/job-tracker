import { EventCategoryType } from '../common/event-category-type';
import { RoleStatus } from '../common/role-status-type';

export interface EventTypeEntity {
  id: string;
  serverId: number | null;

  name: string;
  translationKey?: string;
  category: EventCategoryType;
  targetStatus?: RoleStatus | null;
  isSystemDefined: boolean;
  isCommon: boolean;

  updatedAt?: string;
  createdAt?: string;
}
