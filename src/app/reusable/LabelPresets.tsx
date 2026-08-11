import { PType } from "@/types/global";
import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { forwardRef, useRef } from "react";
import { useTimelineRef } from "../hooks/Animation";
import { TextPlugin } from "gsap/all";

gsap.registerPlugin(TextPlugin);

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
    const displayed = useRef<string>(null);

    const timeline = useTimelineRef();

    useGSAP(() => {
      if (!displayed.current) {
        gsap.set(ref.current, {
          text: "notext",
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

      if (text === displayed.current) return;

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
          displayed.current = text;
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
        tl.pause;
      };
    }, [text, offsetX, offsetY]);

    return (
      <p
        ref={(n) => bindRefAndForwardRef(n, fref, ref)}
        className={`opacity-0 ${className}`}
        {...props}
      >
        {"notext"}
      </p>
    );
  },
);
