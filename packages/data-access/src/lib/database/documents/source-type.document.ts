export interface SourceTypeDocument {
  id: string;
  serverId: number | null;
  updatedAt: string;
  createdAt?: string;

  name: string;
  isSystemDefined: boolean;
}
