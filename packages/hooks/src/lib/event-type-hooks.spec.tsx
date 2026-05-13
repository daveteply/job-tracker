import { renderHook } from '@testing-library/react';
import { of } from 'rxjs';

import * as dataAccess from '@job-tracker/data-access';
import { EventTypeDTO } from '@job-tracker/validation';

import { useEventTypeRepository, useEventTypes } from './event-type-hooks';

// Mock data-access
jest.mock('@job-tracker/data-access', () => ({
  useDb: jest.fn(),
  EventTypeRepository: jest.fn().mockImplementation(() => ({
    getById$: jest.fn(),
    list$: jest.fn(),
  })),
}));

describe('event-type-hooks', () => {
  const mockDb = {} as any;
  const mockEventType: EventTypeDTO = {
    id: '1',
    name: 'Test Event Type',
    category: 'Application' as any,
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
  });

  describe('useEventTypes', () => {
    it('should return event types', () => {
      const mockRepo = {
        list$: jest.fn().mockReturnValue(of([mockEventType])),
      };
      (dataAccess.EventTypeRepository as jest.Mock).mockImplementation(() => mockRepo);

      const { result } = renderHook(() => useEventTypes());
      expect(result.current.eventTypes).toEqual([mockEventType]);
    });
  });
});
