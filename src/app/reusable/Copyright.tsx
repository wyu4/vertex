import { DivType, PType } from "@/types/global";
import { forwardRef } from "react";

export const CopyrightP = forwardRef<HTMLDivElement, Omit<PType, "children">>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={`font-light text-font-secondary text-sm ${className}`}
        {...props}
      >
        {`© ${process.env.COPYRIGHT} Wilson Yu`}
      </p>
    );
  },
);
