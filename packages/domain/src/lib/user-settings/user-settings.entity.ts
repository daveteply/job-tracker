export interface UserSettingsEntity {
  id: string; // Typically 'current' or 'global'
  showFullEventList: boolean;
  showInactiveRoles: boolean;
  updatedAt?: string;
  createdAt?: string;
}
