import { renderHook } from '@testing-library/react';

import { useAvailableActions } from './action-hooks';

describe('useAvailableActions', () => {
  it('should return available actions', () => {
    const { result } = renderHook(() => useAvailableActions());
    expect(result.current).toBeDefined();
    expect(result.current.length).toBeGreaterThan(0);
  });
});
