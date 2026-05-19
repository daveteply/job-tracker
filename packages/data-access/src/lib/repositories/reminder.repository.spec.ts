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

  describe('listByEventId$', () => {
    it('should return reminders for an event as observable', async () => {
      const mockDocs = [{ id: '1', eventId: 'e1', toJSON: () => ({ id: '1', eventId: 'e1' }) }];
      mockDb.reminders.find.mockReturnValue({ $: of(mockDocs) });

      const result = await firstValueFrom(repository.listByEventId$('e1'));
      expect(result).toHaveLength(1);
      expect(mockDb.reminders.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: { eventId: 'e1' },
        }),
      );
    });
  });

  describe('getById', () => {
    it('should get reminder by id', async () => {
      const mockDoc = { id: '1', toJSON: () => ({ id: '1' }) };
      mockDb.reminders.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDoc) });

      const result = await repository.getById('1');
      expect(result?.id).toBe('1');
    });

    it('should return null if reminder not found', async () => {
      mockDb.reminders.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const result = await repository.getById('1');
      expect(result).toBeNull();
    });
  });

  describe('getById$', () => {
    it('should get reminder by id as observable', async () => {
      const mockDoc = { id: '1', toJSON: () => ({ id: '1' }) };
      mockDb.reminders.findOne.mockReturnValue({ $: of(mockDoc) });

      const result = await firstValueFrom(repository.getById$('1'));
      expect(result?.id).toBe('1');
    });

    it('should return null if reminder not found as observable', async () => {
      mockDb.reminders.findOne.mockReturnValue({ $: of(null) });
      const result = await firstValueFrom(repository.getById$('1'));
      expect(result).toBeNull();
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

    it('should return null if reminder for event not found', async () => {
      mockDb.reminders.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const result = await repository.getByEventId('e1');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should insert new reminder', async () => {
      const input = { id: '1', remindAt: new Date().toISOString() } as any;
      mockDb.reminders.insert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.create(input);
      expect(mockDb.reminders.insert).toHaveBeenCalled();
      expect(result.id).toBe('1');
    });
  });

  describe('update', () => {
    it('should update existing reminder', async () => {
      const existingDoc = {
        id: '1',
        createdAt: '2023-01-01',
        toJSON: () => ({ id: '1', createdAt: '2023-01-01' }),
      };
      mockDb.reminders.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(existingDoc) });
      mockDb.reminders.upsert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.update('1', { remindAt: new Date() });
      expect(result?.id).toBe('1');
      expect(mockDb.reminders.upsert).toHaveBeenCalled();
    });

    it('should return null if reminder to update not found', async () => {
      mockDb.reminders.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const result = await repository.update('1', { remindAt: new Date() });
      expect(result).toBeNull();
    });
  });

  describe('upsert', () => {
    it('should create if not exists', async () => {
      mockDb.reminders.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      mockDb.reminders.insert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.upsert({ id: '1' });
      expect(result.id).toBe('1');
      expect(mockDb.reminders.insert).toHaveBeenCalled();
    });

    it('should update if exists', async () => {
      const existingDoc = {
        id: '1',
        createdAt: '2023-01-01',
        toJSON: () => ({ id: '1', createdAt: '2023-01-01' }),
      };
      mockDb.reminders.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(existingDoc) });
      mockDb.reminders.upsert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.upsert({ id: '1' });
      expect(result.id).toBe('1');
      expect(mockDb.reminders.upsert).toHaveBeenCalled();
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

    it('should return false if reminder not found', async () => {
      mockDb.reminders.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const result = await repository.deleteById('1');
      expect(result).toBe(false);
    });
  });
});
