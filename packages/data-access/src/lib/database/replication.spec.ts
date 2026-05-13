/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react';
import { replicateRxCollection } from 'rxdb/plugins/replication';
import { Subject } from 'rxjs';

import { useReplication } from './replication';

jest.mock('rxdb/plugins/replication', () => ({
  replicateRxCollection: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('useReplication', () => {
  let mockDb: any;
  let mockReplicationState: any;
  let active$: Subject<boolean>;
  let error$: Subject<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    active$ = new Subject<boolean>();
    error$ = new Subject<any>();

    mockReplicationState = {
      active$,
      error$,
      cancel: jest.fn(),
    };

    (replicateRxCollection as jest.Mock).mockReturnValue(mockReplicationState);

    mockDb = {
      collections: {
        companies: { name: 'companies' },
        eventTypes: { name: 'eventTypes' },
      },
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    // Clear localStorage
    localStorage.clear();
  });

  it('should return offline if no db or userId', () => {
    const { result, rerender } = renderHook(
      ({ db, userId }) => useReplication(db, userId, 'test@example.com'),
      {
        initialProps: { db: null as any, userId: undefined as string | undefined },
      },
    );

    expect(result.current).toBe('offline');

    rerender({ db: mockDb, userId: undefined });
    expect(result.current).toBe('offline');
  });

  it('should start replication and update status', async () => {
    const { result } = renderHook(() => useReplication(mockDb, 'user1', 'test@example.com'));

    expect(replicateRxCollection).toHaveBeenCalledTimes(1); // eventTypes is skipped
    expect(replicateRxCollection).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: mockDb.collections.companies,
      }),
    );

    active$.next(true);
    await waitFor(() => expect(result.current).toBe('syncing'));

    active$.next(false);
    await waitFor(() => expect(result.current).toBe('synced'));

    error$.next(new Error('Sync fail'));
    await waitFor(() => expect(result.current).toBe('error'));
  });

  it('should handle pull replication', async () => {
    renderHook(() => useReplication(mockDb, 'user1', 'test@example.com'));

    const { pull } = (replicateRxCollection as jest.Mock).mock.calls[0][0];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest
        .fn()
        .mockResolvedValue({ documents: [], checkpoint: { serverTimestamp: 123, id: '1' } }),
    });

    const result = await pull.handler({ serverTimestamp: 0, id: '0' }, 10);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/pull'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'X-User-Id': 'user1',
          'X-User-Email': 'test@example.com',
        }),
      }),
    );
    expect(result.checkpoint.serverTimestamp).toBe(123);
  });

  it('should handle push replication', async () => {
    renderHook(() => useReplication(mockDb, 'user1', 'test@example.com'));

    const { push } = (replicateRxCollection as jest.Mock).mock.calls[0][0];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });

    await push.handler([{ newDocumentState: { id: '1' }, assumedMasterState: undefined }]);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/push'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify([{ newDocumentState: { id: '1' }, assumedMasterState: undefined }]),
      }),
    );
  });

  it('should handle 403 Forbidden', async () => {
    renderHook(() => useReplication(mockDb, 'user1', 'test@example.com'));

    const { pull } = (replicateRxCollection as jest.Mock).mock.calls[0][0];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 403,
      ok: false,
    });

    await expect(pull.handler({ serverTimestamp: 0, id: '0' }, 10)).rejects.toThrow(
      'Not authorized for Beta',
    );
    expect(mockReplicationState.cancel).toHaveBeenCalled();
  });

  it('should handle other fetch errors', async () => {
    renderHook(() => useReplication(mockDb, 'user1', 'test@example.com'));

    const { pull } = (replicateRxCollection as jest.Mock).mock.calls[0][0];

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(pull.handler({ serverTimestamp: 0, id: '0' }, 10)).rejects.toThrow(
      'Network error',
    );
  });

  it('should cancel replication on unmount', () => {
    const { unmount } = renderHook(() => useReplication(mockDb, 'user1', 'test@example.com'));
    unmount();
    expect(mockReplicationState.cancel).toHaveBeenCalled();
  });
});
