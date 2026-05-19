import { act, renderHook } from '@testing-library/react';
import { of } from 'rxjs';

import * as dataAccess from '@job-tracker/data-access';
import { EventDTO } from '@job-tracker/validation';

import { useEventActions, useEventRepository, useEventsWithChildren } from './event-hooks';

// Mock data-access
jest.mock('@job-tracker/data-access', () => ({
  useDb: jest.fn(),
  EventRepository: jest.fn().mockImplementation(() => ({
    getById$: jest.fn(),
    list$: jest.fn(),
    listByRoleId$: jest.fn(),
    upsert: jest.fn(),
    deleteById: jest.fn(),
  })),
  EventTypeRepository: jest.fn().mockImplementation(() => ({
    list$: jest.fn(),
    getById: jest.fn(),
  })),
  CompanyRepository: jest.fn().mockImplementation(() => ({
    list$: jest.fn(),
    upsert: jest.fn(),
  })),
  ContactRepository: jest.fn().mockImplementation(() => ({
    list$: jest.fn(),
    upsert: jest.fn(),
  })),
  RoleRepository: jest.fn().mockImplementation(() => ({
    list$: jest.fn(),
    upsert: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
  })),
  ReminderRepository: jest.fn().mockImplementation(() => ({
    list$: jest.fn(),
    getByEventId: jest.fn(),
    upsert: jest.fn(),
    deleteById: jest.fn(),
  })),
}));

describe('event-hooks', () => {
  const mockDb = {} as any;
  const mockEvent: EventDTO = {
    id: '1',
    occurredAt: new Date(),
    eventTypeId: 'et1',
    companyId: 'c1',
    contactId: 'co1',
    roleId: 'r1',
    source: 'LinkedIn' as any,
    direction: 'Inbound' as any,
    version: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (dataAccess.useDb as jest.Mock).mockReturnValue(mockDb);
  });

  describe('useEventRepository', () => {
    it('should return repository when db is available', () => {
      const { result } = renderHook(() => useEventRepository());
      expect(result.current).toBeDefined();
    });
  });

  describe('useEventsWithChildren', () => {
    it('should return events', () => {
      const mockEventRepo = {
        list$: jest.fn().mockReturnValue(of([mockEvent])),
      };
      (dataAccess.EventRepository as jest.Mock).mockImplementation(() => mockEventRepo);
      (dataAccess.EventTypeRepository as jest.Mock).mockImplementation(() => ({
        list$: () => of([]),
      }));
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => ({
        list$: () => of([]),
      }));
      (dataAccess.ContactRepository as jest.Mock).mockImplementation(() => ({
        list$: () => of([]),
      }));
      (dataAccess.RoleRepository as jest.Mock).mockImplementation(() => ({ list$: () => of([]) }));
      (dataAccess.ReminderRepository as jest.Mock).mockImplementation(() => ({
        list$: () => of([]),
      }));

      const { result } = renderHook(() => useEventsWithChildren());
      expect(result.current.events).toHaveLength(1);
    });
  });

  describe('useEventActions', () => {
    it('should return error if database not initialized', async () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useEventActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertEvent({} as any);
      });
      expect(actionResult.success).toBe(false);
      expect(actionResult.message).toBe('Database not initialized');
    });

    it('should return error if eventTypeId is missing', async () => {
      const mockEventRepo = {
        upsert: jest.fn(),
      };
      (dataAccess.EventRepository as jest.Mock).mockImplementation(() => mockEventRepo);
      const { result } = renderHook(() => useEventActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertEvent({} as any);
      });
      expect(actionResult.success).toBe(false);
      expect(actionResult.message).toBe('Event type is required');
    });

    it('should upsert event and handle reminder', async () => {
      const mockEventRepo = {
        upsert: jest.fn().mockResolvedValue({ id: '1' }),
      };
      const mockReminderRepo = {
        getByEventId: jest.fn().mockResolvedValue({ id: 'rem1' }),
        upsert: jest.fn().mockResolvedValue({}),
      };
      (dataAccess.EventRepository as jest.Mock).mockImplementation(() => mockEventRepo);
      (dataAccess.ReminderRepository as jest.Mock).mockImplementation(() => mockReminderRepo);
      (dataAccess.EventTypeRepository as jest.Mock).mockImplementation(() => ({
        getById: jest.fn().mockResolvedValue({}),
      }));

      const { result } = renderHook(() => useEventActions());
      await act(async () => {
        await result.current.upsertEvent({
          id: '1',
          eventTypeId: 'et1',
          hasReminder: true,
          remindAt: new Date().toISOString(),
        } as any);
      });

      expect(mockEventRepo.upsert).toHaveBeenCalled();
      expect(mockReminderRepo.upsert).toHaveBeenCalled();
    });

    it('should delete reminder if hasReminder is false', async () => {
      const mockEventRepo = {
        upsert: jest.fn().mockResolvedValue({ id: '1' }),
      };
      const mockReminderRepo = {
        getByEventId: jest.fn().mockResolvedValue({ id: 'rem1' }),
        deleteById: jest.fn().mockResolvedValue(true),
      };
      (dataAccess.EventRepository as jest.Mock).mockImplementation(() => mockEventRepo);
      (dataAccess.ReminderRepository as jest.Mock).mockImplementation(() => mockReminderRepo);

      const { result } = renderHook(() => useEventActions());
      await act(async () => {
        await result.current.upsertEvent({
          id: '1',
          eventTypeId: 'et1',
          hasReminder: false,
        } as any);
      });

      expect(mockReminderRepo.deleteById).toHaveBeenCalledWith('rem1');
    });

    it('should handle error during upsert', async () => {
      const mockEventRepo = {
        upsert: jest.fn().mockRejectedValue(new Error('Fail')),
      };
      (dataAccess.EventRepository as jest.Mock).mockImplementation(() => mockEventRepo);
      const { result } = renderHook(() => useEventActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertEvent({ eventTypeId: 'et1' } as any);
      });
      expect(actionResult.success).toBe(false);
      expect(actionResult.message).toBe('Failed to save Event');
    });

    it('should remove event', async () => {
      const mockEventRepo = {
        deleteById: jest.fn().mockResolvedValue(true),
      };
      (dataAccess.EventRepository as jest.Mock).mockImplementation(() => mockEventRepo);
      const { result } = renderHook(() => useEventActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.removeEvent('1');
      });
      expect(actionResult.success).toBe(true);
      expect(mockEventRepo.deleteById).toHaveBeenCalledWith('1');
    });
  });
});
