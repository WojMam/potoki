import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useRef } from "react";
import { useAnimationPreferences } from "../../core/preferences/AnimationPreferencesProvider";
import { waveDriftScale, waveOpacityMultiplier } from "../../core/preferences/animationPreferences";
import { cn } from "../ui/utils";
import { AmbientRippleLayer, type AmbientRippleLayerHandle } from "./AmbientRippleLayer";
import { shouldBlockAmbientRipple } from "./ambientRipple";

type Props = {
  children: ReactNode;
  className?: string;
  enableIdleDrops?: boolean;
};

export function WorkspaceAmbientShell({ children, className, enableIdleDrops = true }: Props) {
  const rippleRef = useRef<AmbientRippleLayerHandle>(null);
  const { motionEnabled, preferences } = useAnimationPreferences();
  const waveOpacity = waveOpacityMultiplier(preferences.waveIntensity);
  const waveDrift = waveDriftScale(preferences.waveIntensity);

  const handlePointerDownCapture = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if (!motionEnabled) return;
    if (shouldBlockAmbientRipple(event.target)) return;
    rippleRef.current?.spawn(event.clientX, event.clientY);
  };

  const shellStyle = {
    "--ambient-wave-opacity": String(waveOpacity),
    "--ambient-wave-drift-scale": String(waveDrift),
  } as CSSProperties;

  return (
    <div
      className={cn("workspace-bg", !motionEnabled && "ambient-motion-off", className)}
      style={shellStyle}
      onPointerDownCapture={handlePointerDownCapture}
    >
      <AmbientRippleLayer ref={rippleRef} enableIdleDrops={enableIdleDrops && motionEnabled} />
      {children}
    </div>
  );
}
