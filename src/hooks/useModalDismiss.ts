import { useEffect, useRef, useCallback } from 'react';

interface UseModalDismissOptions {
  isOpen: boolean;
  onDismiss: () => void;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  historyKey?: string;
}

export function useModalDismiss({
  isOpen,
  onDismiss,
  closeOnEsc = true,
  closeOnBackdrop = true,
  historyKey,
}: UseModalDismissOptions) {
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const closedByPopState = useRef(false);

  // Focus restoration & body scroll lock
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement | null;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
        if (
          previousActiveElement.current &&
          typeof previousActiveElement.current.focus === 'function'
        ) {
          // Restore focus with a slight delay so browser renders
          setTimeout(() => {
            try {
              previousActiveElement.current?.focus();
            } catch {
              // ignore focus errors
            }
          }, 50);
        }
      };
    }
  }, [isOpen]);

  // ESC key dismissal
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        e.stopPropagation();
        onDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, closeOnEsc, onDismiss]);

  // Browser history integration
  useEffect(() => {
    if (!isOpen || !historyKey) return;

    closedByPopState.current = false;
    const stateId = `modal-${historyKey}-${Date.now()}`;

    // Push modal state into browser history so browser Back closes modal
    window.history.pushState({ modalKey: historyKey, stateId }, '');

    const handlePopState = (e: PopStateEvent) => {
      closedByPopState.current = true;
      onDismiss();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // If modal was dismissed via UI (Close button / ESC / Backdrop) rather than browser Back,
      // pop the state so history doesn't leave ghost modal entries
      if (!closedByPopState.current && window.history.state?.modalKey === historyKey) {
        window.history.back();
      }
    };
  }, [isOpen, historyKey, onDismiss]);

  // Backdrop click handler generator
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!closeOnBackdrop) return;
      if (e.target === e.currentTarget) {
        e.preventDefault();
        e.stopPropagation();
        onDismiss();
      }
    },
    [closeOnBackdrop, onDismiss]
  );

  return { handleBackdropClick };
}
