export interface CompanyDocument {
  id: string;
  serverId: number | null;
  updatedAt: string;
  createdAt?: string;

  name: string;
  website: string | null;
  industry: string | null;
  sizeRange: string | null;
  notes: string | null;
}
