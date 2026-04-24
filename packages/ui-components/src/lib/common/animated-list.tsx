/// <reference types="react/canary" />
'use client';

import { ReactNode, ViewTransition } from 'react';

export interface AnimatedListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  getItemId: (item: T) => string;
  className?: string;
}

/**
 * A reusable list component that uses React 19's ViewTransition
 * to animate items being added, removed, or reordered.
 *
 * Uses 'default="none"' to prevent entry animations on initial mount
 * during route navigation.
 */
export function AnimatedList<T>({
  items,
  renderItem,
  getItemId,
  className = 'flex flex-col gap-3',
}: AnimatedListProps<T>) {
  return (
    <div className={className}>
      {items.map((item) => {
        const id = getItemId(item);
        return (
          <ViewTransition key={id} name="list-item" default="none">
            {renderItem(item)}
          </ViewTransition>
        );
      })}
    </div>
  );
}

export default AnimatedList;
