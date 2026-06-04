// HapticEngine.ts — Central haptic feedback system for La Casa
// Follows Apple HIG & Material Design haptic patterns

export type HapticStyle =
  | 'selection'     // Light: tab switch, filter select
  | 'light'         // Light impact: card tap, toggle
  | 'medium'        // Medium impact: booking confirm
  | 'heavy'         // Heavy impact: destructive action
  | 'success'       // Notification: booking confirmed
  | 'warning'       // Notification: price change
  | 'error'         // Notification: error
  | 'rigid'         // Precise: swipe snap
  | 'soft';         // Subtle: scroll snap

const HAPTIC_PATTERNS: Record<HapticStyle, number | number[]> = {
  selection: 8,
  light:     12,
  medium:    25,
  heavy:     45,
  success:   [15, 60, 15],
  warning:   [30, 40, 30],
  error:     [50, 30, 50, 30, 50],
  rigid:     18,
  soft:      6,
};

class HapticEngineClass {
  private isSupported: boolean;
  private lastHapticTime = 0;
  private minInterval = 50; // ms between haptics to avoid spam

  constructor() {
    this.isSupported =
      typeof window !== 'undefined' &&
      typeof window.navigator !== 'undefined' &&
      typeof window.navigator.vibrate === 'function';
  }

  trigger(style: HapticStyle = 'light') {
    const now = Date.now();
    if (now - this.lastHapticTime < this.minInterval) return;
    this.lastHapticTime = now;

    if (!this.isSupported) return;
    try {
      window.navigator.vibrate(HAPTIC_PATTERNS[style]);
    } catch {
      // Silently fail on unsupported browsers
    }
  }

  // Convenience wrappers
  selection = () => this.trigger('selection');
  light     = () => this.trigger('light');
  medium    = () => this.trigger('medium');
  heavy     = () => this.trigger('heavy');
  success   = () => this.trigger('success');
  warning   = () => this.trigger('warning');
  error     = () => this.trigger('error');
  rigid     = () => this.trigger('rigid');
  soft      = () => this.trigger('soft');
}

export const Haptic = new HapticEngineClass();
