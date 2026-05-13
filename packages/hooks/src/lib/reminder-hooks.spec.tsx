import { act, renderHook } from '@testing-library/react';
import { of } from 'rxjs';

import * as dataAccess from '@job-tracker/data-access';
import { ReminderDTO } from '@job-tracker/validation';

import {
  useReminder,
  useReminderActions,
  useReminderRepository,
  useReminders,
  useRemindersWithChildren,
} from './reminder-hooks';

// Mock data-access
jest.mock('@job-tracker/data-access', () => ({
  useDb: jest.fn(),
  ReminderRepository: jest.fn().mockImplementation(() => ({
    getById$: jest.fn(),
    list$: jest.fn(),
    upsert: jest.fn(),
    deleteById: jest.fn(),
    update: jest.fn(),
  })),
  EventRepository: jest.fn().mockImplementation(() => ({
    list$: jest.fn(),
  })),
  EventTypeRepository: jest.fn().mockImplementation(() => ({
    list$: jest.fn(),
  })),
  CompanyRepository: jest.fn().mockImplementation(() => ({
    list$: jest.fn(),
  })),
  ContactRepository: jest.fn().mockImplementation(() => ({
    list$: jest.fn(),
  })),
  RoleRepository: jest.fn().mockImplementation(() => ({
    list$: jest.fn(),
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

    it('should return null when db is not available', () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useReminderRepository());
      expect(result.current).toBeNull();
    });
  });

  describe('useReminder', () => {
    it('should return reminder', () => {
      const mockRepo = {
        getById$: jest.fn().mockReturnValue(of(mockReminder)),
      };
      (dataAccess.ReminderRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useReminder('1'));
      expect(result.current.reminder).toEqual(mockReminder);
      expect(result.current.loading).toBe(false);
    });

    it('should be loading when repository is not available', () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useReminder('1'));
      expect(result.current.loading).toBe(true);
      expect(result.current.reminder).toBeNull();
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
      expect(result.current.loading).toBe(false);
    });

    it('should be loading when repository is not available', () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useReminders());
      expect(result.current.loading).toBe(true);
      expect(result.current.reminders).toEqual([]);
    });
  });

  describe('useRemindersWithChildren', () => {
    it('should return reminders with children', () => {
      const mockReminderWithEvent = { ...mockReminder, eventId: 'event1' };
      const mockEvent = { id: 'event1', title: 'Test Event', eventTypeId: 'et1', companyId: 'c1', contactId: 'co1', roleId: 'r1' };
      const mockEventType = { id: 'et1', name: 'Test ET' };
      const mockCompany = { id: 'c1', name: 'Test Company' };
      const mockContact = { id: 'co1', name: 'Test Contact' };
      const mockRole = { id: 'r1', name: 'Test Role' };

      (dataAccess.ReminderRepository as jest.Mock).mockImplementation(() => ({
        list$: jest.fn().mockReturnValue(of([mockReminderWithEvent])),
      }));
      (dataAccess.EventRepository as jest.Mock).mockImplementation(() => ({
        list$: jest.fn().mockReturnValue(of([mockEvent])),
      }));
      (dataAccess.EventTypeRepository as jest.Mock).mockImplementation(() => ({
        list$: jest.fn().mockReturnValue(of([mockEventType])),
      }));
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => ({
        list$: jest.fn().mockReturnValue(of([mockCompany])),
      }));
      (dataAccess.ContactRepository as jest.Mock).mockImplementation(() => ({
        list$: jest.fn().mockReturnValue(of([mockContact])),
      }));
      (dataAccess.RoleRepository as jest.Mock).mockImplementation(() => ({
        list$: jest.fn().mockReturnValue(of([mockRole])),
      }));

      const { result } = renderHook(() => useRemindersWithChildren());
      
      expect(result.current.reminders).toHaveLength(1);
      const reminder = result.current.reminders[0];
      expect(reminder.event).toBeDefined();
      expect(reminder.event?.eventType).toEqual(mockEventType);
      expect(reminder.event?.company).toEqual(mockCompany);
      expect(reminder.event?.contact).toEqual(mockContact);
      expect(reminder.event?.role).toEqual(mockRole);
    });

    it('should handle missing children', () => {
      const mockReminderWithEvent = { ...mockReminder, eventId: 'event1' };
      const mockEvent = { id: 'event1', title: 'Test Event' };

      (dataAccess.ReminderRepository as jest.Mock).mockImplementation(() => ({
        list$: jest.fn().mockReturnValue(of([mockReminderWithEvent])),
      }));
      (dataAccess.EventRepository as jest.Mock).mockImplementation(() => ({
        list$: jest.fn().mockReturnValue(of([mockEvent])),
      }));
      (dataAccess.EventTypeRepository as jest.Mock).mockImplementation(() => ({
        list$: jest.fn().mockReturnValue(of([])),
      }));
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => ({
        list$: jest.fn().mockReturnValue(of([])),
      }));
      (dataAccess.ContactRepository as jest.Mock).mockImplementation(() => ({
        list$: jest.fn().mockReturnValue(of([])),
      }));
      (dataAccess.RoleRepository as jest.Mock).mockImplementation(() => ({
        list$: jest.fn().mockReturnValue(of([])),
      }));

      const { result } = renderHook(() => useRemindersWithChildren());
      
      expect(result.current.reminders[0].event?.eventType).toBeNull();
    });

    it('should be loading when db is not available', () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useRemindersWithChildren());
      expect(result.current.loading).toBe(true);
      expect(result.current.reminders).toEqual([]);
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

    it('should handle upsert error', async () => {
      const mockRepo = {
        upsert: jest.fn().mockRejectedValue(new Error('error')),
      };
      (dataAccess.ReminderRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useReminderActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertReminder(mockReminder);
      });

      expect(actionResult.success).toBe(false);
    });

    it('should return error when repository is not available for upsert', async () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useReminderActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertReminder(mockReminder);
      });
      expect(actionResult.success).toBe(false);
      expect(actionResult.message).toBe('Database not initialized');
    });

    it('should remove reminder', async () => {
      const mockRepo = {
        deleteById: jest.fn().mockResolvedValue(undefined),
      };
      (dataAccess.ReminderRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useReminderActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.removeReminder('1');
      });

      expect(mockRepo.deleteById).toHaveBeenCalledWith('1');
      expect(actionResult.success).toBe(true);
    });

    it('should handle remove error', async () => {
      const mockRepo = {
        deleteById: jest.fn().mockRejectedValue(new Error('error')),
      };
      (dataAccess.ReminderRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useReminderActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.removeReminder('1');
      });

      expect(actionResult.success).toBe(false);
    });

    it('should return error when repository is not available for remove', async () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useReminderActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.removeReminder('1');
      });
      expect(actionResult.success).toBe(false);
    });

    it('should complete reminder', async () => {
      const mockRepo = {
        update: jest.fn().mockResolvedValue(undefined),
      };
      (dataAccess.ReminderRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useReminderActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.completeReminder('1');
      });

      expect(mockRepo.update).toHaveBeenCalled();
      expect(actionResult.success).toBe(true);
    });

    it('should handle complete error', async () => {
      const mockRepo = {
        update: jest.fn().mockRejectedValue(new Error('error')),
      };
      (dataAccess.ReminderRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useReminderActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.completeReminder('1');
      });

      expect(actionResult.success).toBe(false);
    });

    it('should return error when repository is not available for complete', async () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useReminderActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.completeReminder('1');
      });
      expect(actionResult.success).toBe(false);
    });
  });
});
