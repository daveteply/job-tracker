import confetti from 'canvas-confetti';

/**
 * Safely plays the confetti pop sound effect if supported.
 */
export function playPopSound(soundPath = '/sounds/mixkit-long-pop-2358.wav'): void {
  if (typeof window === 'undefined' || typeof Audio === 'undefined') return;
  try {
    const audio = new Audio(soundPath);
    audio.volume = 0.4;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay restrictions or file not present - fail silently
      });
    }
  } catch {
    // Ignore audio initialization errors in tests/unsupported environments
  }
}

/**
 * Triggers a single confetti burst with sound.
 * Used for "Interview Scheduled" and "Interview Completed" event types.
 */
export function triggerSingleConfetti(): void {
  if (typeof window === 'undefined') return;
  playPopSound();
  try {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  } catch (error) {
    console.error('Failed to trigger confetti:', error);
  }
}

/**
 * Triggers multiple confetti calls spaced out over time with sound.
 * @param count Number of confetti burst waves to trigger (default: 6 for full barrage).
 */
export function triggerMultipleConfetti(count = 6): void {
  if (typeof window === 'undefined') return;

  const waves = [
    // Wave 1 (0ms): Initial center burst
    () => {
      playPopSound();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
      });
    },
    // Wave 2 (400ms): Left side cannon launch
    () => {
      playPopSound();
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
      });
    },
    // Wave 3 (800ms): Right side cannon launch
    () => {
      playPopSound();
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
      });
    },
    // Wave 4 (1300ms): Mid-screen dual burst from both sides
    () => {
      playPopSound();
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 75,
        origin: { x: 0.15, y: 0.5 },
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 75,
        origin: { x: 0.85, y: 0.5 },
      });
    },
    // Wave 5 (1800ms): High celebratory pop
    () => {
      playPopSound();
      confetti({
        particleCount: 70,
        spread: 110,
        origin: { y: 0.5 },
      });
    },
    // Wave 6 (2400ms): Grand finale high-altitude burst
    () => {
      playPopSound();
      confetti({
        particleCount: 120,
        spread: 120,
        startVelocity: 45,
        origin: { y: 0.4 },
      });
    },
  ];

  const timings = [0, 400, 800, 1300, 1800, 2400];
  const wavesToRun = waves.slice(0, Math.max(1, Math.min(count, waves.length)));

  wavesToRun.forEach((wave, index) => {
    const delay = timings[index];
    if (delay === 0) {
      try {
        wave();
      } catch (error) {
        console.error('Failed to trigger confetti wave:', error);
      }
    } else {
      setTimeout(() => {
        try {
          wave();
        } catch {
          // ignore safe canvas errors in tests/unsupported environments
        }
      }, delay);
    }
  });
}

/**
 * Triggers confetti based on the event type name or translation key.
 *
 * Trigger conditions:
 * - Single confetti call for "Interview Scheduled" and "Interview Completed"
 * - 3 confetti calls for "Offer Received"
 * - Full barrage of confetti calls (6 waves) for "Offer Accepted"
 */
export function triggerEventConfetti(
  eventTypeName?: string | null,
  translationKey?: string | null,
): void {
  if (!eventTypeName && !translationKey) return;

  const normalizedName = (eventTypeName || '').toLowerCase().trim();
  const normalizedKey = (translationKey || '').toLowerCase().trim();

  const isInterviewScheduled =
    normalizedName === 'interview scheduled' || normalizedKey === 'interviewscheduled';
  const isInterviewCompleted =
    normalizedName === 'interview completed' || normalizedKey === 'interviewcompleted';

  if (isInterviewScheduled || isInterviewCompleted) {
    triggerSingleConfetti();
    return;
  }

  const isOfferReceived = normalizedName === 'offer received' || normalizedKey === 'offerreceived';
  if (isOfferReceived) {
    triggerMultipleConfetti(3);
    return;
  }

  const isOfferAccepted = normalizedName === 'offer accepted' || normalizedKey === 'offeraccepted';
  if (isOfferAccepted) {
    triggerMultipleConfetti(6);
    return;
  }
}

/**
 * Helper to trigger confetti looking up event type by ID in an eventTypes list.
 */
export function triggerEventConfettiById(
  eventTypeId: string,
  eventTypes: Array<{ id: string; name?: string; translationKey?: string }>,
): void {
  const selectedType = eventTypes.find((et) => et.id === eventTypeId);
  if (selectedType) {
    triggerEventConfetti(selectedType.name, selectedType.translationKey);
  }
}
