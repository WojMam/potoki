import * as React from "react";
import { cn } from "./utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-white/[0.024] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/90",
        className,
      )}
      {...props}
    />
  );
}
