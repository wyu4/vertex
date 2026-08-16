import { ButtonType, DivType, PType } from "@/types/global";
import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useFadeIn, useTimelineRef } from "../hooks/Animation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextPlugin } from "gsap/all";
import { resolveCssColor } from "@/utils/animation-helpers";
import { GradeRecord, SessionRecord } from "@/types/data";
import { calculateTotalPoints } from "@/utils/data/universal";

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

export const SessionDiv = forwardRef<
  HTMLDivElement,
  AnimatedDivType & {
    record: SessionRecord;
    totalPointsOverride?: number;
    increasePts: number;
  }
>(
  (
    { className, totalPointsOverride, increasePts, record, children, ...props },
    ref,
  ) => {
    const [totalPoints, setTotalPoints] = useState(0);

    useEffect(() => {
      if (totalPointsOverride !== undefined) {
        setTotalPoints(totalPointsOverride);
        return;
      }
      setTotalPoints(calculateTotalPoints(record));
    }, [totalPointsOverride, record]);

    return (
      <TertiaryDiv
        className="relative flex flex-col w-full justify-center items-center rounded-2xl p-5 gap-2"
        ref={ref}
        {...props}
      >
        <div className="text-xl md:text-2xl font-bold flex flex-col justify-center items-center gap-2">
          {children}
        </div>

        <div className="relative">
          <ChangingLabel
            className="text-center font-bold text-8xl leading-none"
            text={totalPoints.toString()}
          />
          <ChangingLabel
            className="absolute left-full bottom-1 ml-2 font-bold text-2xl text-positive-primary"
            text={increasePts > 0 ? `+${increasePts}` : undefined}
            easeTime={0.15}
          />
        </div>

        <div className="flex flex-row flex-nowrap justify-around items-center w-full gap-10 pt-3 border-t border-font-tertiary/15">
          <GradeCounter color="var(--grade-pink)" count={record.pink} />
          <GradeCounter color="var(--grade-yellow)" count={record.yellow} />
          <GradeCounter color="var(--grade-green)" count={record.green} />
          <GradeCounter color="var(--grade-orange)" count={record.orange} />
          <GradeCounter color="var(--grade-blue)" count={record.blue} />
          <GradeCounter color="var(--grade-white)" count={record.white} />
        </div>
      </TertiaryDiv>
    );
  },
);

function GradeCounter({
  color,
  count = { regular: 0, flashed: 0 },
}: {
  color: string;
  count?: GradeRecord;
}) {
  return (
    <div className="relative flex flex-col md:flex-row gap-1.5 justify-center items-center">
      <div
        className="relative aspect-square h-3 rounded-full ring-1 ring-black/20"
        style={{ backgroundColor: color }}
      />
      <ChangingLabel
        className="text-sm font-medium leading-none"
        text={(count.regular + count.flashed).toString()}
      />
    </div>
  );
}

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
