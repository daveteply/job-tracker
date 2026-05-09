import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-base-200/30 border-base-300 flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12">
      {icon && <div className="mb-6 opacity-20 grayscale">{icon}</div>}
      <h2 className="text-center text-2xl font-bold opacity-60">{title}</h2>
      {description && (
        <p className="mt-2 mb-8 max-w-xs text-center text-sm opacity-40">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
