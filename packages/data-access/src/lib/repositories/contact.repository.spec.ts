import { firstValueFrom, of } from 'rxjs';

import { ContactRepository } from './contact.repository';

describe('ContactRepository', () => {
  let repository: ContactRepository;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      contacts: {
        findOne: jest.fn().mockReturnValue({
          $: of({
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            toJSON: () => ({ id: '1', firstName: 'John', lastName: 'Doe' }),
          }),
        }),
      },
    };
    repository = new ContactRepository(mockDb as any);
  });

  it('should get contact by id as observable', async () => {
    const contact = await firstValueFrom(repository.getById$('1'));
    expect(contact).toBeDefined();
    expect(contact?.firstName).toBe('John');
    expect(mockDb.contacts.findOne).toHaveBeenCalledWith('1');
  });
});
