import { CompanyEntity } from '../company/company.entity';

export interface ContactEntity {
  id: string;
  serverId: number;

  companyId?: string | null;

  firstName: string;
  lastName: string;
  title?: string;
  email?: string;
  phoneNumber?: string;
  linkedInUrl?: string;
  isPrimaryRecruiter?: boolean;
  notes?: string;

  updatedAt?: string;
  createdAt?: string;
}

export interface ContactPopulatedEntity {
  company?: CompanyEntity;
}
