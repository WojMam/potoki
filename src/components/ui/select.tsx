import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./utils";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block w-full">
      <select
        className={cn(
          "h-10 w-full appearance-none rounded-lg border border-white/[0.045] bg-[hsl(218_18%_13.5%/0.94)] px-4 pr-10 text-sm text-foreground outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] transition duration-200 ease-out [color-scheme:dark] hover:border-primary/18 hover:bg-[hsl(218_18%_14.5%/0.98)] focus:border-primary/30 focus:bg-[hsl(218_18%_15%/0.98)] focus:ring-2 focus:ring-primary/14 disabled:cursor-default disabled:opacity-75 [&>option]:bg-[hsl(218_18%_13%)] [&>option]:text-foreground",
          className,
        )}
        {...props}
      />
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
    </span>
  );
}
