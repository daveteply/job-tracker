import { firstValueFrom, of } from 'rxjs';

import { ContactRepository } from './contact.repository';

describe('ContactRepository', () => {
  let repository: ContactRepository;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      contacts: {
        findOne: jest.fn(),
        find: jest.fn(),
        insert: jest.fn(),
        upsert: jest.fn(),
        count: jest.fn(),
      },
      events: {
        count: jest.fn(),
      },
    };
    repository = new ContactRepository(mockDb as any);
  });

  describe('list$', () => {
    it('should return all contacts', async () => {
      mockDb.contacts.find.mockReturnValue({
        $: of([
          {
            id: '1',
            firstName: 'A',
            lastName: 'B',
            toJSON: () => ({ id: '1', firstName: 'A', lastName: 'B' }),
          },
        ]),
      });
      const result = await firstValueFrom(repository.list$());
      expect(result).toHaveLength(1);
      expect(mockDb.contacts.find).toHaveBeenCalled();
    });
  });

  describe('listByCompanyId$', () => {
    it('should return contacts for a company', async () => {
      mockDb.contacts.find.mockReturnValue({
        $: of([
          {
            id: '1',
            firstName: 'J',
            lastName: 'D',
            toJSON: () => ({ id: '1', firstName: 'J', lastName: 'D' }),
          },
        ]),
      });
      const result = await firstValueFrom(repository.listByCompanyId$('c1'));
      expect(result).toHaveLength(1);
      expect(mockDb.contacts.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: { companyId: 'c1' },
        }),
      );
    });
  });

  describe('getById', () => {
    it('should get contact by id', async () => {
      mockDb.contacts.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          toJSON: () => ({ id: '1', firstName: 'John', lastName: 'Doe' }),
        }),
      });
      const contact = await repository.getById('1');
      expect(contact).toBeDefined();
      expect(contact?.firstName).toBe('John');
    });

    it('should return null if contact not found', async () => {
      mockDb.contacts.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const contact = await repository.getById('1');
      expect(contact).toBeNull();
    });
  });

  describe('getById$', () => {
    it('should get contact by id as observable', async () => {
      mockDb.contacts.findOne.mockReturnValue({
        $: of({
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          toJSON: () => ({ id: '1', firstName: 'John', lastName: 'Doe', search: 'john doe' }),
        }),
      });
      const contact = await firstValueFrom(repository.getById$('1'));
      expect(contact).toBeDefined();
      expect(contact?.firstName).toBe('John');
      expect(mockDb.contacts.findOne).toHaveBeenCalledWith('1');
    });

    it('should return null if contact not found as observable', async () => {
      mockDb.contacts.findOne.mockReturnValue({ $: of(null) });
      const contact = await firstValueFrom(repository.getById$('2'));
      expect(contact).toBeNull();
    });
  });

  describe('create', () => {
    it('should insert new contact', async () => {
      mockDb.contacts.insert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );
      const result = await repository.create({ id: '1', firstName: 'John', lastName: 'Doe' });
      expect(mockDb.contacts.insert).toHaveBeenCalled();
      expect(result.firstName).toBe('John');
    });
  });

  describe('update', () => {
    it('should update existing contact', async () => {
      const existingDoc = {
        id: '1',
        firstName: 'Old',
        lastName: 'Name',
        toJSON: () => ({ id: '1', firstName: 'Old', lastName: 'Name' }),
      };
      mockDb.contacts.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(existingDoc) });
      mockDb.contacts.upsert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.update('1', { firstName: 'New' });
      expect(result?.firstName).toBe('New');
      expect(result?.lastName).toBe('Name');
    });

    it('should return null if contact to update not found', async () => {
      mockDb.contacts.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const result = await repository.update('1', { firstName: 'New' });
      expect(result).toBeNull();
    });
  });

  describe('upsert', () => {
    it('should create if not exists', async () => {
      mockDb.contacts.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      mockDb.contacts.insert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.upsert({ id: '1', firstName: 'U', lastName: 'N' });
      expect(result.firstName).toBe('U');
      expect(mockDb.contacts.insert).toHaveBeenCalled();
    });

    it('should update if exists', async () => {
      const existingDoc = {
        id: '1',
        firstName: 'Old',
        lastName: 'Name',
        toJSON: () => ({ id: '1', firstName: 'Old', lastName: 'Name' }),
      };
      mockDb.contacts.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(existingDoc) });
      mockDb.contacts.upsert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.upsert({ id: '1', firstName: 'U', lastName: 'N' });
      expect(result.firstName).toBe('U');
      expect(mockDb.contacts.upsert).toHaveBeenCalled();
    });
  });

  describe('searchByName', () => {
    it('should search contacts by name', async () => {
      mockDb.contacts.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            toJSON: () => ({ id: '1', firstName: 'John', lastName: 'Doe' }),
          },
        ]),
      });

      const result = await repository.searchByName('john');
      expect(result).toHaveLength(1);
      expect(result[0].firstName).toBe('John');
    });

    it('should return empty array if query is empty', async () => {
      const result = await repository.searchByName('');
      expect(result).toHaveLength(0);
    });
  });

  describe('deleteById', () => {
    it('should remove contact if it exists', async () => {
      const mockDoc = { remove: jest.fn() };
      mockDb.contacts.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDoc) });
      const result = await repository.deleteById('1');
      expect(mockDoc.remove).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if contact not found', async () => {
      mockDb.contacts.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
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

  describe('checkDeletionBlockers', () => {
    it('should return counts of related entities', async () => {
      mockDb.events.count.mockReturnValue({ exec: jest.fn().mockResolvedValue(5) });

      const result = await repository.checkDeletionBlockers('1');
      expect(result).toEqual({
        events: 5,
        contacts: 0,
        roles: 0,
      });
    });
  });

  describe('subscribeToDeletionCheck', () => {
    it('should call callback with blockers and canDelete', (done) => {
      const contactDoc = { id: '1', firstName: 'T' };
      mockDb.contacts.findOne.mockReturnValue({ $: of(contactDoc) });
      mockDb.events.count.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });

      repository.subscribeToDeletionCheck('1', (blockers, canDelete) => {
        expect(blockers).toEqual({ events: 0, contacts: 0, roles: 0 });
        expect(canDelete).toBe(true);
        done();
      });
    });

    it('should call callback with empty blockers if contact not found', (done) => {
      mockDb.contacts.findOne.mockReturnValue({ $: of(null) });

      repository.subscribeToDeletionCheck('1', (blockers, canDelete) => {
        expect(blockers).toEqual({ events: 0, contacts: 0, roles: 0 });
        expect(canDelete).toBe(false);
        done();
      });
    });
  });
});
