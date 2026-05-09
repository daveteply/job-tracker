'use client';

import { useEffect, useState } from 'react';

const EMOJIS = ['🫠', '🙃', '🤦', '🧩'];

export interface ErrorViewProps {
  title: string;
  description: string;
  tryAgainText?: string;
  backHomeText?: string;
  onReset?: () => void;
  onBackHome?: () => void;
  error?: Error & { digest?: string };
}

export function ErrorView({
  title,
  description,
  tryAgainText,
  backHomeText,
  onReset,
  onBackHome,
  error,
}: ErrorViewProps) {
  const [emoji, setEmoji] = useState('🫠');

  useEffect(() => {
    const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    setEmoji(randomEmoji);

    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="hero bg-base-100 min-h-[60vh]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="animate-bounce text-7xl">{emoji}</div>
          </div>
          <h1 className="text-5xl font-bold">{title}</h1>
          <p className="text-base-content/70 py-6">{description}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            {onReset && tryAgainText && (
              <button className="btn btn-primary" onClick={onReset}>
                {tryAgainText}
              </button>
            )}
            {onBackHome && backHomeText && (
              <button className="btn btn-ghost" onClick={onBackHome}>
                {backHomeText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
