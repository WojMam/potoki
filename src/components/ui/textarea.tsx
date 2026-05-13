import * as React from "react";
import { cn } from "./utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-24 w-full resize-y rounded-lg border border-white/[0.055] bg-white/[0.026] px-4 py-2 text-[15px] leading-7 text-foreground outline-none transition duration-200 ease-out placeholder:text-muted-foreground focus:border-white/[0.08] focus:bg-white/[0.05] focus:ring-2 focus:ring-primary/10",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
