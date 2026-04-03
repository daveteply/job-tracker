import { RxJsonSchema } from 'rxdb';
import { EventCategoryType } from '../common/event-category-type';
import { EventTypeEntity } from './event-type.entity';

const EVENTTYPE_SCHEMA_VERSION = 0;

export const EventTypeSchema: RxJsonSchema<EventTypeEntity> = {
  title: 'event type schema',
  version: EVENTTYPE_SCHEMA_VERSION,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 36 },
    serverId: { type: ['number', 'null'] },

    name: { type: 'string' },
    category: { type: 'string', enum: Object.values(EventCategoryType) }, // Discovery, Networking, etc.
    isSystemDefined: { type: 'boolean' },

    updatedAt: { type: 'string', format: 'date-time', maxLength: 30 },
    createdAt: { type: 'string', format: 'date-time', maxLength: 30 },
  },
  required: ['id', 'name', 'category', 'isSystemDefined'],
};
