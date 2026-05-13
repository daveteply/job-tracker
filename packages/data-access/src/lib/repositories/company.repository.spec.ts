import { firstValueFrom, of } from 'rxjs';

import { CompanyRepository } from './company.repository';

describe('CompanyRepository', () => {
  let repository: CompanyRepository;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      companies: {
        findOne: jest.fn(),
        find: jest.fn(),
        insert: jest.fn(),
        upsert: jest.fn(),
        count: jest.fn(),
      },
      events: {
        count: jest.fn(),
      },
      contacts: {
        count: jest.fn(),
      },
      roles: {
        count: jest.fn(),
      },
    };
    repository = new CompanyRepository(mockDb as any);
  });

  describe('list$', () => {
    it('should return list of companies', async () => {
      mockDb.companies.find.mockReturnValue({
        $: of([{ id: '1', name: 'C1', toJSON: () => ({ id: '1', name: 'C1', search: 'c1' }) }]),
      });
      const result = await firstValueFrom(repository.list$());
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('C1');
    });
  });

  describe('getById', () => {
    it('should get company by id', async () => {
      mockDb.companies.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          id: '1',
          name: 'Test Company',
          toJSON: () => ({ id: '1', name: 'Test Company', search: 'test company' }),
        }),
      });
      const company = await repository.getById('1');
      expect(company).toBeDefined();
      expect(company?.name).toBe('Test Company');
      expect(mockDb.companies.findOne).toHaveBeenCalledWith('1');
    });

    it('should return null if company not found', async () => {
      mockDb.companies.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const company = await repository.getById('2');
      expect(company).toBeNull();
    });
  });

  describe('getById$', () => {
    it('should get company by id as observable', async () => {
      mockDb.companies.findOne.mockReturnValue({
        $: of({
          id: '1',
          name: 'Test Company',
          toJSON: () => ({ id: '1', name: 'Test Company', search: 'test company' }),
        }),
      });
      const company = await firstValueFrom(repository.getById$('1'));
      expect(company).toBeDefined();
      expect(company?.name).toBe('Test Company');
      expect(mockDb.companies.findOne).toHaveBeenCalledWith('1');
    });

    it('should return null if company not found as observable', async () => {
      mockDb.companies.findOne.mockReturnValue({ $: of(null) });
      const company = await firstValueFrom(repository.getById$('2'));
      expect(company).toBeNull();
    });
  });

  describe('create', () => {
    it('should insert new company', async () => {
      mockDb.companies.insert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );
      const result = await repository.create({ id: '1', name: 'New' });
      expect(mockDb.companies.insert).toHaveBeenCalled();
      expect(result.name).toBe('New');
    });
  });

  describe('update', () => {
    it('should update existing company', async () => {
      const existingDoc = {
        id: '1',
        name: 'Old Name',
        createdAt: '2023-01-01',
        toJSON: () => ({ id: '1', name: 'Old Name', createdAt: '2023-01-01' }),
      };
      mockDb.companies.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(existingDoc) });
      mockDb.companies.upsert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.update('1', { name: 'New Name' });
      expect(result?.name).toBe('New Name');
      expect(mockDb.companies.upsert).toHaveBeenCalled();
    });

    it('should return null if company to update not found', async () => {
      mockDb.companies.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const result = await repository.update('1', { name: 'New Name' });
      expect(result).toBeNull();
    });
  });

  describe('upsert', () => {
    it('should create if not exists', async () => {
      mockDb.companies.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      mockDb.companies.insert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.upsert({ id: '1', name: 'Upsert New' });
      expect(result.name).toBe('Upsert New');
      expect(mockDb.companies.insert).toHaveBeenCalled();
    });

    it('should update if exists', async () => {
      const existingDoc = {
        id: '1',
        name: 'Old',
        createdAt: '2023-01-01',
        toJSON: () => ({ id: '1', name: 'Old', createdAt: '2023-01-01' }),
      };
      mockDb.companies.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(existingDoc) });
      mockDb.companies.upsert.mockImplementation((doc: any) =>
        Promise.resolve({ toJSON: () => doc }),
      );

      const result = await repository.upsert({ id: '1', name: 'Upsert Updated' });
      expect(result.name).toBe('Upsert Updated');
      expect(mockDb.companies.upsert).toHaveBeenCalled();
    });
  });

  describe('searchByName', () => {
    it('should search companies by name', async () => {
      mockDb.companies.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([
          {
            id: '1',
            name: 'Apple',
            toJSON: () => ({ id: '1', name: 'Apple', search: 'apple' }),
          },
        ]),
      });

      const result = await repository.searchByName('app');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Apple');
      expect(mockDb.companies.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: { search: { $regex: 'app' } },
        }),
      );
    });

    it('should return empty array if query is empty', async () => {
      const result = await repository.searchByName('');
      expect(result).toHaveLength(0);
      expect(mockDb.companies.find).not.toHaveBeenCalled();
    });
  });

  describe('deleteById', () => {
    it('should remove company if it exists', async () => {
      const mockDoc = { remove: jest.fn() };
      mockDb.companies.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDoc) });
      const result = await repository.deleteById('1');
      expect(mockDoc.remove).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if company to delete not found', async () => {
      mockDb.companies.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
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
      mockDb.events.count.mockReturnValue({ exec: jest.fn().mockResolvedValue(1) });
      mockDb.contacts.count.mockReturnValue({ exec: jest.fn().mockResolvedValue(2) });
      mockDb.roles.count.mockReturnValue({ exec: jest.fn().mockResolvedValue(3) });

      const result = await repository.checkDeletionBlockers('1');
      expect(result).toEqual({
        events: 1,
        contacts: 2,
        roles: 3,
      });
    });
  });

  describe('subscribeToDeletionCheck', () => {
    it('should call callback with blockers and canDelete', (done) => {
      const companyDoc = { id: '1', name: 'Test' };
      mockDb.companies.findOne.mockReturnValue({ $: of(companyDoc) });
      mockDb.events.count.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });
      mockDb.contacts.count.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });
      mockDb.roles.count.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });

      repository.subscribeToDeletionCheck('1', (blockers, canDelete) => {
        expect(blockers).toEqual({ events: 0, contacts: 0, roles: 0 });
        expect(canDelete).toBe(true);
        done();
      });
    });

    it('should call callback with empty blockers if company not found', (done) => {
      mockDb.companies.findOne.mockReturnValue({ $: of(null) });

      repository.subscribeToDeletionCheck('1', (blockers, canDelete) => {
        expect(blockers).toEqual({ events: 0, contacts: 0, roles: 0 });
        expect(canDelete).toBe(false);
        done();
      });
    });
  });
});
