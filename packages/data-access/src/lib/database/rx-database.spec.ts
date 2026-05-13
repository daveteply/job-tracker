import { addRxPlugin, createRxDatabase } from 'rxdb';

import { getStorage, initRxDatabase } from './rx-database';
import * as seedData from './seed-data';

jest.mock('rxdb', () => ({
  createRxDatabase: jest.fn(),
  addRxPlugin: jest.fn(),
}));

jest.mock('rxdb/plugins/storage-dexie', () => ({
  getRxStorageDexie: jest.fn(() => ({})),
}));

jest.mock('rxdb/plugins/dev-mode', () => ({
  disableWarnings: jest.fn(),
  RxDBDevModePlugin: {},
}));

jest.mock('rxdb/plugins/json-dump', () => ({
  RxDBJsonDumpPlugin: {},
}));

jest.mock('rxdb/plugins/leader-election', () => ({
  RxDBLeaderElectionPlugin: {},
}));

jest.mock('rxdb/plugins/migration-schema', () => ({
  RxDBMigrationSchemaPlugin: {},
}));

jest.mock('rxdb/plugins/validate-ajv', () => ({
  wrappedValidateAjvStorage: jest.fn(({ storage }) => storage),
}));

describe('rx-database', () => {
  let mockDb: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Clear the global cache
    const _global = (typeof window !== 'undefined' ? window : global) as any;
    if (_global.__rxdb_promises) {
      _global.__rxdb_promises.clear();
    }

    mockDb = {
      name: 'test-db',
      addCollections: jest.fn().mockResolvedValue(undefined),
      eventTypes: {
        count: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(1) }),
        bulkInsert: jest.fn().mockResolvedValue(undefined),
      },
      userSettings: {
        count: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(1) }),
        insert: jest.fn().mockResolvedValue(undefined),
      },
      onClose: [],
      closed: false,
    };

    (createRxDatabase as jest.Mock).mockResolvedValue(mockDb);
  });

  it('should initialize the database', async () => {
    const db = await initRxDatabase('test-db');

    expect(db).toBe(mockDb);
    expect(createRxDatabase).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'test-db',
      }),
    );
    expect(mockDb.addCollections).toHaveBeenCalled();
  });

  it('should only call createRxDatabase once for concurrent initializations', async () => {
    const p1 = initRxDatabase('test-db');
    const p2 = initRxDatabase('test-db');

    const [db1, db2] = await Promise.all([p1, p2]);
    expect(db1).toBe(mockDb);
    expect(db2).toBe(mockDb);
    expect(createRxDatabase).toHaveBeenCalledTimes(1);
  });

  it('should seed data if eventTypes is empty', async () => {
    mockDb.eventTypes.count.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });

    await initRxDatabase('test-db-seed-event');

    expect(mockDb.eventTypes.bulkInsert).toHaveBeenCalled();
  });

  it('should seed userSettings if empty', async () => {
    mockDb.userSettings.count.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });

    await initRxDatabase('test-db-seed-settings');

    expect(mockDb.userSettings.insert).toHaveBeenCalled();
  });

  it('should remove promise from cache on close', async () => {
    await initRxDatabase('test-db-close');

    // Simulate close
    mockDb.closed = true;
    expect(mockDb.onClose.length).toBeGreaterThan(0);
    const onCloseCallback = mockDb.onClose[0];
    onCloseCallback();

    await initRxDatabase('test-db-close');
    expect(createRxDatabase).toHaveBeenCalledTimes(2);
  });

  it('should remove promise from cache on failure', async () => {
    (createRxDatabase as jest.Mock).mockRejectedValueOnce(new Error('Init failed'));

    await expect(initRxDatabase('fail-db')).rejects.toThrow('Init failed');

    (createRxDatabase as jest.Mock).mockResolvedValueOnce(mockDb);
    await initRxDatabase('fail-db');
    expect(createRxDatabase).toHaveBeenCalledTimes(2);
  });

  it('should use AJV validation in development', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    // Clear storage cache
    (global as any).__rxdb_storage = undefined;

    getStorage();

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle migration strategies in userSettings', async () => {
    await initRxDatabase('test-db-migration');

    const collectionsCall = mockDb.addCollections.mock.calls[0][0];
    const migration1 = collectionsCall.userSettings.migrationStrategies[1];
    const migration2 = collectionsCall.userSettings.migrationStrategies[2];

    const oldDoc1 = { id: '1' };
    const newDoc1 = migration1(oldDoc1);
    expect(newDoc1.locale).toBe('en-US');

    const oldDoc2 = { id: '1' };
    const newDoc2 = migration2(oldDoc2);
    expect(newDoc2.appearance).toBe('system');
  });
});
