import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  loadAnimationPreferences,
  saveAnimationPreferences,
  type AnimationPreferences,
} from "./animationPreferences";

function readPrefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type AnimationPreferencesContextValue = {
  preferences: AnimationPreferences;
  setPreferences: (patch: Partial<AnimationPreferences>) => void;
  prefersReducedMotion: boolean;
  motionEnabled: boolean;
};

const AnimationPreferencesContext = createContext<AnimationPreferencesContextValue | null>(null);

export function AnimationPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferencesState] = useState<AnimationPreferences>(loadAnimationPreferences);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(readPrefersReducedMotion);

  useEffect(() => {
    saveAnimationPreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const setPreferences = useCallback((patch: Partial<AnimationPreferences>) => {
    setPreferencesState((prev) => ({
      enabled: patch.enabled ?? prev.enabled,
      rippleFrequency: clamp(patch.rippleFrequency ?? prev.rippleFrequency, 0, 100),
      waveIntensity: clamp(patch.waveIntensity ?? prev.waveIntensity, 0, 100),
    }));
  }, []);

  const motionEnabled = preferences.enabled && !prefersReducedMotion;

  const value = useMemo(
    () => ({ preferences, setPreferences, prefersReducedMotion, motionEnabled }),
    [preferences, setPreferences, prefersReducedMotion, motionEnabled],
  );

  return <AnimationPreferencesContext.Provider value={value}>{children}</AnimationPreferencesContext.Provider>;
}

export function useAnimationPreferences() {
  const context = useContext(AnimationPreferencesContext);
  if (!context) throw new Error("useAnimationPreferences must be used inside AnimationPreferencesProvider");
  return context;
}
