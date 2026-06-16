import { RxJsonSchema } from 'rxdb';

import { SourceTypeEntity } from './source-type.entity';

const SOURCE_TYPE_SCHEMA_VERSION = 0;

export const SourceTypeSchema: RxJsonSchema<SourceTypeEntity> = {
  title: 'source type schema',
  version: SOURCE_TYPE_SCHEMA_VERSION,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 36 },
    serverId: { type: ['number', 'null'] },

    name: { type: 'string', maxLength: 100 },
    isSystemDefined: { type: 'boolean' },

    updatedAt: { type: 'string', format: 'date-time', maxLength: 30 },
    createdAt: { type: 'string', format: 'date-time', maxLength: 30 },
  },
  required: ['id', 'name', 'isSystemDefined'],
  indexes: ['name'],
};
