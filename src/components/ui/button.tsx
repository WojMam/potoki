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
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-primary text-primary-foreground shadow-sm shadow-primary/10 hover:bg-primary/90 hover:shadow-primary/15",
        variant === "secondary" && "bg-white/[0.04] text-secondary-foreground hover:bg-white/[0.07]",
        variant === "ghost" && "text-muted-foreground hover:bg-white/[0.045] hover:text-foreground",
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
