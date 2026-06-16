export interface SourceTypeEntity {
  id: string;
  serverId: number | null;

  name: string;
  isSystemDefined: boolean;

  updatedAt?: string;
  createdAt?: string;
}
