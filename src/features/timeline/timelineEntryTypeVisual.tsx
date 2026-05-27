import {
  CircleCheck,
  ChevronDown,
  Link2,
  PauseCircle,
  Scale,
  StickyNote,
  Timer,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "../../components/ui/utils";
import { useI18n } from "../../core/i18n";
import { timelineEntryTypes, type TimelineEntryType } from "../../core/models/timeline";

export const timelineEntryTypeIcons: Record<TimelineEntryType, LucideIcon> = {
  note: StickyNote,
  decision: Scale,
  meeting: Users,
  action_done: CircleCheck,
  waiting: PauseCircle,
  work_log: Timer,
  file_link: Link2,
};

const triggerClassName =
  "flex h-10 w-full items-center gap-2 rounded-lg border border-white/[0.045] bg-[hsl(218_18%_13.5%/0.94)] px-3 pr-9 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] outline-none transition duration-200 ease-out hover:border-primary/18 hover:bg-[hsl(218_18%_14.5%/0.98)] focus-visible:border-primary/30 focus-visible:bg-[hsl(218_18%_15%/0.98)] focus-visible:ring-2 focus-visible:ring-primary/14";

export function TimelineEntryTypeIcon({
  type,
  className,
}: {
  type: TimelineEntryType;
  className?: string;
}) {
  const Icon = timelineEntryTypeIcons[type];
  return <Icon className={cn("h-3 w-3 shrink-0 text-muted-foreground/58", className)} strokeWidth={1.75} aria-hidden />;
}

export function TimelineEntryTypeBadge({ type }: { type: TimelineEntryType }) {
  const { timelineTypeLabel } = useI18n();
  const Icon = timelineEntryTypeIcons[type];
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5">
      <span
        className="grid h-5 w-5 shrink-0 place-items-center rounded-[0.4rem] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
        aria-hidden
      >
        <Icon className="h-3 w-3 text-foreground/62" strokeWidth={1.85} />
      </span>
      <span className="text-[9.5px] font-medium uppercase tracking-[0.13em] text-muted-foreground/64">
        {timelineTypeLabel(type)}
      </span>
    </span>
  );
}

export function TimelineEntryTypeSelect({
  value,
  onChange,
}: {
  value: TimelineEntryType;
  onChange: (type: TimelineEntryType) => void;
}) {
  const { timelineTypeLabel, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        className={triggerClassName}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={t("timeline.entryType")}
        onClick={() => setOpen((current) => !current)}
      >
        <TimelineEntryTypeIcon type={value} className="h-3.5 w-3.5 text-muted-foreground/68" />
        <span className="min-w-0 flex-1 truncate text-left">{timelineTypeLabel(value)}</span>
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70 transition duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={t("timeline.entryType")}
          className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-white/[0.06] bg-[hsl(218_18%_12.5%/0.98)] py-1 shadow-[0_16px_40px_rgba(0,0,0,0.32)] backdrop-blur-sm"
        >
          {timelineEntryTypes.map((type) => {
            const selected = type === value;
            return (
              <li key={type} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-foreground/88 transition duration-150 ease-out hover:bg-primary/[0.055]",
                    selected && "bg-primary/[0.07] text-foreground",
                  )}
                  onClick={() => {
                    onChange(type);
                    setOpen(false);
                  }}
                >
                  <TimelineEntryTypeIcon type={type} className="h-3.5 w-3.5 text-muted-foreground/65" />
                  <span>{timelineTypeLabel(type)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
