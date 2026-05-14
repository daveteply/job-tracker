import { upsertEntity } from './upsert';

describe('upsertEntity', () => {
  const options = {
    create: jest.fn(),
    update: jest.fn(),
    findExisting: jest.fn(),
    entityName: 'TestEntity',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create entity if it does not exist', async () => {
    const input = { id: '1', name: 'Test' };
    options.findExisting.mockResolvedValue(null);
    options.create.mockResolvedValue({ ...input, created: true });

    const result = await upsertEntity(input, options);

    expect(options.findExisting).toHaveBeenCalledWith('1');
    expect(options.create).toHaveBeenCalledWith(input);
    expect(options.update).not.toHaveBeenCalled();
    expect(result).toEqual({ ...input, created: true });
  });

  it('should update entity if it exists', async () => {
    const input = { id: '1', name: 'Updated' };
    options.findExisting.mockResolvedValue({ id: '1', name: 'Old' });
    options.update.mockResolvedValue({ ...input, updated: true });

    const result = await upsertEntity(input, options);

    expect(options.findExisting).toHaveBeenCalledWith('1');
    expect(options.update).toHaveBeenCalledWith('1', input);
    expect(options.create).not.toHaveBeenCalled();
    expect(result).toEqual({ ...input, updated: true });
  });

  it('should throw error if update fails (returns null)', async () => {
    const input = { id: '1', name: 'Updated' };
    options.findExisting.mockResolvedValue({ id: '1', name: 'Old' });
    options.update.mockResolvedValue(null);

    await expect(upsertEntity(input, options)).rejects.toThrow(
      'Failed to update TestEntity with id "1"',
    );
  });
});
