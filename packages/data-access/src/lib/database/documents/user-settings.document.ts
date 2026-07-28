export interface UserSettingsDocument {
  id: string;
  showFullEventList: boolean;
  showInactiveRoles: boolean;
  locale: string;
  appearance: 'light' | 'dark' | 'system';
  fabPosition: 'left' | 'right';
  eventExpandedStates?: Record<string, boolean>;
  updatedAt?: string;
  createdAt?: string;
}
