import { EventCategoryType, RoleStatus } from '@job-tracker/domain';

export interface EventTypeDocument {
  id: string;
  serverId: number | null;
  updatedAt: string;
  createdAt?: string;

  name: string;
  category: EventCategoryType;
  targetStatus?: RoleStatus | null;
  isSystemDefined: boolean;
  isCommon: boolean;
}
