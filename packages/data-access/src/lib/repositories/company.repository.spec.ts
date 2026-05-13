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
      },
    };
    repository = new CompanyRepository(mockDb as any);
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

  describe('list$', () => {
    it('should return list of companies', async () => {
      mockDb.companies.find.mockReturnValue({
        $: of([{ id: '1', name: 'C1', toJSON: () => ({ id: '1', name: 'C1', search: 'c1' }) }]),
      });
      const result = await firstValueFrom(repository.list$());
      expect(result).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('should insert new company', async () => {
      mockDb.companies.insert.mockImplementation((doc: any) => Promise.resolve({ toJSON: () => doc }));
      const result = await repository.create({ id: '1', name: 'New' });
      expect(mockDb.companies.insert).toHaveBeenCalled();
      expect(result.name).toBe('New');
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
  });
});
