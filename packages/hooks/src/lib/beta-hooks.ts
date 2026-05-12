import { useSyncExternalStore } from 'react';

const BETA_KEY = 'vireo-beta-approved';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(BETA_KEY) === 'true';
}

function getServerSnapshot() {
  return false;
}

export function useBetaApproved() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
