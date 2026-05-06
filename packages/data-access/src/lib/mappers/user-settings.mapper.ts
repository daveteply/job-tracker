import { UserSettingsDTO } from '@job-tracker/validation';

import { UserSettingsDocument } from '../database/documents/user-settings.document';

export class UserSettingsMapper {
  static toDto(doc: UserSettingsDocument): UserSettingsDTO {
    return {
      id: doc.id,
      showFullEventList: doc.showFullEventList,
      showInactiveRoles: doc.showInactiveRoles,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,
    };
  }

  static toDocument(dto: UserSettingsDTO): UserSettingsDocument {
    return {
      id: dto.id,
      showFullEventList: dto.showFullEventList,
      showInactiveRoles: dto.showInactiveRoles,
      updatedAt: dto.updatedAt,
      createdAt: dto.createdAt,
    };
  }
}
