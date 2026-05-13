import { firstValueFrom, of } from 'rxjs';

import { RoleRepository } from './role.repository';

describe('RoleRepository', () => {
  let repository: RoleRepository;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      roles: {
        findOne: jest.fn(),
        find: jest.fn(),
        insert: jest.fn(),
        upsert: jest.fn(),
      },
    };
    repository = new RoleRepository(mockDb as any);
  });

  describe('getById$', () => {
    it('should get role by id as observable', async () => {
      mockDb.roles.findOne.mockReturnValue({
        $: of({
          id: '1',
          title: 'Software Engineer',
          toJSON: () => ({ id: '1', title: 'Software Engineer', search: 'software engineer' }),
        }),
      });
      const role = await firstValueFrom(repository.getById$('1'));
      expect(role).toBeDefined();
      expect(role?.title).toBe('Software Engineer');
      expect(mockDb.roles.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('listByCompanyId$', () => {
    it('should return roles for a company', async () => {
      mockDb.roles.find.mockReturnValue({
        $: of([{ id: '1', title: 'Dev', toJSON: () => ({ id: '1', title: 'Dev' }) }]),
      });
      const result = await firstValueFrom(repository.listByCompanyId$('c1'));
      expect(result).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('should insert new role', async () => {
      mockDb.roles.insert.mockImplementation((doc: any) => Promise.resolve({ toJSON: () => doc }));
      const result = await repository.create({ id: '1', title: 'New Role' });
      expect(mockDb.roles.insert).toHaveBeenCalled();
      expect(result.title).toBe('New Role');
    });
  });

  describe('deleteById', () => {
    it('should remove role if it exists', async () => {
      const mockDoc = { remove: jest.fn() };
      mockDb.roles.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDoc) });
      const result = await repository.deleteById('1');
      expect(mockDoc.remove).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
