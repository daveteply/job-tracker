import { firstValueFrom, of } from 'rxjs';

import { EventCategoryType } from '@job-tracker/domain';

import { TrackerDatabase } from '../database/db';

import { EventTypeRepository } from './event-type.repository';

describe('EventTypeRepository', () => {
  let repository: EventTypeRepository;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      eventTypes: {
        find: jest.fn(),
        findOne: jest.fn(),
        insert: jest.fn(),
        upsert: jest.fn(),
      },
    };
    repository = new EventTypeRepository(mockDb as unknown as TrackerDatabase);
  });

  describe('list$', () => {
    it('should return list of event types', async () => {
      const mockDocs = [
        {
          id: '1',
          name: 'Interview',
          toJSON: () => ({ id: '1', name: 'Interview', category: EventCategoryType.Interview }),
        },
      ];
      mockDb.eventTypes.find.mockReturnValue({ $: of(mockDocs) });

      const result = await firstValueFrom(repository.list$());
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Interview');
    });
  });

  describe('getById', () => {
    it('should return event type by id', async () => {
      const mockDoc = {
        id: '1',
        name: 'Interview',
        toJSON: () => ({ id: '1', name: 'Interview', category: EventCategoryType.Interview }),
      };
      mockDb.eventTypes.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDoc) });

      const result = await repository.getById('1');
      expect(result?.name).toBe('Interview');
    });

    it('should return null if not found', async () => {
      mockDb.eventTypes.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const result = await repository.getById('1');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should insert new event type', async () => {
      const input = { id: '1', name: 'New Event' };
      mockDb.eventTypes.insert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.create(input);
      expect(mockDb.eventTypes.insert).toHaveBeenCalled();
      expect(result.name).toBe('New Event');
    });
  });

  describe('deleteById', () => {
    it('should remove event type if it exists', async () => {
      const mockDoc = { remove: jest.fn() };
      mockDb.eventTypes.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDoc) });

      const result = await repository.deleteById('1');
      expect(mockDoc.remove).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if event type does not exist', async () => {
      mockDb.eventTypes.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const result = await repository.deleteById('1');
      expect(result).toBe(false);
    });
  });
});
