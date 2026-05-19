export const ANIMATION_STORAGE_KEY = "potoki.animation";

export type AnimationPreferences = {
  enabled: boolean;
  rippleFrequency: number;
  waveIntensity: number;
};

export const DEFAULT_ANIMATION_PREFERENCES: AnimationPreferences = {
  enabled: true,
  rippleFrequency: 50,
  waveIntensity: 50,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeStored(raw: unknown): AnimationPreferences | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  if (typeof record.enabled !== "boolean") return null;
  if (typeof record.rippleFrequency !== "number" || typeof record.waveIntensity !== "number") return null;
  return {
    enabled: record.enabled,
    rippleFrequency: clamp(record.rippleFrequency, 0, 100),
    waveIntensity: clamp(record.waveIntensity, 0, 100),
  };
}

export function loadAnimationPreferences(): AnimationPreferences {
  if (typeof window === "undefined") return { ...DEFAULT_ANIMATION_PREFERENCES };
  try {
    const raw = window.localStorage.getItem(ANIMATION_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_ANIMATION_PREFERENCES };
    return normalizeStored(JSON.parse(raw)) ?? { ...DEFAULT_ANIMATION_PREFERENCES };
  } catch {
    return { ...DEFAULT_ANIMATION_PREFERENCES };
  }
}

export function saveAnimationPreferences(preferences: AnimationPreferences) {
  window.localStorage.setItem(ANIMATION_STORAGE_KEY, JSON.stringify(preferences));
}

/** Click spawn throttle (ms). Higher frequency → shorter interval. */
export function rippleSpawnThrottleMs(frequency: number) {
  const t = clamp(frequency, 0, 100) / 100;
  return Math.round(2000 - t * 1400);
}

/** Idle canvas drop scheduling (ms). Higher frequency → shorter waits. */
export function rippleIdleDropRangeMs(frequency: number) {
  const t = clamp(frequency, 0, 100) / 100;
  const min = Math.round(45000 - t * 30000);
  const max = Math.round(60000 - t * 38000);
  return { min, max: Math.max(min + 5000, max) };
}

/** Scales canvas ripple stroke alpha. */
export function rippleAlphaMultiplier(waveIntensity: number) {
  const t = clamp(waveIntensity, 0, 100) / 100;
  return 0.55 + t * 0.9;
}

/** CSS ambient wave layer opacity multiplier (1 = default at 50). */
export function waveOpacityMultiplier(waveIntensity: number) {
  const t = clamp(waveIntensity, 0, 100) / 100;
  return 0.5 + t;
}

/** CSS ambient drift speed multiplier (1 = default at 50). */
export function waveDriftScale(waveIntensity: number) {
  const t = clamp(waveIntensity, 0, 100) / 100;
  return 0.65 + t * 0.7;
}
