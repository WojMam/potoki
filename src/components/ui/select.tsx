import * as React from "react";
import { cn } from "./utils";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-md border border-white/[0.07] bg-white/[0.035] px-4 text-sm text-foreground outline-none transition focus:border-primary/60 focus:bg-white/[0.055] focus:ring-2 focus:ring-primary/15 disabled:cursor-default disabled:opacity-75",
        className,
      )}
      {...props}
    />
  );
}
