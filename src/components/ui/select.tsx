import * as React from "react";
import { cn } from "./utils";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-lg border border-white/[0.055] bg-white/[0.026] px-4 text-sm text-foreground outline-none transition duration-200 ease-out focus:border-white/[0.08] focus:bg-white/[0.05] focus:ring-2 focus:ring-primary/10 disabled:cursor-default disabled:opacity-75",
        className,
      )}
      {...props}
    />
  );
}
