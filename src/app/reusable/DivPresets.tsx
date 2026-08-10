import { DivType } from "@/types/global";
import { forwardRef } from "react";

export const SecondaryDiv = forwardRef<HTMLDivElement, DivType>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`bg-bg-secondary ${className}`} {...props} />
  ),
);


export const TertiaryDiv = forwardRef<HTMLDivElement, DivType>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`bg-bg-tertiary shadow-md/5 ${className}`} {...props} />
  ),
);
