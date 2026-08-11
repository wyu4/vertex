"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export function useTimelineRef(
  setupCallback?: (tl: gsap.core.Timeline) => void,
) {
  const ref = useRef<gsap.core.Timeline>(null);
  useLayoutEffect(() => {
    ref.current = gsap.timeline();
    ref.current.pause();
    setupCallback?.(ref.current);

    return () => {
      ref.current?.kill();
      ref.current = null;
    };
  }, []);
  return ref;
}
