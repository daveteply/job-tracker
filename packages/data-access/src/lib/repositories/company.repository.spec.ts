import { firstValueFrom, of } from 'rxjs';

import { CompanyRepository } from './company.repository';

describe('CompanyRepository', () => {
  let repository: CompanyRepository;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      companies: {
        findOne: jest.fn().mockReturnValue({
          $: of({
            id: '1',
            name: 'Test Company',
            toJSON: () => ({ id: '1', name: 'Test Company' }),
          }),
          exec: jest.fn().mockResolvedValue({
            id: '1',
            name: 'Test Company',
            toJSON: () => ({ id: '1', name: 'Test Company' }),
          }),
        }),
        find: jest.fn().mockReturnValue({
          $: of([]),
          exec: jest.fn().mockResolvedValue([]),
        }),
      },
    };
    repository = new CompanyRepository(mockDb as any);
  });

  it('should get company by id as observable', async () => {
    const company = await firstValueFrom(repository.getById$('1'));
    expect(company).toBeDefined();
    expect(company?.name).toBe('Test Company');
    expect(mockDb.companies.findOne).toHaveBeenCalledWith('1');
  });

  it('should return null if company not found as observable', async () => {
    mockDb.companies.findOne.mockReturnValue({
      $: of(null),
    });
    const company = await firstValueFrom(repository.getById$('2'));
    expect(company).toBeNull();
  });
});
