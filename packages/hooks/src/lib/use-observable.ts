import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export function useObservable<T>(
  observable$: Observable<T> | null | undefined,
  initialValue: T,
): T {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    if (!observable$) return;

    const subscription = observable$.subscribe({
      next: (val) => setValue(val),
      error: (err) => console.error('useObservable error:', err),
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [observable$]);

  return value;
}
