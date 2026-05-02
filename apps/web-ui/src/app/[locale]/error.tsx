'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

const EMOJIS = ['🫠', '🙃', '🤦', '🧩'];

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Error');
  const [emoji, setEmoji] = useState('🫠');

  useEffect(() => {
    // Select a random emoji on mount
    const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    setEmoji(randomEmoji);

    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="hero bg-base-100 min-h-[60vh]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="animate-bounce text-7xl">{emoji}</div>
          </div>
          <h1 className="text-5xl font-bold">{t('title')}</h1>
          <p className="text-base-content/70 py-6">{t('description')}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="btn btn-primary" onClick={() => reset()}>
              {t('tryAgain')}
            </button>
            <Link href="/" className="btn btn-ghost">
              {t('backHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
