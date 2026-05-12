'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

export function PwaInstallButton() {
  const t = useTranslations('IndexPage.pwa');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      console.log('PWA: beforeinstallprompt event captured');
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.info(outcome);

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) {
    return (
      <div className="alert alert-info mt-4 text-left shadow-sm">
        <span>{t('browserNotice')}</span>
      </div>
    );
  }

  return (
    <button onClick={handleInstallClick} className="btn btn-secondary btn-wide mt-4">
      {t('installButton')}
    </button>
  );
}
