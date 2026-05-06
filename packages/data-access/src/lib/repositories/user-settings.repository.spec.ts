import { firstValueFrom, of } from 'rxjs';

import { TrackerDatabase } from '../database/db';

import { UserSettingsRepository } from './user-settings.repository';

describe('UserSettingsRepository', () => {
  let repository: UserSettingsRepository;
  let mockDb: {
    userSettings: {
      findOne: jest.Mock;
      insert: jest.Mock;
      upsert: jest.Mock;
    };
  };

  beforeEach(() => {
    mockDb = {
      userSettings: {
        findOne: jest.fn(),
        insert: jest.fn(),
        upsert: jest.fn(),
      },
    };
    repository = new UserSettingsRepository(mockDb as unknown as TrackerDatabase);
  });

  describe('get$', () => {
    it('should return null if settings not found', async () => {
      mockDb.userSettings.findOne.mockReturnValue({ $: of(null) });
      const result = await firstValueFrom(repository.get$());
      expect(result).toBeNull();
    });

    it('should return settings if found', async () => {
      const mockDoc = {
        id: 'current',
        showFullEventList: true,
        showInactiveRoles: false,
        toJSON: () => ({
          id: 'current',
          showFullEventList: true,
          showInactiveRoles: false,
        }),
      };
      mockDb.userSettings.findOne.mockReturnValue({ $: of(mockDoc) });
      const result = await firstValueFrom(repository.get$());
      expect(result).toEqual({
        id: 'current',
        showFullEventList: true,
        showInactiveRoles: false,
      });
    });
  });

  describe('update', () => {
    it('should create new settings if they do not exist', async () => {
      mockDb.userSettings.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      mockDb.userSettings.insert.mockImplementation((doc: unknown) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.update('current', {
        showFullEventList: true,
      });

      expect(mockDb.userSettings.insert).toHaveBeenCalled();
      expect(result.showFullEventList).toBe(true);
      expect(result.showInactiveRoles).toBe(false);
      expect(result.id).toBe('current');
    });

    it('should update existing settings', async () => {
      const existingDoc = {
        id: 'current',
        showFullEventList: false,
        showInactiveRoles: false,
        toJSON: () => ({
          id: 'current',
          showFullEventList: false,
          showInactiveRoles: false,
        }),
      };
      mockDb.userSettings.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingDoc),
      });
      mockDb.userSettings.upsert.mockImplementation((doc: unknown) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.update('current', {
        showFullEventList: true,
      });

      expect(mockDb.userSettings.upsert).toHaveBeenCalled();
      expect(result.showFullEventList).toBe(true);
    });
  });
});
