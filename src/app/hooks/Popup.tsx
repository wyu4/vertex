"use client";

import { JSX, ReactNode, useRef, useState } from "react";
import { TertiaryDiv } from "../reusable/Presets";
import { useGSAP } from "@gsap/react";
import { FaCheck, FaPlus } from "react-icons/fa";
import gsap from "gsap";
import { useTimelineRef } from "./Animation";

export function useBooleanPopup({
  className,
  initialHeader = "Boolean popup",
  initialDescription = "No description.",
  initialVisible = false,
  initialOnTrue,
  initialOnFalse,
}: {
  className?: string;
  initialHeader?: string;
  initialDescription?: string;
  initialVisible?: boolean;
  initialOnTrue?: () => void;
  initialOnFalse?: () => void;
}): [
  JSX.Element,
  (
    newHeader: string,
    newDescription: string,
    onTrue: (() => void) | undefined,
    onFalse: (() => void) | undefined,
  ) => void,
] {
  const container = useRef<HTMLDivElement>(null);
  const translationContainer = useRef<HTMLDivElement>(null);
  const popup = useRef<HTMLDivElement>(null);

  const [header, setHeader] = useState(initialHeader);
  const [description, setDescription] = useState(initialDescription);
  const [visible, setVisible] = useState(initialVisible);
  const [callbacks, setCallbacks] = useState<{
    onTrue?: () => void;
    onFalse?: () => void;
  }>({ onTrue: initialOnTrue, onFalse: initialOnFalse });

  const debounceRef = useRef(false);
  const timeline = useTimelineRef((tl) => {
    tl.fromTo(
      popup.current,
      {
        x: 0,
        scale: 0.9,
        opacity: 0,
      },
      {
        keyframes: {
          x: [0, -10, 8, -6, 4, -2, 0],
          ease: "none",
        },
        scale: 1,
        opacity: 1,
        duration: 0.5,
        delay: 0.25,
        ease: "sine.out",
      },
    );
  });

  useGSAP(() => {
    gsap.to(container.current, {
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? "all" : "none",
      duration: 0.25,
      ease: "sine.inOut",
    });
    if (visible) {
      timeline.current?.restart();
    }
  }, [visible]);

  const triggerFunction = (
    newHeader: string,
    newDescription: string,
    onTrue: (() => void) | undefined,
    onFalse: (() => void) | undefined,
  ) => {
    if (debounceRef.current) return;
    debounceRef.current = true;
    setHeader(newHeader);
    setDescription(newDescription);
    setCallbacks({ onTrue, onFalse });
    setVisible(true);
  };

  const component = (
    <div
      ref={container}
      className={`fixed bg-black/50 overflow-clip top-0 left-0 w-full h-full z-100 backdrop-blur-xs ${
        initialVisible ? "" : "opacity-0 pointer-events-none"
      } ${className}`}
    >
      <div
        ref={translationContainer}
        className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center"
      >
        <TertiaryDiv
          disableAnimation={true}
          ref={popup}
          className="relative min-w-50 md:min-w-100 max-w-80 md:max-w-200 rounded-2xl flex flex-col justify-center items-center gap-5 p-10"
        >
          <h2 className="text-xl md:text-2xl text-center font-bold">
            {header}
          </h2>
          <p className="text-sm md:text-xl text-center text-wrap">
            {description}
          </p>
          <div className="relative mt-5 w-30 md:w-50 flex flex-row flex-nowrap justify-around items-center">
            <PopupButton
              onClick={() => {
                callbacks.onFalse?.();
                setVisible(false);
                debounceRef.current = false;
              }}
            >
              <FaPlus className="text-2xl rotate-45" />
            </PopupButton>
            <PopupButton
              onClick={() => {
                callbacks.onTrue?.();
                setVisible(false);
                debounceRef.current = false;
              }}
            >
              <FaCheck className="text-2xl" />
            </PopupButton>
          </div>
        </TertiaryDiv>
      </div>
    </div>
  );

  return [component, triggerFunction];
}

function PopupButton({
  onClick,
  children,
}: {
  onClick?: () => void;
  color?: string;
  children?: ReactNode;
  fadeInDelay?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [mouseEntered, setMouseEntered] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  useGSAP(() => {
    const button = ref.current!;
    gsap.to(button, {
      opacity: mouseEntered ? 0.5 : 1,
      scale: (mouseEntered ? 1.25 : 1) * (mouseDown ? 0.8 : 1),
      ease: "power1.inOut",
      duration: 0.1,
    });
  }, [mouseEntered, mouseDown]);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className="relative z-5 select-none place-items-center text-2xl md:text-3xl"
      onMouseEnter={() => setMouseEntered(true)}
      onMouseLeave={() => {
        setMouseEntered(false);
        setMouseDown(false);
      }}
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => setMouseDown(false)}
    >
      {children}
    </button>
  );
}
