import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useAnimationPreferences } from "../../core/preferences/AnimationPreferencesProvider";
import {
  rippleAlphaMultiplier,
  rippleIdleDropRangeMs,
  rippleSpawnThrottleMs,
} from "../../core/preferences/animationPreferences";
import { advanceRipples, createRipple, drawRipples, type RippleRing } from "./ambientRipple";

export type AmbientRippleLayerHandle = {
  spawn: (x: number, y: number) => void;
};

type Props = {
  enableIdleDrops?: boolean;
};

const MAX_RIPPLES = 6;
const IDLE_QUIET_MS = 8000;

export const AmbientRippleLayer = forwardRef<AmbientRippleLayerHandle, Props>(function AmbientRippleLayer(
  { enableIdleDrops = true },
  ref,
) {
  const { motionEnabled, preferences } = useAnimationPreferences();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ringsRef = useRef<RippleRing[]>([]);
  const frameRef = useRef<number | null>(null);
  const tickLastRef = useRef<number | null>(null);
  const lastSpawnRef = useRef(0);
  const lastActivityRef = useRef(Date.now());
  const idleTimerRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const motionEnabledRef = useRef(motionEnabled);
  const preferencesRef = useRef(preferences);

  motionEnabledRef.current = motionEnabled;
  preferencesRef.current = preferences;

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { innerWidth: width, innerHeight: height } = window;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const spawnAt = (x: number, y: number) => {
    if (!motionEnabledRef.current || !visibleRef.current) return;
    const prefs = preferencesRef.current;
    const throttleMs = rippleSpawnThrottleMs(prefs.rippleFrequency);
    const now = Date.now();
    if (now - lastSpawnRef.current < throttleMs) return;
    lastSpawnRef.current = now;
    lastActivityRef.current = now;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    const alphaMul = rippleAlphaMultiplier(prefs.waveIntensity);
    const next = createRipple(x, y, width, height).map((ring) => ({
      ...ring,
      alpha: ring.alpha * alphaMul,
    }));
    ringsRef.current = [...ringsRef.current, ...next].slice(-MAX_RIPPLES);
    startLoop();
  };

  const spawnIdleDrop = () => {
    if (!enableIdleDrops || !motionEnabledRef.current || !visibleRef.current) return;
    if (Date.now() - lastActivityRef.current < IDLE_QUIET_MS) {
      scheduleIdleDrop();
      return;
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    const marginX = width * 0.12;
    const marginY = height * 0.1;
    const x = marginX + Math.random() * (width - marginX * 2);
    const y = marginY + Math.random() * (height - marginY * 2);
    lastSpawnRef.current = 0;
    spawnAt(x, y);
    scheduleIdleDrop();
  };

  const scheduleIdleDrop = () => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    if (!enableIdleDrops || !motionEnabledRef.current) return;
    const { min, max } = rippleIdleDropRangeMs(preferencesRef.current.rippleFrequency);
    const delay = min + Math.random() * (max - min);
    idleTimerRef.current = window.setTimeout(spawnIdleDrop, delay);
  };

  const tick = (timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) {
      frameRef.current = null;
      return;
    }

    const last = tickLastRef.current ?? timestamp;
    tickLastRef.current = timestamp;
    const deltaMs = Math.min(48, timestamp - last);

    const alive = advanceRipples(ringsRef.current, deltaMs);
    drawRipples(ctx, ringsRef.current);

    if (alive && visibleRef.current && motionEnabledRef.current) {
      frameRef.current = window.requestAnimationFrame(tick);
    } else {
      frameRef.current = null;
      ringsRef.current = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const startLoop = () => {
    if (frameRef.current || !motionEnabledRef.current || !visibleRef.current) return;
    tickLastRef.current = null;
    frameRef.current = window.requestAnimationFrame(tick);
  };

  const stopLoop = () => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    tickLastRef.current = null;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    ringsRef.current = [];
  };

  useImperativeHandle(ref, () => ({ spawn: spawnAt }), []);

  useEffect(() => {
    const onVisibility = () => {
      visibleRef.current = document.visibilityState === "visible";
      if (!visibleRef.current) stopLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => resizeCanvas();
    resizeCanvas();
    window.addEventListener("resize", onResize);

    const observer = new ResizeObserver(onResize);
    if (canvasRef.current) observer.observe(canvasRef.current);

    if (motionEnabled && enableIdleDrops) scheduleIdleDrop();
    else {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
      stopLoop();
    }

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
      stopLoop();
    };
  }, [enableIdleDrops, motionEnabled, preferences.rippleFrequency]);

  const noteActivity = () => {
    lastActivityRef.current = Date.now();
  };

  useEffect(() => {
    window.addEventListener("pointerdown", noteActivity, { passive: true });
    window.addEventListener("wheel", noteActivity, { passive: true });
    window.addEventListener("keydown", noteActivity, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", noteActivity);
      window.removeEventListener("wheel", noteActivity);
      window.removeEventListener("keydown", noteActivity);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
});
