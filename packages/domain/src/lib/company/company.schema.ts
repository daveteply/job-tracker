import { RxJsonSchema } from 'rxdb';

import { CompanyEntity } from './company.entity';

const COMPANY_SCHEMA_VERSION = 0;

export const CompanySchema: RxJsonSchema<CompanyEntity> = {
  title: 'company schema',
  version: COMPANY_SCHEMA_VERSION,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 36 },
    serverId: { type: ['number', 'null'] },

    name: { type: 'string', maxLength: 100 },
    search: { type: 'string', maxLength: 100 },
    website: { type: ['string', 'null'], maxLength: 2048 },
    industry: { type: ['string', 'null'], maxLength: 100 },
    sizeRange: { type: ['string', 'null'], maxLength: 100 },
    notes: { type: ['string', 'null'], maxLength: 2048 },
    version: { type: 'number', minimum: 0 },

    updatedAt: { type: 'string', format: 'date-time', maxLength: 30 },
    createdAt: { type: 'string', format: 'date-time', maxLength: 30 },
  },
  required: ['id', 'name', 'search'],
  indexes: ['name', 'search'],
};
