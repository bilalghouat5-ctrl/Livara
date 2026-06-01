import { useRef, useCallback } from 'react';

interface UseSwipeBackOptions {
  onSwipeBack: () => void;
  threshold?: number;
  minSwipe?: number;
}

export function useSwipeBack({ onSwipeBack, threshold = 48, minSwipe = 60 }: UseSwipeBackOptions) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const startedInZone = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    // For RTL apps, swipe-right from left edge = back
    startedInZone.current = t.clientX < threshold;
  }, [threshold]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!startedInZone.current || startX.current === null || startY.current === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX.current;
    const dy = Math.abs(t.clientY - (startY.current ?? 0));
    if (dx > minSwipe && dy < dx * 0.65) {
      onSwipeBack();
    }
    startX.current = null;
    startY.current = null;
    startedInZone.current = false;
  }, [onSwipeBack, minSwipe]);

  return { onTouchStart, onTouchEnd };
}
