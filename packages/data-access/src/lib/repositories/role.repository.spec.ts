import { firstValueFrom, of } from 'rxjs';

import { RoleRepository } from './role.repository';

describe('RoleRepository', () => {
  let repository: RoleRepository;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      roles: {
        findOne: jest.fn().mockReturnValue({
          $: of({
            id: '1',
            title: 'Software Engineer',
            toJSON: () => ({ id: '1', title: 'Software Engineer' }),
          }),
        }),
      },
    };
    repository = new RoleRepository(mockDb as any);
  });

  it('should get role by id as observable', async () => {
    const role = await firstValueFrom(repository.getById$('1'));
    expect(role).toBeDefined();
    expect(role?.title).toBe('Software Engineer');
    expect(mockDb.roles.findOne).toHaveBeenCalledWith('1');
  });
});
