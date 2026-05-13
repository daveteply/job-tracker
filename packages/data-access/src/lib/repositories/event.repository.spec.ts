import { firstValueFrom, of } from 'rxjs';

import { DirectionType, SourceType } from '@job-tracker/domain';

import { TrackerDatabase } from '../database/db';

import { EventRepository } from './event.repository';

describe('EventRepository', () => {
  let repository: EventRepository;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      events: {
        find: jest.fn(),
        findOne: jest.fn(),
        insert: jest.fn(),
        upsert: jest.fn(),
      },
    };
    repository = new EventRepository(mockDb as unknown as TrackerDatabase);
  });

  describe('list$', () => {
    it('should return list of events', async () => {
      const mockDocs = [
        {
          id: '1',
          occurredAt: new Date().toISOString(),
          toJSON: () => ({
            id: '1',
            occurredAt: new Date().toISOString(),
            source: SourceType.Email,
            direction: DirectionType.Inbound,
          }),
        },
      ];
      mockDb.events.find.mockReturnValue({ $: of(mockDocs) });

      const result = await firstValueFrom(repository.list$());
      expect(result).toHaveLength(1);
    });
  });

  describe('listByRoleId$', () => {
    it('should return events for a role', async () => {
      const mockDocs = [
        {
          id: '1',
          roleId: 'r1',
          occurredAt: new Date().toISOString(),
          toJSON: () => ({
            id: '1',
            roleId: 'r1',
            occurredAt: new Date().toISOString(),
          }),
        },
      ];
      mockDb.events.find.mockReturnValue({ $: of(mockDocs) });

      const result = await firstValueFrom(repository.listByRoleId$('r1'));
      expect(result).toHaveLength(1);
      expect(mockDb.events.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: { roleId: 'r1' },
        }),
      );
    });
  });

  describe('listRecentEventTypeIds$', () => {
    it('should return unique event type ids', async () => {
      const mockDocs = [
        { eventTypeId: 'et1' },
        { eventTypeId: 'et2' },
        { eventTypeId: 'et1' },
        { eventTypeId: null },
      ];
      mockDb.events.find.mockReturnValue({ $: of(mockDocs) });

      const result = await firstValueFrom(repository.listRecentEventTypeIds$(10));
      expect(result).toEqual(['et1', 'et2']);
    });
  });

  describe('getById', () => {
    it('should get event by id', async () => {
      const mockDoc = {
        id: '1',
        toJSON: () => ({ id: '1', source: SourceType.Email, direction: DirectionType.Inbound }),
      };
      mockDb.events.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDoc) });

      const result = await repository.getById('1');
      expect(result).toBeDefined();
      expect(result?.id).toBe('1');
    });

    it('should return null if event not found', async () => {
      mockDb.events.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const result = await repository.getById('1');
      expect(result).toBeNull();
    });
  });

  describe('getById$', () => {
    it('should get event by id as observable', async () => {
      const mockDoc = {
        id: '1',
        toJSON: () => ({ id: '1', source: SourceType.Email, direction: DirectionType.Inbound }),
      };
      mockDb.events.findOne.mockReturnValue({ $: of(mockDoc) });

      const result = await firstValueFrom(repository.getById$('1'));
      expect(result).toBeDefined();
      expect(result?.id).toBe('1');
    });

    it('should return null if event not found as observable', async () => {
      mockDb.events.findOne.mockReturnValue({ $: of(null) });
      const result = await firstValueFrom(repository.getById$('1'));
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should insert new event', async () => {
      const input = { id: '1', occurredAt: new Date().toISOString() } as any;
      mockDb.events.insert.mockImplementation((doc: any) => Promise.resolve({ toJSON: () => doc }));

      const result = await repository.create(input);
      expect(mockDb.events.insert).toHaveBeenCalled();
      expect(result.id).toBe('1');
    });
  });

  describe('update', () => {
    it('should update existing event', async () => {
      const existingDoc = {
        id: '1',
        createdAt: '2023-01-01',
        toJSON: () => ({ id: '1', createdAt: '2023-01-01' }),
      };
      mockDb.events.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(existingDoc) });
      mockDb.events.upsert.mockImplementation((doc: any) => Promise.resolve({ toJSON: () => doc }));

      const result = await repository.update('1', { source: SourceType.LinkedIn });
      expect(result?.source).toBe(SourceType.LinkedIn);
      expect(mockDb.events.upsert).toHaveBeenCalled();
    });

    it('should return null if event to update not found', async () => {
      mockDb.events.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const result = await repository.update('1', { source: SourceType.LinkedIn });
      expect(result).toBeNull();
    });
  });

  describe('upsert', () => {
    it('should create if not exists', async () => {
      mockDb.events.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      mockDb.events.insert.mockImplementation((doc: any) => Promise.resolve({ toJSON: () => doc }));

      const result = await repository.upsert({ id: '1' });
      expect(result.id).toBe('1');
      expect(mockDb.events.insert).toHaveBeenCalled();
    });

    it('should update if exists', async () => {
      const existingDoc = {
        id: '1',
        createdAt: '2023-01-01',
        toJSON: () => ({ id: '1', createdAt: '2023-01-01' }),
      };
      mockDb.events.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(existingDoc) });
      mockDb.events.upsert.mockImplementation((doc: any) => Promise.resolve({ toJSON: () => doc }));

      const result = await repository.upsert({ id: '1' });
      expect(result.id).toBe('1');
      expect(mockDb.events.upsert).toHaveBeenCalled();
    });
  });

  describe('deleteById', () => {
    it('should remove event if it exists', async () => {
      const mockDoc = { remove: jest.fn() };
      mockDb.events.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDoc) });

      const result = await repository.deleteById('1');
      expect(mockDoc.remove).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if event not found', async () => {
      mockDb.events.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
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
