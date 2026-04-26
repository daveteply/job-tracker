'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect,useState } from 'react';

import { XMarkIcon } from '@heroicons/react/24/outline';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface Toast {
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

// Tailwind CSS purging
//  class names need to be present in the source code for Tailwind
//  to include them in the final css.
const alertStyleMap: Record<ToastType, string> = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;

    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (isVisible || !toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 500);
    return () => clearTimeout(timer);
  }, [isVisible, toast]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  }, []);

  const handleManualClose = () => {
    setIsVisible(false);
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          className={`toast toast-top toast-end z-100 transition-opacity duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            role="alert"
            className={`alert ${alertStyleMap[toast.type]} flex items-center justify-between gap-2 shadow-lg`}
          >
            <span>{toast.message}</span>
            <button
              onClick={handleManualClose}
              className="btn btn-ghost btn-circle btn-xs"
              aria-label="Close"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
