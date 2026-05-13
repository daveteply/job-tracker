import { renderHook } from '@testing-library/react';

import { useIsClient } from './client-hooks';

describe('useIsClient', () => {
  it('should return true on the client', () => {
    const { result } = renderHook(() => useIsClient());
    expect(result.current).toBe(true);
  });
});
