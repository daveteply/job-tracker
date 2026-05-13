import { act, renderHook } from '@testing-library/react';
import { of } from 'rxjs';

import * as dataAccess from '@job-tracker/data-access';
import { UserSettingsDTO } from '@job-tracker/validation';

import { useUserSettings, useUserSettingsRepository } from './user-settings-hooks';

// Mock data-access
jest.mock('@job-tracker/data-access', () => ({
  useDb: jest.fn(),
  UserSettingsRepository: jest.fn().mockImplementation(() => ({
    getById$: jest.fn(),
    update: jest.fn(),
  })),
}));

describe('user-settings-hooks', () => {
  const mockDb = {} as any;
  const mockSettings: UserSettingsDTO = {
    id: 'current',
    appearance: 'system',
    locale: 'en-US',
    showFullEventList: false,
    showInactiveRoles: false,
    version: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (dataAccess.useDb as jest.Mock).mockReturnValue(mockDb);
  });

  describe('useUserSettingsRepository', () => {
    it('should return repository when db is available', () => {
      const { result } = renderHook(() => useUserSettingsRepository());
      expect(result.current).toBeDefined();
    });
  });

  describe('useUserSettings', () => {
    it('should return user settings', () => {
      const mockRepo = new dataAccess.UserSettingsRepository(mockDb);
      (mockRepo.getById$ as jest.Mock).mockReturnValue(of(mockSettings));
      (dataAccess.UserSettingsRepository as jest.Mock).mockReturnValue(mockRepo);

      const { result } = renderHook(() => useUserSettings());
      expect(result.current.settings).toEqual(mockSettings);
    });

    it('should update settings', async () => {
      const mockRepo = new dataAccess.UserSettingsRepository(mockDb);
      (mockRepo.getById$ as jest.Mock).mockReturnValue(of(mockSettings));
      (dataAccess.UserSettingsRepository as jest.Mock).mockReturnValue(mockRepo);

      const { result } = renderHook(() => useUserSettings());
      await act(async () => {
        await result.current.updateSettings({ appearance: 'dark' });
      });

      expect(mockRepo.update).toHaveBeenCalledWith('current', { appearance: 'dark' });
    });
  });
});
