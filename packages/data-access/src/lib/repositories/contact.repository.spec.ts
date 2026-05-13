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
      },
    };
    repository = new ContactRepository(mockDb as any);
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
  });

  describe('listByCompanyId$', () => {
    it('should return contacts for a company', async () => {
      mockDb.contacts.find.mockReturnValue({
        $: of([{ id: '1', firstName: 'J', lastName: 'D', toJSON: () => ({ id: '1', firstName: 'J', lastName: 'D' }) }]),
      });
      const result = await firstValueFrom(repository.listByCompanyId$('c1'));
      expect(result).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('should insert new contact', async () => {
      mockDb.contacts.insert.mockImplementation((doc: any) => Promise.resolve({ toJSON: () => doc }));
      const result = await repository.create({ id: '1', firstName: 'John', lastName: 'Doe' });
      expect(mockDb.contacts.insert).toHaveBeenCalled();
      expect(result.firstName).toBe('John');
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
  });
});
