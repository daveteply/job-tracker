import { RxJsonSchema } from 'rxdb';
import { RoleEntity } from './role.entity';
import { RoleStatus } from '../common/role-status-type';

const ROLE_SCHEMA_VERSION = 0;

export const RoleSchema: RxJsonSchema<RoleEntity> = {
  title: 'role schema',
  version: ROLE_SCHEMA_VERSION,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 36 },
    serverId: { type: ['number', 'null'] },

    companyId: { type: 'string', maxLength: 36, ref: 'companies', default: '' },

    title: { type: 'string', maxLength: 255 },
    jobPostingUrl: { type: ['string', 'null'], maxLength: 2048 },
    location: { type: ['string', 'null'], maxLength: 255 },
    level: { type: ['string', 'null'], maxLength: 100 },
    salaryRange: { type: ['string', 'null'], maxLength: 100 },
    notes: { type: ['string', 'null'], maxLength: 2048 },
    status: { type: 'string', enum: Object.values(RoleStatus) },

    updatedAt: { type: 'string', format: 'date-time', maxLength: 30 },
    createdAt: { type: 'string', format: 'date-time', maxLength: 30 },
  },
  required: ['id', 'title', 'companyId'],
  indexes: ['companyId'],
};
