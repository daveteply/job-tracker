export interface UserSettingsEntity {
  id: string; // Typically 'current' or 'global'
  showFullEventList: boolean;
  updatedAt?: string;
  createdAt?: string;
}
