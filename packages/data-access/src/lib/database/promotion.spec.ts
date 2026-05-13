import * as rxdb from 'rxdb';

import { GUEST_DB_NAME, promoteGuestToUser } from './promotion';
import * as rxDatabase from './rx-database';

jest.mock('rxdb', () => ({
  removeRxDatabase: jest.fn(),
}));

jest.mock('./rx-database', () => ({
  initRxDatabase: jest.fn(),
  getStorage: jest.fn(),
}));

describe('promotion', () => {
  let mockGuestDb: any;
  let mockTargetDb: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGuestDb = {
      collections: {
        companies: {
          count: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(1) }),
          exportJSON: jest.fn().mockResolvedValue({ name: 'companies', docs: [{ id: 'c1' }] }),
        },
        eventTypes: {
          count: jest.fn(),
        },
      },
      close: jest.fn().mockResolvedValue(undefined),
    };

    mockTargetDb = {
      collections: {
        companies: {
          importJSON: jest.fn().mockResolvedValue(undefined),
        },
      },
    };

    (rxDatabase.initRxDatabase as jest.Mock).mockResolvedValue(mockGuestDb);
    (rxDatabase.getStorage as jest.Mock).mockReturnValue({});
    (rxdb.removeRxDatabase as jest.Mock).mockResolvedValue(undefined);
  });

  it('should promote data from guest to user database', async () => {
    await promoteGuestToUser(mockTargetDb);

    expect(rxDatabase.initRxDatabase).toHaveBeenCalledWith(GUEST_DB_NAME);
    expect(mockGuestDb.collections.companies.exportJSON).toHaveBeenCalled();
    expect(mockTargetDb.collections.companies.importJSON).toHaveBeenCalled();
    expect(mockGuestDb.close).toHaveBeenCalled();
    expect(rxdb.removeRxDatabase).toHaveBeenCalled();
  });

  it('should skip eventTypes collection', async () => {
    await promoteGuestToUser(mockTargetDb);
    expect(mockGuestDb.collections.eventTypes.count).not.toHaveBeenCalled();
  });

  it('should skip empty collections', async () => {
    mockGuestDb.collections.companies.count.mockReturnValue({
      exec: jest.fn().mockResolvedValue(0),
    });
    await promoteGuestToUser(mockTargetDb);
    expect(mockGuestDb.collections.companies.exportJSON).not.toHaveBeenCalled();
  });

  it('should handle errors during promotion', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (rxDatabase.initRxDatabase as jest.Mock).mockRejectedValueOnce(new Error('Init fail'));

    await promoteGuestToUser(mockTargetDb);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('CRITICAL ERROR'),
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it('should close guest db if error occurs after init', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockGuestDb.collections.companies.count.mockReturnValue({
      exec: jest.fn().mockRejectedValue(new Error('Count fail')),
    });

    await promoteGuestToUser(mockTargetDb);

    expect(mockGuestDb.close).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should handle failure of guestDb.close() during cleanup', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    // Make it fail during collection processing
    mockGuestDb.collections.companies.count.mockReturnValue({
      exec: jest.fn().mockRejectedValue(new Error('Process fail')),
    });
    mockGuestDb.close.mockRejectedValue(new Error('Close fail'));

    await promoteGuestToUser(mockTargetDb);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to close guest database'),
      expect.any(Error),
    );

    consoleSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
