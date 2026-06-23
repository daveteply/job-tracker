export interface UserSettingsEntity {
  id: string; // Typically 'current' or 'global'
  showFullEventList: boolean;
  showInactiveRoles: boolean;
  locale: string;
  appearance: 'light' | 'dark' | 'system';
  fabPosition: 'left' | 'right';
  updatedAt?: string;
  createdAt?: string;
}
