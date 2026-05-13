import { cn } from "../ui/utils";

export function PotokiMark({ className }: { className?: string }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M7.2 9.4c3.2-2.1 7.1-2.1 10.2.1 2.7 1.9 4.8 2.5 7.4.9"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M7.2 16.1c3.5-1.8 6.2-1 8.8 1.1 2.7 2.2 5.7 3.1 8.8 1.1"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.2 22.7c2.7 1.7 5.8 1.2 8.6-1.2 1.1-.9 2.1-1.8 3.2-2.3"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />
      <path
        d="M15.8 17.2c.7-2.6 2.2-4.6 4.8-6.1"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.58"
      />
    </svg>
  );
}
