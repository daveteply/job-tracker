import React from 'react';

export interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, children, className = 'mb-6' }: PageHeaderProps) {
  return (
    <div
      className={`flex flex-row items-center justify-between md:justify-start md:gap-4 ${className}`}
    >
      <h1 className="px-1 text-2xl font-bold">{title}</h1>
      {children && <div className="flex items-center gap-1">{children}</div>}
    </div>
  );
}
