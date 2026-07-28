import confetti from 'canvas-confetti';

import {
  triggerEventConfetti,
  triggerEventConfettiById,
  triggerMultipleConfetti,
  triggerSingleConfetti,
} from './confetti';

jest.mock('canvas-confetti', () => jest.fn());

describe('confetti feedback utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('triggerSingleConfetti', () => {
    it('should trigger canvas confetti once with standard options', () => {
      triggerSingleConfetti();
      expect(confetti).toHaveBeenCalledTimes(1);
      expect(confetti).toHaveBeenCalledWith(
        expect.objectContaining({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      );
    });
  });

  describe('triggerMultipleConfetti', () => {
    it('should trigger specified count of confetti calls spaced out over time', () => {
      triggerMultipleConfetti(3);
      // Initial synchronous burst (0ms)
      expect(confetti).toHaveBeenCalledTimes(1);

      // Advance to 500ms (Wave 2)
      jest.advanceTimersByTime(500);
      expect(confetti).toHaveBeenCalledTimes(2);

      // Advance to 1000ms (Wave 3)
      jest.advanceTimersByTime(500);
      expect(confetti).toHaveBeenCalledTimes(3);

      // Advance beyond - no more calls should be made beyond count=3
      jest.advanceTimersByTime(2000);
      expect(confetti).toHaveBeenCalledTimes(3);
    });

    it('should trigger full barrage (6 waves) when default count is used', () => {
      triggerMultipleConfetti();
      expect(confetti).toHaveBeenCalledTimes(1);

      // Advance through all remaining waves
      jest.advanceTimersByTime(3000);
      // Wave 4 fires 2 calls (left + right), Wave 5 fires 1 call, Wave 6 fires 1 call -> Total 7 calls
      expect(confetti).toHaveBeenCalledTimes(7);
    });
  });

  describe('triggerEventConfetti', () => {
    it('should trigger single confetti call for Interview Scheduled', () => {
      triggerEventConfetti('Interview Scheduled');
      expect(confetti).toHaveBeenCalledTimes(1);
    });

    it('should trigger single confetti call for Interview Completed', () => {
      triggerEventConfetti('Interview Completed');
      expect(confetti).toHaveBeenCalledTimes(1);
    });

    it('should trigger single confetti call matching translationKey', () => {
      triggerEventConfetti(undefined, 'interviewScheduled');
      expect(confetti).toHaveBeenCalledTimes(1);

      jest.clearAllMocks();

      triggerEventConfetti(undefined, 'interviewCompleted');
      expect(confetti).toHaveBeenCalledTimes(1);
    });

    it('should trigger 3 confetti calls for Offer Received', () => {
      triggerEventConfetti('Offer Received');
      expect(confetti).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(3000);
      expect(confetti).toHaveBeenCalledTimes(3);
    });

    it('should trigger full barrage of confetti calls for Offer Accepted', () => {
      triggerEventConfetti('Offer Accepted');
      expect(confetti).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(3000);
      expect(confetti).toHaveBeenCalledTimes(7);
    });

    it('should trigger correct count matching offer translationKey', () => {
      triggerEventConfetti(undefined, 'offerReceived');
      expect(confetti).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(3000);
      expect(confetti).toHaveBeenCalledTimes(3);

      jest.clearAllMocks();

      triggerEventConfetti(undefined, 'offerAccepted');
      expect(confetti).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(3000);
      expect(confetti).toHaveBeenCalledTimes(7);
    });

    it('should not trigger confetti for unrelated event types', () => {
      triggerEventConfetti('Applied');
      expect(confetti).not.toHaveBeenCalled();

      triggerEventConfetti('Screening Call');
      expect(confetti).not.toHaveBeenCalled();

      triggerEventConfetti(null, null);
      expect(confetti).not.toHaveBeenCalled();
    });
  });

  describe('triggerEventConfettiById', () => {
    const eventTypes = [
      { id: '1', name: 'Interview Scheduled', translationKey: 'interviewScheduled' },
      { id: '2', name: 'Offer Received', translationKey: 'offerReceived' },
      { id: '3', name: 'Offer Accepted', translationKey: 'offerAccepted' },
      { id: '4', name: 'Applied', translationKey: 'applied' },
    ];

    it('should find event type by id and trigger single confetti for Interview Scheduled', () => {
      triggerEventConfettiById('1', eventTypes);
      expect(confetti).toHaveBeenCalledTimes(1);
    });

    it('should find event type by id and trigger 3 confetti bursts for Offer Received', () => {
      triggerEventConfettiById('2', eventTypes);
      expect(confetti).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(3000);
      expect(confetti).toHaveBeenCalledTimes(3);
    });

    it('should find event type by id and trigger full barrage for Offer Accepted', () => {
      triggerEventConfettiById('3', eventTypes);
      expect(confetti).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(3000);
      expect(confetti).toHaveBeenCalledTimes(7);
    });

    it('should do nothing if event type id is not found or unrelated', () => {
      triggerEventConfettiById('4', eventTypes);
      expect(confetti).not.toHaveBeenCalled();

      triggerEventConfettiById('non-existent', eventTypes);
      expect(confetti).not.toHaveBeenCalled();
    });
  });
});
