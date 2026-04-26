import { RxJsonSchema } from 'rxdb';

import { ReminderEntity } from './reminder.entity';

const REMINDER_SCHEMA_VERSION = 0;

export const ReminderSchema: RxJsonSchema<ReminderEntity> = {
  title: 'reminder schema',
  version: REMINDER_SCHEMA_VERSION,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 36 },
    serverId: { type: ['number', 'null'] },
    version: { type: 'number', minimum: 0 },

    eventId: { type: 'string', maxLength: 36, ref: 'events' },

    remindAt: { type: 'string', format: 'date-time', maxLength: 30 },
    completedAt: { type: ['string', 'null'], format: 'date-time' },

    updatedAt: { type: 'string', format: 'date-time', maxLength: 30 },
    createdAt: { type: 'string', format: 'date-time', maxLength: 30 },
  },
  required: ['id', 'remindAt'],
};
