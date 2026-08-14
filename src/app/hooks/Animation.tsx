"use client";

import { RefObject, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

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

export function useFadeIn(
  ref: RefObject<HTMLDivElement | null>,
  {
    disabled = false,
    offsetY = 24,
    duration = 0.6,
    delay = 0,
    ease = "power3.out",
  }: {
    disabled?: boolean;
    offsetY?: gsap.TweenValue;
    duration?: number;
    delay?: number;
    ease?: string;
  },
) {
  useGSAP(() => {
    if (disabled) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: offsetY },
      { delay: delay, opacity: 1, y: 0, duration: duration, ease: ease },
    );
  }, []);
}
