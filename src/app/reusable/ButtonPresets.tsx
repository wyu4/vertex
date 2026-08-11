import { ButtonType } from "@/types/global";
import { forwardRef, RefObject } from "react";

export const gradeButton = forwardRef<HTMLButtonElement, ButtonType>(
  ({ className, ...props }, fref) => {
    return <button ref={fref} {...props} />;
  },
);
