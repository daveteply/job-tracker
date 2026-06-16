import { DirectionType } from '../common/direction-type';
import { CompanyEntity } from '../company/company.entity';
import { ContactEntity } from '../contact/contact.entity';
import { RoleEntity } from '../role/role.entity';

import { EventTypeEntity } from './event-type.entity';
import { SourceTypeEntity } from './source-type.entity';

export interface EventEntity {
  id: string;
  serverId: number | null;
  version: number;

  companyId?: string | null;
  contactId?: string | null;
  roleId?: string | null;
  eventTypeId: string;
  sourceTypeId: string;

  occurredAt: Date;
  summary?: string;
  details?: string;
  direction: DirectionType;

  updatedAt?: string;
  createdAt?: string;
}

export interface EventPopulatedEntity {
  company?: CompanyEntity;
  contact?: ContactEntity;
  role?: RoleEntity;
  eventType: EventTypeEntity;
  sourceType: SourceTypeEntity;
}
