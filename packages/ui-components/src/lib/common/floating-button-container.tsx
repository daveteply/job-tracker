'use client';

import { ReactNode, useEffect } from 'react';
import { useFloatingUI } from './floating-ui-context';

interface FloatingButtonContainerProps {
  children: ReactNode;
}

export function FloatingButtonContainer({ children }: FloatingButtonContainerProps) {
  const { setIsContainerActive } = useFloatingUI();

  useEffect(() => {
    setIsContainerActive(true);
    return () => setIsContainerActive(false);
  }, [setIsContainerActive]);

  return (
    <div className="from-base-100 via-base-100/90 fixed right-0 bottom-14 left-0 z-10 bg-gradient-to-t to-transparent p-4">
      <div className="bg-base-200/80 border-base-300 container mx-auto flex max-w-2xl items-center justify-between rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}
