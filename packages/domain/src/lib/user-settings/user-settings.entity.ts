export interface UserSettingsEntity {
  id: string; // Typically 'current' or 'global'
  showFullEventList: boolean;
  showInactiveRoles: boolean;
  locale: string;
  updatedAt?: string;
  createdAt?: string;
}
