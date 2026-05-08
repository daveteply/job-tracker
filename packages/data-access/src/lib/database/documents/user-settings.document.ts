export interface UserSettingsDocument {
  id: string;
  showFullEventList: boolean;
  showInactiveRoles: boolean;
  locale: string;
  appearance: 'light' | 'dark' | 'system';
  updatedAt?: string;
  createdAt?: string;
}
