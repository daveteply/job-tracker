import { RxJsonSchema } from 'rxdb';
import { ContactEntity } from './contact.entity';

const CONTACT_SCHEMA_VERSION = 0;

export const ContactSchema: RxJsonSchema<ContactEntity> = {
  title: 'contact schema',
  version: CONTACT_SCHEMA_VERSION,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 36 },
    serverId: { type: ['number', 'null'] },

    companyId: { type: 'string', maxLength: 36, ref: 'companies', default: '' },

    firstName: { type: 'string', maxLength: 100 },
    lastName: { type: 'string', maxLength: 100 },
    title: { type: ['string', 'null'], maxLength: 100 },
    email: { type: ['string', 'null'], maxLength: 2048 },
    phoneNumber: { type: ['string', 'null'], maxLength: 30 },
    linkedInUrl: { type: ['string', 'null'], maxLength: 2048 },
    isPrimaryRecruiter: { type: 'boolean' },
    notes: { type: ['string', 'null'], maxLength: 2048 },

    updatedAt: { type: 'string', format: 'date-time', maxLength: 30 },
    createdAt: { type: 'string', format: 'date-time', maxLength: 30 },
  },
  required: ['id', 'firstName', 'lastName', 'companyId'],
  indexes: ['companyId'],
};
