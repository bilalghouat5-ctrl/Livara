import { useCallback, useRef } from 'react';
import React from 'react';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'error';

export function useHaptic() {
  return useCallback((type: HapticType = 'light') => {
    if (typeof window === 'undefined' || !window.navigator?.vibrate) return;
    const patterns: Record<HapticType, number | number[]> = {
      light:   10,
      medium:  25,
      heavy:   45,
      success: [10, 30, 10],
      error:   [20, 60, 20],
    };
    try { window.navigator.vibrate(patterns[type]); } catch {}
  }, []);
}

export function useRipple() {
  return useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;position:absolute;border-radius:50%;pointer-events:none;`;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);
}

export function useParallax(factor = 0.35) {
  const ref = useRef<HTMLDivElement>(null);
  const onScroll = useCallback((scrollY: number) => {
    if (!ref.current) return;
    ref.current.style.transform = `translate3d(0, ${scrollY * factor}px, 0)`;
  }, [factor]);
  return { ref, onScroll };
}
