export interface CompanyDocument {
  id: string;
  serverId: number | null;
  version: number;
  updatedAt: string;
  createdAt?: string;

  name: string;
  search: string;
  website: string | null;
  industry: string | null;
  sizeRange: string | null;
  notes: string | null;
}
