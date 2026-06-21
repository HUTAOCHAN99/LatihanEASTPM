"use client";

import { useEffect, useRef, useState } from "react";
import { QUIZ_DURATION_SECONDS } from "@/lib/types";

export function useQuizTimer(startTime: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, QUIZ_DURATION_SECONDS - Math.floor((Date.now() - startTime) / 1000))
  );
  const expiredRef = useRef(false);

  useEffect(() => {
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const next = Math.max(0, QUIZ_DURATION_SECONDS - elapsed);
      setRemaining(next);
      if (next <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpire();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime]);

  return remaining;
}
