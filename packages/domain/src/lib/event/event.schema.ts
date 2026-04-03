import { RxJsonSchema } from 'rxdb';
import { DirectionType } from '../common/direction-type';
import { SourceType } from '../common/source-type';
import { EventEntity } from './event.entity';

const EVENT_SCHEMA_VERSION = 0;

export const EventSchema: RxJsonSchema<EventEntity> = {
  title: 'event schema',
  version: EVENT_SCHEMA_VERSION,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 36 },
    serverId: { type: ['number', 'null'] },

    companyId: { type: 'string', maxLength: 36, ref: 'companies', default: '' },
    contactId: { type: 'string', maxLength: 36, ref: 'contacts', default: '' },
    roleId: { type: 'string', maxLength: 36, ref: 'roles', default: '' },

    eventTypeId: { type: 'string', maxLength: 36, ref: 'event_types' },

    occurredAt: { type: 'string', format: 'date-time', maxLength: 100 },
    summary: { type: ['string', 'null'], maxLength: 500 },
    details: { type: ['string', 'null'] },
    source: { type: 'string', enum: Object.values(SourceType) }, // Email, LinkedIn, etc.
    direction: { type: 'string', enum: Object.values(DirectionType) }, // Inbound, Outbound

    updatedAt: { type: 'string', format: 'date-time', maxLength: 30 },
    createdAt: { type: 'string', format: 'date-time', maxLength: 30 },
  },
  required: [
    'id',
    'occurredAt',
    'source',
    'direction',
    'eventTypeId',
    'companyId',
    'contactId',
    'roleId',
  ],
  indexes: ['companyId', 'contactId', 'roleId', 'occurredAt'],
};
