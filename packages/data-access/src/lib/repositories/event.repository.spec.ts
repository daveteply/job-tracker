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

  describe('create', () => {
    it('should insert new event', async () => {
      const input = { id: '1', occurredAt: new Date() } as any;
      mockDb.events.insert.mockImplementation((doc: any) => Promise.resolve({ toJSON: () => doc }));

      const result = await repository.create(input);
      expect(mockDb.events.insert).toHaveBeenCalled();
      expect(result.id).toBe('1');
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
  });
});
