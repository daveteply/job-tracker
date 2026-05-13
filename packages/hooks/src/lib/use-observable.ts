import * as React from 'react';

import { Observable } from 'rxjs';

/**
 * useObservable hook to bridge RxDB observables with React state.
 * Returns a tuple [value, loading] where loading is true until the first emission.
 */
export function useObservable<T>(
  observable$: Observable<T> | null | undefined,
  initialValue: T,
): [T, boolean] {
  const [value, setValue] = React.useState<T>(initialValue);
  const [loading, setLoading] = React.useState(true);
  const [prevObservable, setPrevObservable] = React.useState(observable$);

  // If the observable instance changed, reset the loading state during render.
  // This is the recommended React pattern for adjusting state based on prop changes.
  if (observable$ !== prevObservable) {
    setPrevObservable(observable$);
    setLoading(true);
  }

  React.useEffect(() => {
    if (!observable$) {
      return;
    }

    const subscription = observable$.subscribe({
      next: (val: T) => {
        React.startTransition(() => {
          setValue(val);
          setLoading(false);
        });
      },
      error: (err: unknown) => {
        console.error('useObservable error:', err);
        setLoading(false);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [observable$]);

  return [value, loading];
}
