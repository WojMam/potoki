import * as React from "react";
import { cn } from "./utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "icon";
};

export function Button({ className, variant = "default", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border border-transparent font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "border-primary/36 bg-[linear-gradient(180deg,hsl(var(--primary)/0.30),hsl(var(--primary)/0.18)),hsl(218_18%_14.5%/0.98)] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] hover:border-primary/48 hover:bg-[linear-gradient(180deg,hsl(var(--primary)/0.36),hsl(var(--primary)/0.22)),hsl(218_18%_15.5%/0.99)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.055),0_8px_24px_rgba(0,0,0,0.16)]",
        variant === "secondary" && "border-white/[0.045] bg-white/[0.04] text-secondary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] hover:border-primary/18 hover:bg-primary/[0.06] hover:text-foreground",
        variant === "ghost" && "text-muted-foreground hover:bg-primary/[0.055] hover:text-foreground",
        variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        size === "sm" && "h-8 px-4 text-xs",
        size === "md" && "h-10 px-4 text-sm",
        size === "icon" && "h-9 w-9",
        className,
      )}
      {...props}
    />
  );
}
