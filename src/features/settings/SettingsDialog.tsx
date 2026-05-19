import { Check } from "lucide-react";
import { Dialog } from "../../components/ui/dialog";
import { cn } from "../../components/ui/utils";
import { useI18n, type Language } from "../../core/i18n";
import { useAnimationPreferences } from "../../core/preferences/AnimationPreferencesProvider";

const languageOptions: Array<{ value: Language; labelKey: "settings.language.polish" | "settings.language.english" }> = [
  { value: "pl", labelKey: "settings.language.polish" },
  { value: "en", labelKey: "settings.language.english" },
];

type SliderProps = {
  id: string;
  label: string;
  hint: string;
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
};

function AnimationSlider({ id, label, hint, value, disabled, onChange }: SliderProps) {
  return (
    <div className={cn("space-y-2", disabled && "opacity-45")}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm text-foreground/90">
          {label}
        </label>
        <span className="tabular-nums text-xs text-muted-foreground">{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/[0.06] accent-primary disabled:cursor-not-allowed"
      />
      <p className="text-xs leading-5 text-muted-foreground">{hint}</p>
    </div>
  );
}

export function SettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { language, setLanguage, t } = useI18n();
  const { preferences, setPreferences, prefersReducedMotion } = useAnimationPreferences();
  const slidersDisabled = !preferences.enabled;

  return (
    <Dialog open={open} title={t("settings.title")} onClose={onClose} className="max-w-[600px]">
      <div className="space-y-8">
        <p className="max-w-md text-sm leading-6 text-muted-foreground">{t("settings.description")}</p>

        <section>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-foreground/92">{t("settings.language.section")}</h3>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{t("settings.language.label")}</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {languageOptions.map((option) => {
              const selected = language === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLanguage(option.value)}
                  className={cn(
                    "group flex items-center justify-between rounded-xl border border-white/[0.045] bg-white/[0.026] px-4 py-3 text-left transition duration-200 ease-out hover:border-primary/18 hover:bg-primary/[0.045]",
                    selected && "border-primary/24 bg-primary/[0.075] text-primary-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.10)]",
                  )}
                >
                  <span>
                    <span className="block text-sm font-medium">{t(option.labelKey)}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{option.value.toUpperCase()}</span>
                  </span>
                  <span
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-full border border-white/[0.06] text-transparent transition",
                      selected && "border-primary/24 bg-primary/[0.12] text-primary-foreground",
                    )}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-foreground/92">{t("settings.animations.section")}</h3>
          </div>

          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4 rounded-xl border border-white/[0.045] bg-white/[0.026] px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground/92">{t("settings.animations.enabled")}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{t("settings.animations.enabledHint")}</p>
                {prefersReducedMotion ? (
                  <p className="mt-2 text-xs leading-5 text-muted-foreground/90">{t("settings.animations.systemReduced")}</p>
                ) : null}
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.enabled}
                onClick={() => setPreferences({ enabled: !preferences.enabled })}
                className={cn(
                  "shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition duration-200 ease-out",
                  preferences.enabled
                    ? "border-primary/24 bg-primary/[0.12] text-primary-foreground"
                    : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:border-white/[0.1] hover:bg-white/[0.04]",
                )}
              >
                {preferences.enabled ? t("settings.animations.on") : t("settings.animations.off")}
              </button>
            </div>

            <AnimationSlider
              id="animation-ripple-frequency"
              label={t("settings.animations.rippleFrequency")}
              hint={t("settings.animations.rippleFrequencyHint")}
              value={preferences.rippleFrequency}
              disabled={slidersDisabled}
              onChange={(rippleFrequency) => setPreferences({ rippleFrequency })}
            />

            <AnimationSlider
              id="animation-wave-intensity"
              label={t("settings.animations.waveIntensity")}
              hint={t("settings.animations.waveIntensityHint")}
              value={preferences.waveIntensity}
              disabled={slidersDisabled}
              onChange={(waveIntensity) => setPreferences({ waveIntensity })}
            />
          </div>
        </section>

        <div className="rounded-xl bg-white/[0.018] px-4 py-3 text-xs leading-5 text-muted-foreground">
          {t("settings.futureHint")}
        </div>
      </div>
    </Dialog>
  );
}
