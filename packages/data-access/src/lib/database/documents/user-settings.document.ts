export interface UserSettingsDocument {
  id: string;
  showFullEventList: boolean;
  showInactiveRoles: boolean;
  locale: string;
  appearance: 'light' | 'dark' | 'system';
  fabPosition: 'left' | 'right';
  updatedAt?: string;
  createdAt?: string;
}
