export interface ContactDocument {
  id: string;
  serverId: number | null;
  updatedAt: string;
  createdAt?: string;

  companyId?: string | null;

  firstName: string;
  lastName: string;
  title: string | null;
  email: string | null;
  phoneNumber: string | null;
  linkedInUrl: string | null;
  isPrimaryRecruiter: boolean | null;
  notes: string | null;
}
