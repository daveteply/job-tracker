export interface CompanyEntity {
  id: string;
  serverId: number | null;
  version: number;

  name: string;
  search: string;
  website?: string;
  industry?: string;
  sizeRange?: string;
  notes?: string;

  updatedAt?: string;
  createdAt?: string;
}
