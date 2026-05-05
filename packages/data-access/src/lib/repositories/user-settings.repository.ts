import { map, Observable } from 'rxjs';

import { createAuditTimestamps, createUpdatedAt } from '@job-tracker/app-logic';
import { UserSettingsDTO } from '@job-tracker/validation';

import { TrackerDatabase } from '../database/db';
import { UserSettingsMapper } from '../mappers/user-settings.mapper';

export class UserSettingsRepository {
  constructor(private readonly db: TrackerDatabase) {}

  get$(id = 'current'): Observable<UserSettingsDTO | null> {
    return this.db.userSettings
      .findOne(id)
      .$.pipe(map((doc) => (doc ? UserSettingsMapper.toDto(doc.toJSON()) : null)));
  }

  async getById(id = 'current'): Promise<UserSettingsDTO | null> {
    const doc = await this.db.userSettings.findOne(id).exec();
    if (!doc) return null;

    return UserSettingsMapper.toDto(doc.toJSON());
  }

  async update(id = 'current', settings: Partial<UserSettingsDTO>): Promise<UserSettingsDTO> {
    const existing = await this.db.userSettings.findOne(id).exec();

    if (!existing) {
      const timestamps = createAuditTimestamps();
      const newSettings: UserSettingsDTO = {
        id,
        showFullEventList: false,
        ...settings,
        ...timestamps,
      };
      const doc = UserSettingsMapper.toDocument(newSettings);
      const inserted = await this.db.userSettings.insert(doc);
      return UserSettingsMapper.toDto(inserted.toJSON());
    }

    const existingDto = UserSettingsMapper.toDto(existing.toJSON());
    const updatedDto: UserSettingsDTO = {
      ...existingDto,
      ...settings,
      id,
      updatedAt: createUpdatedAt(),
    };

    const doc = UserSettingsMapper.toDocument(updatedDto);
    const updated = await this.db.userSettings.upsert(doc);
    return UserSettingsMapper.toDto(updated.toJSON());
  }
}
