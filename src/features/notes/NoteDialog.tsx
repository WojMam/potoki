import ReactMarkdown from "react-markdown";
import { forwardRef, useCallback, useEffect, useRef, useState, type TextareaHTMLAttributes } from "react";
import { FlowScrollArea } from "../../components/layout/FlowScrollArea";
import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { cn } from "../../components/ui/utils";
import { useI18n } from "../../core/i18n";
import { MarkdownToolbar } from "./MarkdownToolbar";

export function NoteDialog({
  open,
  mode,
  title,
  markdown,
  timelineDescription,
  includeTimelineEntry,
  setTitle,
  setMarkdown,
  setTimelineDescription,
  setIncludeTimelineEntry,
  onClose,
  onSave,
}: {
  open: boolean;
  mode: "stream" | "entry";
  title: string;
  markdown: string;
  timelineDescription: string;
  includeTimelineEntry: boolean;
  setTitle: (value: string) => void;
  setMarkdown: (value: string) => void;
  setTimelineDescription: (value: string) => void;
  setIncludeTimelineEntry: (value: boolean) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const { t } = useI18n();
  const markdownTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <Dialog
      open={open}
      title={mode === "entry" ? t("notes.attach") : t("notes.add")}
      onClose={onClose}
      className="h-[85vh] max-h-[85vh] max-w-5xl"
      contentClassName="flex flex-col"
      scrollContent={false}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <Input
          className="shrink-0"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={t("notes.titlePlaceholder")}
        />

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white/[0.018]">
            <MarkdownToolbar textareaRef={markdownTextareaRef} value={markdown} onChange={setMarkdown} />
            <FlowTextarea
              ref={markdownTextareaRef}
              className="rounded-t-none border-t-0"
              value={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
              placeholder={t("notes.markdownPlaceholder")}
            />
          </div>

          <div className="h-full min-h-0 overflow-hidden rounded-xl bg-white/[0.018]">
            <FlowScrollArea className="h-full min-h-0" viewportClassName="p-5 pr-8">
              {markdown.trim() ? (
                <div className="prose-potoki">
                  <ReactMarkdown>{markdown}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm leading-7 text-muted-foreground">{t("notes.previewEmpty")}</p>
              )}
            </FlowScrollArea>
          </div>
        </div>

        {mode === "stream" ? (
          <div className="shrink-0 rounded-xl bg-white/[0.018] p-4">
            <label className="flex items-start gap-3 text-sm text-foreground/86">
              <input
                type="checkbox"
                checked={includeTimelineEntry}
                onChange={(event) => setIncludeTimelineEntry(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
              />
              <span>
                {t("notes.showTimeline")}
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {t("notes.showTimelineHint")}
                </span>
              </span>
            </label>
            {includeTimelineEntry ? (
              <Textarea
                className="scrollbar-none mt-3 h-20 min-h-0 overflow-y-auto [resize:none]"
                value={timelineDescription}
                onChange={(event) => setTimelineDescription(event.target.value)}
                placeholder={t("notes.timelineDescription")}
              />
            ) : null}
          </div>
        ) : (
          <p className="shrink-0 rounded-xl bg-white/[0.018] p-4 text-sm leading-7 text-muted-foreground">
            {t("notes.attachHint")}
          </p>
        )}

        <div className="flex shrink-0 justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onSave}>{t("notes.save")}</Button>
        </div>
      </div>
    </Dialog>
  );
}

const FlowTextarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function FlowTextarea({
  className,
  ...props
}, forwardedRef) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const activeTimer = useRef<number | null>(null);
  const animationFrame = useRef<number | null>(null);
  const currentProgress = useRef(0);
  const targetProgress = useRef(0);
  const [active, setActive] = useState(false);
  const [scrollable, setScrollable] = useState(false);

  const showIndicator = useCallback(() => {
    setActive(true);
    if (activeTimer.current) window.clearTimeout(activeTimer.current);
    activeTimer.current = window.setTimeout(() => setActive(false), 1800);
  }, []);

  const positionNode = useCallback(() => {
    const track = trackRef.current;
    const node = nodeRef.current;
    if (!track || !node) return;

    currentProgress.current += (targetProgress.current - currentProgress.current) * 0.105;
    currentProgress.current = clamp01(currentProgress.current);
    const maxTravel = Math.max(0, track.clientHeight - node.clientHeight);
    node.style.transform = `translate3d(-50%, ${currentProgress.current * maxTravel}px, 0)`;

    if (Math.abs(targetProgress.current - currentProgress.current) > 0.001) {
      animationFrame.current = window.requestAnimationFrame(positionNode);
    } else {
      animationFrame.current = null;
    }
  }, []);

  const updateTarget = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const maxScroll = textarea.scrollHeight - textarea.clientHeight;
    const nextScrollable = maxScroll > 8;
    const nextProgress = nextScrollable ? textarea.scrollTop / maxScroll : 0;

    setScrollable(nextScrollable);
    targetProgress.current = clamp01(Number.isFinite(nextProgress) ? nextProgress : 0);

    if (!animationFrame.current) {
      animationFrame.current = window.requestAnimationFrame(positionNode);
    }
  }, [positionNode]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const onScroll = () => {
      updateTarget();
      showIndicator();
    };
    const onActivity = () => showIndicator();
    const resizeObserver = new ResizeObserver(updateTarget);

    textarea.addEventListener("scroll", onScroll, { passive: true });
    textarea.addEventListener("pointermove", onActivity, { passive: true });
    textarea.addEventListener("pointerenter", onActivity, { passive: true });
    window.addEventListener("resize", updateTarget, { passive: true });
    resizeObserver.observe(textarea);
    window.requestAnimationFrame(updateTarget);

    return () => {
      textarea.removeEventListener("scroll", onScroll);
      textarea.removeEventListener("pointermove", onActivity);
      textarea.removeEventListener("pointerenter", onActivity);
      window.removeEventListener("resize", updateTarget);
      resizeObserver.disconnect();
      if (activeTimer.current) window.clearTimeout(activeTimer.current);
      if (animationFrame.current) window.cancelAnimationFrame(animationFrame.current);
    };
  }, [showIndicator, updateTarget]);

  useEffect(() => {
    window.requestAnimationFrame(updateTarget);
  }, [props.value, updateTarget]);

  return (
    <div
      className="flow-scroll-area relative h-full min-h-0 overflow-hidden"
      data-flow-active={active ? "true" : "false"}
      data-flow-scrollable={scrollable ? "true" : "false"}
    >
      <Textarea
        ref={(node) => {
          textareaRef.current = node;
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        className={cn("scrollbar-none h-full min-h-0 overflow-y-auto pr-8 font-mono text-sm [resize:none]", className)}
        {...props}
      />
      <div
        ref={trackRef}
        aria-hidden="true"
        className="flow-scroll-track pointer-events-none absolute bottom-6 right-3 top-6 z-30 w-px opacity-0 transition-opacity duration-700 ease-out"
      >
        <div ref={nodeRef} className="flow-scroll-node absolute left-1/2 top-0 h-4 w-1 rounded-full" />
      </div>
    </div>
  );
});

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}
