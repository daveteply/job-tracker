export interface UserSettingsDocument {
  id: string;
  showFullEventList: boolean;
  showInactiveRoles: boolean;
  locale: string;
  updatedAt?: string;
  createdAt?: string;
}
