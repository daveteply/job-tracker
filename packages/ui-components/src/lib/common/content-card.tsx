import React from 'react';

export interface ContentCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function ContentCard({ title, children, className = '' }: ContentCardProps) {
  return (
    <div className={`card border-base-300 bg-base-100 border shadow-xl ${className}`}>
      <div className="card-body">
        {title && <h2 className="card-title mb-4 text-xl">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
