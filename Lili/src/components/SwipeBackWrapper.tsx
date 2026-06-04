import React, { useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Haptic } from './HapticEngine';

interface SwipeBackWrapperProps {
  children: React.ReactNode;
  onSwipeBack: () => void;
  threshold?: number;        // px to trigger back
  edgeZone?: number;         // px from left edge to start listening
  disabled?: boolean;
  className?: string;
}

/**
 * SwipeBackWrapper — wraps any sub-screen with an iOS-style swipe-back gesture.
 * Swipe from the LEFT edge rightward to navigate back.
 * In RTL mode (Arabic), we treat left edge = start of screen physically.
 */
export const SwipeBackWrapper: React.FC<SwipeBackWrapperProps> = ({
  children,
  onSwipeBack,
  threshold = 110,
  edgeZone = 30,
  disabled = false,
  className = '',
}) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const dragX = useRef(0);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    const touch = e.touches[0];
    // Only start from left physical edge
    if (touch.clientX > edgeZone) return;
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    dragX.current = 0;
    isDragging.current = false;
  }, [disabled, edgeZone]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartX.current;
    const dy = touch.clientY - touchStartY.current;

    // Require more horizontal than vertical movement
    if (!isDragging.current) {
      if (Math.abs(dx) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        // Vertical scroll — abort
        touchStartX.current = null;
        return;
      }
      isDragging.current = true;
    }

    if (dx <= 0) return; // Only rightward swipe
    dragX.current = dx;

    // Gentle rubber-band resistance
    const resistance = Math.pow(dx, 0.88);
    if (containerRef.current) {
      containerRef.current.style.transform = `translate3d(${resistance}px, 0, 0)`;
      containerRef.current.style.transition = 'none';
      // Dim shadow as hint
      containerRef.current.style.boxShadow = `inset 4px 0 20px rgba(0,0,0,${Math.min(0.12, dx / 1200)})`;
    }

    if (e.cancelable) e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null) return;
    touchStartX.current = null;
    touchStartY.current = null;

    if (!isDragging.current || !containerRef.current) {
      isDragging.current = false;
      return;
    }
    isDragging.current = false;

    if (dragX.current >= threshold) {
      // Trigger back
      Haptic.rigid();
      containerRef.current.style.transition = 'transform 0.22s cubic-bezier(0.32, 0.94, 0.6, 1)';
      containerRef.current.style.transform = 'translate3d(100%, 0, 0)';
      setTimeout(onSwipeBack, 210);
    } else {
      // Spring back
      containerRef.current.style.transition = 'transform 0.38s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      containerRef.current.style.transform = 'translate3d(0, 0, 0)';
      containerRef.current.style.boxShadow = 'none';
    }
    dragX.current = 0;
  }, [threshold, onSwipeBack]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`w-full h-full ${className}`}
      style={{ willChange: 'transform', touchAction: 'pan-y' }}
    >
      {children}
    </div>
  );
};
