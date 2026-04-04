import { RoleStatus } from '@job-tracker/domain';

export interface RoleDocument {
  id: string;
  serverId: number | null;
  updatedAt: string;
  createdAt?: string;

  companyId?: string | null;

  title: string;
  jobPostingUrl?: string | null;
  location?: string | null;
  level?: string | null;
  salaryRange?: string | null;
  notes?: string | null;
  status: RoleStatus;
}
