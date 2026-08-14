import { ButtonType, DivType, PType } from "@/types/global";
import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useFadeIn, useTimelineRef } from "../hooks/Animation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextPlugin } from "gsap/all";
import { resolveCssColor } from "@/utils/animation-helpers";

gsap.registerPlugin(TextPlugin);

type AnimatedDivType = DivType & { disableAnimation?: boolean };

export const SecondaryDiv = forwardRef<HTMLDivElement, AnimatedDivType>(
  ({ className, disableAnimation = false, ...props }, fref) => {
    const ref = useRef<HTMLDivElement>(null);
    useFadeIn(ref, { disabled: disableAnimation });

    return (
      <div
        ref={(n) => bindRefAndForwardRef(n, fref, ref)}
        className={`bg-bg-secondary ${className}`}
        {...props}
      />
    );
  },
);

export const TertiaryDiv = forwardRef<HTMLDivElement, AnimatedDivType>(
  ({ className, disableAnimation = false, ...props }, fref) => {
    const ref = useRef<HTMLDivElement>(null);
    useFadeIn(ref, {
      disabled: disableAnimation,
      offsetY: 12,
      duration: 0.35,
      delay: 0.3,
      ease: "power2.out",
    });

    return (
      <div
        ref={(n) => bindRefAndForwardRef(n, fref, ref)}
        className={`bg-bg-tertiary shadow-md/5 ${className}`}
        {...props}
      />
    );
  },
);

export const ChangingLabel = forwardRef<
  HTMLParagraphElement,
  Omit<PType, "children"> & {
    text?: string;
    easeTime?: number;
    delayTime?: number;
    offsetX?: gsap.TweenValue;
    offsetY?: gsap.TweenValue;
  }
>(
  (
    {
      className,
      text = "",
      offsetX = 0,
      offsetY = "-1rem",
      easeTime = 0.25,
      delayTime = 0,
      ...props
    },
    fref,
  ) => {
    const ref = useRef<HTMLParagraphElement>(null);
    const displayedText = useRef<string>(null);
    const initialText = useRef(text).current;

    const timeline = useTimelineRef();

    useGSAP(() => {
      if (displayedText.current === null) {
        gsap.set(ref.current, {
          x: offsetX,
          y: offsetY,
          opacity: 0,
        });
      }

      const tl = timeline.current;
      if (!tl) {
        console.log("No timeline");
        return;
      }

      if (text === displayedText.current) return;

      tl.to(ref.current, {
        delay: delayTime,
        x: offsetX,
        y: offsetY,
        opacity: 0,
        ease: "power2.inOut",
        duration: easeTime,
      })
        .set(ref.current, { text: text })
        .call(() => {
          displayedText.current = text;
        })
        .to(ref.current, {
          x: 0,
          y: 0,
          opacity: 1,
          ease: "power2.inOut",
          duration: easeTime,
        });
      tl.play();
      return () => {
        tl.clear();
        tl.pause();
      };
    }, [text, offsetX, offsetY]);

    return (
      <p
        ref={(n) => bindRefAndForwardRef(n, fref, ref)}
        className={`opacity-0 ${className}`}
        {...props}
      >
        {initialText || "​"}
      </p>
    );
  },
);

export const BooleanSwitch = forwardRef<
  HTMLButtonElement,
  Omit<ButtonType, "children"> & {
    defaultValue?: boolean;
    positiveColor?: string;
    negativeColor?: string;
    overrideValue?: boolean;
    onSwitch?: (value: boolean) => void;
  }
>(
  (
    {
      className,
      defaultValue = false,
      positiveColor = "var(--positive-primary)",
      negativeColor = "var(--negative-primary)",
      overrideValue,
      onSwitch,
      ...props
    },
    fref,
  ) => {
    const ref = useRef<HTMLButtonElement>(null);
    const circle = useRef<HTMLDivElement>(null);
    const [value, setValue] = useState(defaultValue);

    const initialLoad = useRef(false);

    useGSAP(() => {
      const targetX = value ? `${5 * (8 / 16) - 1.125}rem` : "0.125rem";
      if (!initialLoad.current) {
        initialLoad.current = true;
        gsap.set(circle.current, {
          x: targetX,
        });
        return;
      }
      gsap.to(circle.current, {
        x: targetX,
        ease: "sine.inOut",
        duration: 0.2,
      });
      gsap.to(ref.current, {
        backgroundColor: resolveCssColor(
          value ? positiveColor : negativeColor,
          ref.current!,
        ),
        ease: "sine.inOut",
        duration: 0.2,
      });
    }, [value]);

    useEffect(() => {
      if (overrideValue === undefined) return;
      setValue(overrideValue);
    }, [overrideValue]);

    return (
      <button
        ref={(n) => bindRefAndForwardRef(n, fref, ref)}
        onClick={() => {
          onSwitch?.(!value);
          if (overrideValue !== undefined) return;
          setValue((v) => !v);
        }}
        {...props}
        className={`relative cursor-grab rounded-full aspect-16/8 h-5 ring ring-black/10 overflow-clip shadow-font-primary/20 shadow-2xl ${className}`}
        style={{
          backgroundColor: defaultValue ? positiveColor : negativeColor,
        }}
      >
        <div
          ref={circle}
          className="absolute h-4 top-0.5 rounded-full aspect-square ring ring-black/10 bg-bg-tertiary"
        />
      </button>
    );
  },
);
