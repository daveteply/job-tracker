import { act, renderHook } from '@testing-library/react';
import { BehaviorSubject, Subject } from 'rxjs';

import { useObservable } from './use-observable';

describe('useObservable', () => {
  it('should return initial value and loading: true initially', () => {
    const { result } = renderHook(() => useObservable(undefined, 'initial'));
    expect(result.current[0]).toBe('initial');
    expect(result.current[1]).toBe(true);
  });

  it('should update value and set loading: false when observable emits', () => {
    const subject = new Subject<string>();
    const { result } = renderHook(() => useObservable(subject, 'initial'));

    expect(result.current[0]).toBe('initial');
    expect(result.current[1]).toBe(true);

    act(() => {
      subject.next('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(result.current[1]).toBe(false);
  });

  it('should work with BehaviorSubject and set loading: false immediately', () => {
    const subject = new BehaviorSubject<string>('behavior-initial');
    const { result } = renderHook(() => useObservable(subject, 'initial'));

    // In the case of BehaviorSubject, it emits immediately on subscribe
    expect(result.current[0]).toBe('behavior-initial');
    expect(result.current[1]).toBe(false);
  });

  it('should reset loading when observable changes', () => {
    const subject1 = new Subject<string>();
    const subject2 = new Subject<string>();

    const { result, rerender } = renderHook(({ sub }) => useObservable(sub, 'initial'), {
      initialProps: { sub: subject1 as Subject<string> | undefined },
    });

    act(() => {
      subject1.next('val1');
    });
    expect(result.current[0]).toBe('val1');
    expect(result.current[1]).toBe(false);

    rerender({ sub: subject2 });
    expect(result.current[1]).toBe(true);

    act(() => {
      subject2.next('val2');
    });
    expect(result.current[0]).toBe('val2');
    expect(result.current[1]).toBe(false);
  });

  it('should unsubscribe on unmount', () => {
    const subject = new Subject<string>();
    const unsubscribeSpy = jest.spyOn(subject, 'subscribe');
    const { unmount } = renderHook(() => useObservable(subject, 'initial'));

    const subscription = unsubscribeSpy.mock.results[0].value;
    const subscriptionSpy = jest.spyOn(subscription, 'unsubscribe');

    unmount();
    expect(subscriptionSpy).toHaveBeenCalled();
  });
});
