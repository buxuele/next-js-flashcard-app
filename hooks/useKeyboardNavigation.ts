"use client";

import { useEffect } from "react";

interface UseKeyboardNavigationProps {
  onNext: () => void;
  onPrev: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  onNext,
  onPrev,
  enabled = true,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        onNext();
      } else if (e.key === "ArrowLeft") {
        onPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrev, enabled]);
}
