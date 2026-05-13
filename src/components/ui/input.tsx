import * as React from "react";
import { cn } from "./utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-lg border border-white/[0.04] bg-white/[0.024] px-4 text-sm text-foreground outline-none transition duration-200 ease-out placeholder:text-muted-foreground/75 focus:border-primary/24 focus:bg-white/[0.045] focus:ring-2 focus:ring-primary/14",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
