import { act, renderHook } from '@testing-library/react';
import { of } from 'rxjs';

import * as dataAccess from '@job-tracker/data-access';
import { ReminderDTO } from '@job-tracker/validation';

import { useReminderActions, useReminderRepository, useReminders } from './reminder-hooks';

// Mock data-access
jest.mock('@job-tracker/data-access', () => ({
  useDb: jest.fn(),
  ReminderRepository: jest.fn().mockImplementation(() => ({
    getById$: jest.fn(),
    list$: jest.fn(),
    upsert: jest.fn(),
    deleteById: jest.fn(),
  })),
}));

describe('reminder-hooks', () => {
  const mockDb = {} as any;
  const mockReminder: ReminderDTO = {
    id: '1',
    title: 'Test Reminder',
    remindAt: new Date().toISOString(),
    version: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (dataAccess.useDb as jest.Mock).mockReturnValue(mockDb);
  });

  describe('useReminderRepository', () => {
    it('should return repository when db is available', () => {
      const { result } = renderHook(() => useReminderRepository());
      expect(result.current).toBeDefined();
    });
  });

  describe('useReminders', () => {
    it('should return reminders', () => {
      const mockRepo = {
        list$: jest.fn().mockReturnValue(of([mockReminder])),
      };
      (dataAccess.ReminderRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useReminders());
      expect(result.current.reminders).toEqual([mockReminder]);
    });
  });

  describe('useReminderActions', () => {
    it('should upsert reminder', async () => {
      const mockRepo = {
        upsert: jest.fn().mockResolvedValue({ id: '1' }),
      };
      (dataAccess.ReminderRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useReminderActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertReminder({
          title: 'New Reminder',
          remindAt: new Date().toISOString(),
        } as any);
      });

      expect(mockRepo.upsert).toHaveBeenCalled();
      expect(actionResult.success).toBe(true);
    });
  });
});
