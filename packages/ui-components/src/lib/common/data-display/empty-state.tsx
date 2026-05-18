import React, { useMemo } from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const peekingPip = useMemo(() => {
    // Generate a stable seed from title and description to avoid impurity errors
    const seed = (title + (description ?? ''))
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const isLeft = seed % 2 === 0;
    const rotationOffset = (seed % 10) - 5; // -5 to +5 range
    const rotation = isLeft ? -10 + rotationOffset : 10 - rotationOffset;
    const sideClass = isLeft ? '-left-12' : '-right-12';

    return (
      <div
        className={`absolute bottom-0 ${sideClass} pointer-events-none z-0 opacity-20`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <img
          src="/mascot/Pip512.png"
          alt=""
          className={`h-48 w-48 object-contain ${isLeft ? '' : '-scale-x-100'}`}
        />
      </div>
    );
  }, [description, title]);

  return (
    <div className="bg-base-200/30 border-base-300 relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-12">
      {peekingPip}
      <div className="relative z-10 flex flex-col items-center">
        {icon && <div className="mb-6 opacity-20 grayscale">{icon}</div>}
        <h2 className="text-center text-2xl font-bold opacity-60">{title}</h2>
        {description && (
          <p className="mt-2 mb-8 max-w-xs text-center text-sm opacity-40">{description}</p>
        )}
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
