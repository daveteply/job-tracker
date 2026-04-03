export interface CompanyEntity {
  id: string;
  serverId: number;

  name: string;
  website?: string;
  industry?: string;
  sizeRange?: string;
  notes?: string;

  updatedAt?: string;
  createdAt?: string;
}
