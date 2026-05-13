import { firstValueFrom, of } from 'rxjs';

import { TrackerDatabase } from '../database/db';

import { ReminderRepository } from './reminder.repository';

describe('ReminderRepository', () => {
  let repository: ReminderRepository;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      reminders: {
        find: jest.fn(),
        findOne: jest.fn(),
        insert: jest.fn(),
        upsert: jest.fn(),
      },
    };
    repository = new ReminderRepository(mockDb as unknown as TrackerDatabase);
  });

  describe('list$', () => {
    it('should return list of reminders', async () => {
      const mockDocs = [
        {
          id: '1',
          remindAt: new Date().toISOString(),
          toJSON: () => ({ id: '1', remindAt: new Date().toISOString() }),
        },
      ];
      mockDb.reminders.find.mockReturnValue({ $: of(mockDocs) });

      const result = await firstValueFrom(repository.list$());
      expect(result).toHaveLength(1);
    });
  });

  describe('getByEventId', () => {
    it('should return reminder for an event', async () => {
      const mockDoc = {
        id: '1',
        eventId: 'e1',
        remindAt: new Date().toISOString(),
        toJSON: () => ({ id: '1', eventId: 'e1', remindAt: new Date().toISOString() }),
      };
      mockDb.reminders.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDoc) });

      const result = await repository.getByEventId('e1');
      expect(result?.eventId).toBe('e1');
    });
  });

  describe('create', () => {
    it('should insert new reminder', async () => {
      const input = { id: '1', remindAt: new Date() } as any;
      mockDb.reminders.insert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.create(input);
      expect(mockDb.reminders.insert).toHaveBeenCalled();
      expect(result.id).toBe('1');
    });
  });

  describe('deleteById', () => {
    it('should remove reminder if it exists', async () => {
      const mockDoc = { remove: jest.fn() };
      mockDb.reminders.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDoc) });

      const result = await repository.deleteById('1');
      expect(mockDoc.remove).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
