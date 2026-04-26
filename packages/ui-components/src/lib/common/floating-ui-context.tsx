'use client';

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

interface FloatingUIContextType {
  isContainerActive: boolean;
  setIsContainerActive: (active: boolean) => void;
}

const FloatingUIContext = createContext<FloatingUIContextType | undefined>(undefined);

export function FloatingUIProvider({ children }: { children: ReactNode }) {
  const [activeCount, setActiveCount] = useState(0);

  const setIsContainerActive = useCallback((active: boolean) => {
    setActiveCount((prev) => (active ? prev + 1 : Math.max(0, prev - 1)));
  }, []);

  const isContainerActive = activeCount > 0;

  const value = useMemo(
    () => ({
      isContainerActive,
      setIsContainerActive,
    }),
    [isContainerActive, setIsContainerActive],
  );

  return <FloatingUIContext.Provider value={value}>{children}</FloatingUIContext.Provider>;
}

export function useFloatingUI() {
  const context = useContext(FloatingUIContext);
  if (context === undefined) {
    throw new Error('useFloatingUI must be used within a FloatingUIProvider');
  }
  return context;
}
