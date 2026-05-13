import { act, renderHook } from '@testing-library/react';

import { BRANDING } from '@job-tracker/domain';

import { useBetaApproved } from './beta-hooks';

describe('useBetaApproved', () => {
  const BETA_KEY = BRANDING.betaGateStorageKey;

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should return false if beta is not approved', () => {
    const { result } = renderHook(() => useBetaApproved());
    expect(result.current).toBe(false);
  });

  it('should return true if beta is approved in localStorage', () => {
    localStorage.setItem(BETA_KEY, 'true');
    const { result } = renderHook(() => useBetaApproved());
    expect(result.current).toBe(true);
  });

  it('should update when storage event is fired', () => {
    const { result } = renderHook(() => useBetaApproved());
    expect(result.current).toBe(false);

    act(() => {
      localStorage.setItem(BETA_KEY, 'true');
      // Simulate storage event from another tab
      window.dispatchEvent(new StorageEvent('storage', { key: BETA_KEY, newValue: 'true' }));
    });

    expect(result.current).toBe(true);
  });
});
