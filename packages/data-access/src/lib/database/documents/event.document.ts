import { DirectionType, SourceType } from '@job-tracker/domain';

export interface EventDocument {
  id: string;
  serverId: number | null;
  version: number;
  updatedAt: string;
  createdAt?: string;

  eventTypeId: string;
  companyId?: string | null;
  contactId?: string | null;
  roleId?: string | null;

  occurredAt: string;
  summary?: string | null;
  details?: string | null;
  source: SourceType;
  direction: DirectionType;
}
