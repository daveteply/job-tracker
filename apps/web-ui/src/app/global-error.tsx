'use client';

import { useEffect, useState } from 'react';

const EMOJIS = ['🫠', '🙃', '🤦', '🧩'];

// This component must include <html> and <body> tags
// because it replaces the entire root layout when it catches an error.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [emoji, setEmoji] = useState('🫠');

  useEffect(() => {
    // Select a random emoji on mount
    const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    setEmoji(randomEmoji);

    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-base-100 text-base-content min-h-screen font-sans antialiased">
        <div className="hero bg-base-100 min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="mb-6 flex justify-center">
                <div className="text-7xl animate-bounce">
                  {emoji}
                </div>
              </div>
              <h1 className="font-sans text-5xl font-bold">Well, this is awkward.</h1>
              <p className="text-base-content/70 py-6 font-sans">
                Something didn't go as planned on our end. Please try again in a few seconds.
              </p>
              <div className="flex justify-center">
                <button className="btn btn-primary" onClick={() => reset()}>
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
