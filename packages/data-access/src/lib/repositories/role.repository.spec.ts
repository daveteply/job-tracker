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
        count: jest.fn(),
      },
      events: {
        count: jest.fn(),
      },
    };
    repository = new RoleRepository(mockDb as any);
  });

  describe('list$', () => {
    it('should return all roles', async () => {
      mockDb.roles.find.mockReturnValue({
        $: of([
          {
            id: '1',
            title: 'Engineer',
            toJSON: () => ({ id: '1', title: 'Engineer' }),
          },
        ]),
      });
      const result = await firstValueFrom(repository.list$());
      expect(result).toHaveLength(1);
      expect(mockDb.roles.find).toHaveBeenCalled();
    });
  });

  describe('listByCompanyId$', () => {
    it('should return roles for a company', async () => {
      mockDb.roles.find.mockReturnValue({
        $: of([
          {
            id: '1',
            title: 'Dev',
            toJSON: () => ({ id: '1', title: 'Dev' }),
          },
        ]),
      });
      const result = await firstValueFrom(repository.listByCompanyId$('c1'));
      expect(result).toHaveLength(1);
      expect(mockDb.roles.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: { companyId: 'c1' },
        }),
      );
    });
  });

  describe('getById', () => {
    it('should get role by id', async () => {
      mockDb.roles.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          id: '1',
          title: 'Software Engineer',
          toJSON: () => ({ id: '1', title: 'Software Engineer' }),
        }),
      });
      const role = await repository.getById('1');
      expect(role).toBeDefined();
      expect(role?.title).toBe('Software Engineer');
    });

    it('should return null if role not found', async () => {
      mockDb.roles.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const role = await repository.getById('1');
      expect(role).toBeNull();
    });
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

    it('should return null if role not found as observable', async () => {
      mockDb.roles.findOne.mockReturnValue({ $: of(null) });
      const role = await firstValueFrom(repository.getById$('2'));
      expect(role).toBeNull();
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

  describe('update', () => {
    it('should update existing role', async () => {
      const existingDoc = {
        id: '1',
        title: 'Old',
        toJSON: () => ({ id: '1', title: 'Old' }),
      };
      mockDb.roles.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(existingDoc) });
      mockDb.roles.upsert.mockImplementation((doc: any) => Promise.resolve({ toJSON: () => doc }));

      const result = await repository.update('1', { title: 'New' });
      expect(result?.title).toBe('New');
    });

    it('should return null if role to update not found', async () => {
      mockDb.roles.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const result = await repository.update('1', { title: 'New' });
      expect(result).toBeNull();
    });
  });

  describe('upsert', () => {
    it('should create if not exists', async () => {
      mockDb.roles.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      mockDb.roles.insert.mockImplementation((doc: any) => Promise.resolve({ toJSON: () => doc }));

      const result = await repository.upsert({ id: '1', title: 'Upsert New' });
      expect(result.title).toBe('Upsert New');
      expect(mockDb.roles.insert).toHaveBeenCalled();
    });

    it('should update if exists', async () => {
      const existingDoc = {
        id: '1',
        title: 'Old',
        toJSON: () => ({ id: '1', title: 'Old' }),
      };
      mockDb.roles.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(existingDoc) });
      mockDb.roles.upsert.mockImplementation((doc: any) => Promise.resolve({ toJSON: () => doc }));

      const result = await repository.upsert({ id: '1', title: 'Upsert Updated' });
      expect(result.title).toBe('Upsert Updated');
      expect(mockDb.roles.upsert).toHaveBeenCalled();
    });
  });

  describe('searchByName', () => {
    it('should search roles by name', async () => {
      mockDb.roles.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([
          {
            id: '1',
            title: 'Engineer',
            toJSON: () => ({ id: '1', title: 'Engineer' }),
          },
        ]),
      });

      const result = await repository.searchByName('eng');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Engineer');
    });

    it('should search with companyId if provided', async () => {
      mockDb.roles.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      await repository.searchByName('eng', 10, 'c1');
      expect(mockDb.roles.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({ companyId: 'c1' }),
        }),
      );
    });

    it('should return empty array if query is empty', async () => {
      const result = await repository.searchByName('');
      expect(result).toHaveLength(0);
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

    it('should return false if role not found', async () => {
      mockDb.roles.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
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
      mockDb.events.count.mockReturnValue({ exec: jest.fn().mockResolvedValue(3) });

      const result = await repository.checkDeletionBlockers('1');
      expect(result).toEqual({
        events: 3,
        contacts: 0,
        roles: 0,
      });
    });
  });

  describe('subscribeToDeletionCheck', () => {
    it('should call callback with blockers and canDelete', (done) => {
      const roleDoc = { id: '1', title: 'T' };
      mockDb.roles.findOne.mockReturnValue({ $: of(roleDoc) });
      mockDb.events.count.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });

      repository.subscribeToDeletionCheck('1', (blockers, canDelete) => {
        expect(blockers).toEqual({ events: 0, contacts: 0, roles: 0 });
        expect(canDelete).toBe(true);
        done();
      });
    });

    it('should call callback with empty blockers if role not found', (done) => {
      mockDb.roles.findOne.mockReturnValue({ $: of(null) });

      repository.subscribeToDeletionCheck('1', (blockers, canDelete) => {
        expect(blockers).toEqual({ events: 0, contacts: 0, roles: 0 });
        expect(canDelete).toBe(false);
        done();
      });
    });
  });
});
