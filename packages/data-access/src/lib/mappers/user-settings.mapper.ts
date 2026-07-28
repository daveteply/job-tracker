import { UserSettingsDTO } from '@job-tracker/validation';

import { UserSettingsDocument } from '../database/documents/user-settings.document';

export class UserSettingsMapper {
  static toDto(doc: UserSettingsDocument): UserSettingsDTO {
    return {
      id: doc.id,
      showFullEventList: doc.showFullEventList,
      showInactiveRoles: doc.showInactiveRoles,
      locale: doc.locale,
      appearance: doc.appearance,
      fabPosition: doc.fabPosition,
      eventExpandedStates: doc.eventExpandedStates ?? {},
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,
    };
  }

  static toDocument(dto: UserSettingsDTO): UserSettingsDocument {
    return {
      id: dto.id,
      showFullEventList: dto.showFullEventList,
      showInactiveRoles: dto.showInactiveRoles,
      locale: dto.locale,
      appearance: dto.appearance,
      fabPosition: dto.fabPosition,
      eventExpandedStates: dto.eventExpandedStates ?? {},
      updatedAt: dto.updatedAt,
      createdAt: dto.createdAt,
    };
  }
}
