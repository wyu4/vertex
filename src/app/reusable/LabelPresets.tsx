import { PType } from "@/types/global";
import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { useGSAP } from "@gsap/react";
import { forwardRef, useRef, useState } from "react";
import { useTimelineRef } from "../hooks/Animation";

export const ChangingLabel = forwardRef<
  HTMLParagraphElement,
  Omit<PType, "children"> & { text: string }
>(({ text, ...props }, fref) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [displayed, setDisplayed] = useState(text);

  const timeline = useTimelineRef();

  useGSAP(() => {
    const tl = timeline.current;
    if (!tl) return;
  }, [text]);

  return <p ref={(n) => bindRefAndForwardRef(n, fref, ref)} {...props}></p>;
});
