import { RxJsonSchema } from 'rxdb';

import { UserSettingsEntity } from './user-settings.entity';

const USER_SETTINGS_SCHEMA_VERSION = 2;

export const UserSettingsSchema: RxJsonSchema<UserSettingsEntity> = {
  title: 'user settings schema',
  version: USER_SETTINGS_SCHEMA_VERSION,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 36 },
    showFullEventList: { type: 'boolean', default: false },
    showInactiveRoles: { type: 'boolean', default: false },
    locale: { type: 'string', maxLength: 10, default: 'en-US' },
    appearance: {
      type: 'string',
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    updatedAt: { type: 'string', format: 'date-time', maxLength: 30 },
    createdAt: { type: 'string', format: 'date-time', maxLength: 30 },
  },
  required: ['id', 'showFullEventList', 'showInactiveRoles', 'locale', 'appearance'],
};
