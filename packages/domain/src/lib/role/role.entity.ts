import { RoleStatus } from '../common/role-status-type';
import { CompanyEntity } from '../company/company.entity';

export interface RoleEntity {
  id: string;
  serverId: number;

  companyId?: string | null;

  title: string;
  jobPostingUrl?: string;
  location?: string;
  level?: string;
  salaryRange?: string;
  notes?: string;
  status: RoleStatus;

  updatedAt?: string;
  createdAt?: string;
}

export interface RolePopulatedEntity {
  company?: CompanyEntity;
}
