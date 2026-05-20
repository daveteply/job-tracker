'use client';

import { useEffect, useState } from 'react';

import ChevronUpIcon from '@heroicons/react/24/solid/ChevronUpIcon';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`bg-info text-primary-content fixed right-8 bottom-8 z-50 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-label="Back to top"
    >
      <ChevronUpIcon className="h-6 w-6" />
    </button>
  );
}
