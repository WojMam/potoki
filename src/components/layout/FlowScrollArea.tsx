import * as React from "react";
import { cn } from "../ui/utils";

type FlowScrollAreaProps = {
  as?: "div" | "main";
  children: React.ReactNode;
  className?: string;
  viewportClassName?: string;
};

export function FlowScrollArea({
  as: Component = "div",
  children,
  className,
  viewportClassName,
}: FlowScrollAreaProps) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const nodeRef = React.useRef<HTMLDivElement | null>(null);
  const activeTimer = React.useRef<number | null>(null);
  const animationFrame = React.useRef<number | null>(null);
  const currentProgress = React.useRef(0);
  const targetProgress = React.useRef(0);
  const [active, setActive] = React.useState(false);
  const [scrollable, setScrollable] = React.useState(false);

  const showIndicator = React.useCallback(() => {
    setActive(true);
    if (activeTimer.current) window.clearTimeout(activeTimer.current);
    activeTimer.current = window.setTimeout(() => setActive(false), 1800);
  }, []);

  const positionNode = React.useCallback(() => {
    const track = trackRef.current;
    const node = nodeRef.current;
    if (!track || !node) return;

    currentProgress.current += (targetProgress.current - currentProgress.current) * 0.105;
    currentProgress.current = clamp01(currentProgress.current);
    const maxTravel = Math.max(0, track.clientHeight - node.clientHeight);
    const y = currentProgress.current * maxTravel;
    node.style.transform = `translate3d(-50%, ${y}px, 0)`;

    if (Math.abs(targetProgress.current - currentProgress.current) > 0.001) {
      animationFrame.current = window.requestAnimationFrame(positionNode);
    } else {
      animationFrame.current = null;
    }
  }, []);

  const updateTarget = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const viewportMaxScroll = viewport.scrollHeight - viewport.clientHeight;
    let nextScrollable = viewportMaxScroll > 8;
    let nextProgress = nextScrollable ? viewport.scrollTop / viewportMaxScroll : 0;

    if (!nextScrollable) {
      const doc = document.documentElement;
      const body = document.body;
      const documentHeight = Math.max(doc.scrollHeight, body?.scrollHeight ?? 0);
      const windowMaxScroll = documentHeight - window.innerHeight;
      nextScrollable = windowMaxScroll > 8;
      nextProgress = nextScrollable ? window.scrollY / windowMaxScroll : 0;
    }

    setScrollable(nextScrollable);
    targetProgress.current = clamp01(Number.isFinite(nextProgress) ? nextProgress : 0);

    if (!animationFrame.current) {
      animationFrame.current = window.requestAnimationFrame(positionNode);
    }
  }, [positionNode]);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onScroll = () => {
      updateTarget();
      showIndicator();
    };

    const onActivity = () => showIndicator();
    const resizeObserver = new ResizeObserver(updateTarget);

    viewport.addEventListener("scroll", onScroll, { passive: true });
    viewport.addEventListener("pointermove", onActivity, { passive: true });
    viewport.addEventListener("pointerenter", onActivity, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateTarget, { passive: true });
    resizeObserver.observe(viewport);
    resizeObserver.observe(viewport.firstElementChild ?? viewport);
    window.requestAnimationFrame(updateTarget);

    return () => {
      viewport.removeEventListener("scroll", onScroll);
      viewport.removeEventListener("pointermove", onActivity);
      viewport.removeEventListener("pointerenter", onActivity);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateTarget);
      resizeObserver.disconnect();
      if (activeTimer.current) window.clearTimeout(activeTimer.current);
      if (animationFrame.current) window.cancelAnimationFrame(animationFrame.current);
    };
  }, [showIndicator, updateTarget]);

  return (
    <Component
      className={cn("flow-scroll-area relative min-h-0 overflow-hidden", className)}
      data-flow-active={active ? "true" : "false"}
      data-flow-scrollable={scrollable ? "true" : "false"}
    >
      <div ref={viewportRef} className={cn("scrollbar-none h-full max-h-full min-h-0 overflow-y-auto overscroll-contain", viewportClassName)}>
        {children}
      </div>
      <div
        ref={trackRef}
        aria-hidden="true"
        className="flow-scroll-track pointer-events-none absolute bottom-6 right-3 top-6 z-30 w-px opacity-0 transition-opacity duration-700 ease-out"
      >
        <div ref={nodeRef} className="flow-scroll-node absolute left-1/2 top-0 h-4 w-1 rounded-full" />
      </div>
    </Component>
  );
}

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}
