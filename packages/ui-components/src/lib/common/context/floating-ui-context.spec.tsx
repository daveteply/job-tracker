import { ReactNode } from 'react';

import { act, render, renderHook } from '@testing-library/react';

import { FloatingUIProvider, useFloatingUI } from './floating-ui-context';

describe('FloatingUIContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <FloatingUIProvider>{children}</FloatingUIProvider>
  );

  it('should provide initial values', () => {
    const { result } = renderHook(() => useFloatingUI(), { wrapper });

    expect(result.current.isContainerActive).toBe(false);
    expect(typeof result.current.setIsContainerActive).toBe('function');
  });

  it('should update isContainerActive when setIsContainerActive is called', () => {
    const { result } = renderHook(() => useFloatingUI(), { wrapper });

    act(() => {
      result.current.setIsContainerActive(true);
    });
    expect(result.current.isContainerActive).toBe(true);

    act(() => {
      result.current.setIsContainerActive(false);
    });
    expect(result.current.isContainerActive).toBe(false);
  });

  it('should handle multiple active containers (reference counting)', () => {
    const { result } = renderHook(() => useFloatingUI(), { wrapper });

    act(() => {
      result.current.setIsContainerActive(true); // count = 1
    });
    expect(result.current.isContainerActive).toBe(true);

    act(() => {
      result.current.setIsContainerActive(true); // count = 2
    });
    expect(result.current.isContainerActive).toBe(true);

    act(() => {
      result.current.setIsContainerActive(false); // count = 1
    });
    expect(result.current.isContainerActive).toBe(true);

    act(() => {
      result.current.setIsContainerActive(false); // count = 0
    });
    expect(result.current.isContainerActive).toBe(false);
  });

  it('should not let activeCount go below zero', () => {
    const { result } = renderHook(() => useFloatingUI(), { wrapper });

    act(() => {
      result.current.setIsContainerActive(false);
    });
    expect(result.current.isContainerActive).toBe(false);

    act(() => {
      result.current.setIsContainerActive(true);
    });
    expect(result.current.isContainerActive).toBe(true);
    
    act(() => {
      result.current.setIsContainerActive(false);
    });
    expect(result.current.isContainerActive).toBe(false);
  });

  it('should throw error when useFloatingUI is used outside FloatingUIProvider', () => {
    // Silence console.error for this test as we expect an error to be thrown
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(jest.fn());
    
    expect(() => renderHook(() => useFloatingUI())).toThrow(
      'useFloatingUI must be used within a FloatingUIProvider'
    );
    
    consoleSpy.mockRestore();
  });

  it('should render children successfully', () => {
    const { getByText } = render(
      <FloatingUIProvider>
        <div>Test Child</div>
      </FloatingUIProvider>
    );
    expect(getByText('Test Child')).toBeTruthy();
  });
});
