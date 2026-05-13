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
        variant === "default" && "border-primary/42 bg-[linear-gradient(180deg,hsl(var(--primary)/0.36),hsl(var(--primary)/0.18)),hsl(218_18%_14%/0.98)] text-primary-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_12px_34px_hsl(var(--primary)/0.18)] hover:border-primary/58 hover:bg-[linear-gradient(180deg,hsl(var(--primary)/0.44),hsl(var(--primary)/0.23)),hsl(218_18%_15%/0.99)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_15px_42px_hsl(var(--primary)/0.23)]",
        variant === "secondary" && "border-white/[0.045] bg-white/[0.04] text-secondary-foreground hover:border-primary/20 hover:bg-primary/[0.075] hover:text-foreground",
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
