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
    <div className="fixed bottom-14 left-0 right-0 p-4 bg-gradient-to-t from-base-100 via-base-100/90 to-transparent z-10">
      <div className="container mx-auto flex justify-between items-center max-w-2xl px-4 py-3 rounded-2xl bg-base-200/80 backdrop-blur-md border border-base-300 shadow-lg">
        {children}
      </div>
    </div>
  );
}
