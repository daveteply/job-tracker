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
    occurredAt: new Date().toISOString(),
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
    it('should upsert event', async () => {
      const mockEventRepo = {
        upsert: jest.fn().mockResolvedValue({ id: '1' }),
      };
      (dataAccess.EventRepository as jest.Mock).mockImplementation(() => mockEventRepo);
      (dataAccess.EventTypeRepository as jest.Mock).mockImplementation(() => ({
        getById: jest.fn().mockResolvedValue({}),
      }));
      (dataAccess.CompanyRepository as jest.Mock).mockImplementation(() => ({
        upsert: jest.fn().mockResolvedValue({ id: 'c1' }),
      }));
      (dataAccess.ContactRepository as jest.Mock).mockImplementation(() => ({
        upsert: jest.fn().mockResolvedValue({ id: 'co1' }),
      }));
      (dataAccess.RoleRepository as jest.Mock).mockImplementation(() => ({
        upsert: jest.fn().mockResolvedValue({ id: 'r1' }),
        getById: jest.fn().mockResolvedValue({}),
      }));
      (dataAccess.ReminderRepository as jest.Mock).mockImplementation(() => ({
        getByEventId: jest.fn(),
        upsert: jest.fn().mockResolvedValue({ id: 'rem1' }),
      }));

      const { result } = renderHook(() => useEventActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertEvent({
          occurredAt: new Date().toISOString(),
          eventTypeId: 'et1',
        } as any);
      });

      expect(mockEventRepo.upsert).toHaveBeenCalled();
      expect(actionResult.success).toBe(true);
    });
  });
});
