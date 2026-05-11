import { useSyncExternalStore } from 'react';

const emptySubscribe = () => {
  return () => {
    // No-op
  };
};

export function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
