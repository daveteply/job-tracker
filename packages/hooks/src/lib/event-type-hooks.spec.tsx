import { act, renderHook } from '@testing-library/react';
import { of } from 'rxjs';

import * as dataAccess from '@job-tracker/data-access';
import { EventTypeDTO } from '@job-tracker/validation';

import {
  useEventTypeActions,
  useEventTypeRepository,
  useEventTypes,
  useEventTypeSearch,
} from './event-type-hooks';

// Mock data-access
jest.mock('@job-tracker/data-access', () => ({
  useDb: jest.fn(),
  EventTypeRepository: jest.fn().mockImplementation(() => ({
    getById$: jest.fn(),
    list$: jest.fn(),
    searchByName: jest.fn(),
    upsert: jest.fn(),
    deleteById: jest.fn(),
  })),
}));

describe('event-type-hooks', () => {
  const mockDb = {} as any;
  const mockEventType: EventTypeDTO = {
    id: '1',
    name: 'Test Event Type',
    category: 'Interview' as any,
    version: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (dataAccess.useDb as jest.Mock).mockReturnValue(mockDb);
  });

  describe('useEventTypeRepository', () => {
    it('should return repository when db is available', () => {
      const { result } = renderHook(() => useEventTypeRepository());
      expect(result.current).toBeDefined();
    });

    it('should return null when db is not available', () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useEventTypeRepository());
      expect(result.current).toBeNull();
    });
  });

  describe('useEventTypes', () => {
    it('should return event types', () => {
      const mockRepo = {
        list$: jest.fn().mockReturnValue(of([mockEventType])),
      };
      (dataAccess.EventTypeRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useEventTypes());
      expect(result.current.eventTypes).toEqual([mockEventType]);
      expect(result.current.loading).toBe(false);
    });

    it('should be loading when repository is not available', () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useEventTypes());
      expect(result.current.loading).toBe(true);
    });
  });

  describe('useEventTypeSearch', () => {
    it('should search event types', async () => {
      const mockRepo = {
        searchByName: jest.fn().mockResolvedValue([mockEventType]),
      };
      (dataAccess.EventTypeRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useEventTypeSearch());
      let searchResult: any;
      await act(async () => {
        searchResult = await result.current.searchEventTypes('test');
      });

      expect(mockRepo.searchByName).toHaveBeenCalledWith('test');
      expect(searchResult).toEqual([mockEventType]);
    });

    it('should return empty array when repository is not available', async () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useEventTypeSearch());
      let searchResult: any;
      await act(async () => {
        searchResult = await result.current.searchEventTypes('test');
      });
      expect(searchResult).toEqual([]);
    });
  });

  describe('useEventTypeActions', () => {
    it('should upsert event type', async () => {
      const mockRepo = {
        upsert: jest.fn().mockResolvedValue({ id: '1' }),
      };
      (dataAccess.EventTypeRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useEventTypeActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertEventType({ name: 'New ET' });
      });

      expect(mockRepo.upsert).toHaveBeenCalled();
      expect(actionResult.success).toBe(true);
    });

    it('should handle upsert error', async () => {
      const mockRepo = {
        upsert: jest.fn().mockRejectedValue(new Error('error')),
      };
      (dataAccess.EventTypeRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useEventTypeActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertEventType({ name: 'New ET' });
      });

      expect(actionResult.success).toBe(false);
    });

    it('should return error when name is missing', async () => {
      const { result } = renderHook(() => useEventTypeActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertEventType({});
      });
      expect(actionResult.success).toBe(false);
      expect(actionResult.message).toBe('Event Type name is required');
    });

    it('should return error when repository is not available for upsert', async () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useEventTypeActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.upsertEventType({ name: 'New ET' });
      });
      expect(actionResult.success).toBe(false);
    });

    it('should remove event type', async () => {
      const mockRepo = {
        deleteById: jest.fn().mockResolvedValue(undefined),
      };
      (dataAccess.EventTypeRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useEventTypeActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.removeEventType('1');
      });

      expect(mockRepo.deleteById).toHaveBeenCalledWith('1');
      expect(actionResult.success).toBe(true);
    });

    it('should handle remove error', async () => {
      const mockRepo = {
        deleteById: jest.fn().mockRejectedValue(new Error('error')),
      };
      (dataAccess.EventTypeRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useEventTypeActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.removeEventType('1');
      });

      expect(actionResult.success).toBe(false);
    });

    it('should return error when repository is not available for remove', async () => {
      (dataAccess.useDb as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useEventTypeActions());
      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.removeEventType('1');
      });
      expect(actionResult.success).toBe(false);
    });
  });
});
