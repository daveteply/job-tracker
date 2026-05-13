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

  describe('getById$', () => {
    it('should get event type by id as observable', async () => {
      const mockDoc = {
        id: '1',
        name: 'Interview',
        toJSON: () => ({ id: '1', name: 'Interview', category: EventCategoryType.Interview }),
      };
      mockDb.eventTypes.findOne.mockReturnValue({ $: of(mockDoc) });

      const result = await firstValueFrom(repository.getById$('1'));
      expect(result).toBeDefined();
      expect(result?.name).toBe('Interview');
    });

    it('should return null if not found as observable', async () => {
      mockDb.eventTypes.findOne.mockReturnValue({ $: of(null) });
      const result = await firstValueFrom(repository.getById$('1'));
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

  describe('update', () => {
    it('should update existing event type', async () => {
      const existingDoc = {
        id: '1',
        name: 'Old',
        createdAt: '2023-01-01',
        toJSON: () => ({ id: '1', name: 'Old', createdAt: '2023-01-01' }),
      };
      mockDb.eventTypes.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(existingDoc) });
      mockDb.eventTypes.upsert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.update('1', { name: 'New' });
      expect(result?.name).toBe('New');
      expect(mockDb.eventTypes.upsert).toHaveBeenCalled();
    });

    it('should return null if event type to update not found', async () => {
      mockDb.eventTypes.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const result = await repository.update('1', { name: 'New' });
      expect(result).toBeNull();
    });
  });

  describe('upsert', () => {
    it('should create if not exists', async () => {
      mockDb.eventTypes.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      mockDb.eventTypes.insert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.upsert({ id: '1', name: 'Upsert New' });
      expect(result.name).toBe('Upsert New');
      expect(mockDb.eventTypes.insert).toHaveBeenCalled();
    });

    it('should update if exists', async () => {
      const existingDoc = {
        id: '1',
        name: 'Old',
        createdAt: '2023-01-01',
        toJSON: () => ({ id: '1', name: 'Old', createdAt: '2023-01-01' }),
      };
      mockDb.eventTypes.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(existingDoc) });
      mockDb.eventTypes.upsert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.upsert({ id: '1', name: 'Upsert Updated' });
      expect(result.name).toBe('Upsert Updated');
      expect(mockDb.eventTypes.upsert).toHaveBeenCalled();
    });
  });

  describe('searchByName', () => {
    it('should search event types by name', async () => {
      mockDb.eventTypes.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([
          {
            id: '1',
            name: 'Interview',
            toJSON: () => ({ id: '1', name: 'Interview' }),
          },
        ]),
      });

      const result = await repository.searchByName('inter');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Interview');
    });

    it('should return empty array if query is empty', async () => {
      const result = await repository.searchByName('');
      expect(result).toHaveLength(0);
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

  describe('remove', () => {
    it('should call deleteById', async () => {
      const spy = jest.spyOn(repository, 'deleteById').mockResolvedValue(true);
      await repository.remove('1');
      expect(spy).toHaveBeenCalledWith('1');
    });
  });
});
