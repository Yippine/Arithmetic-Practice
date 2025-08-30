import { useEffect } from 'react';

interface KeyboardShortcuts {
  onEnter?: () => void;
  onSpace?: () => void;
  onEscape?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onNumber?: (digit: string) => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          event.preventDefault();
          shortcuts.onEnter?.();
          break;
        case ' ':
          event.preventDefault();
          shortcuts.onSpace?.();
          break;
        case 'Escape':
          event.preventDefault();
          shortcuts.onEscape?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          shortcuts.onArrowLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          shortcuts.onArrowRight?.();
          break;
        default:
          if (/^[0-9]$/.test(event.key)) {
            shortcuts.onNumber?.(event.key);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};