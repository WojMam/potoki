import { Check } from "lucide-react";
import { Dialog } from "../../components/ui/dialog";
import { cn } from "../../components/ui/utils";
import { useI18n, type Language } from "../../core/i18n";

const languageOptions: Array<{ value: Language; labelKey: "settings.language.polish" | "settings.language.english" }> = [
  { value: "pl", labelKey: "settings.language.polish" },
  { value: "en", labelKey: "settings.language.english" },
];

export function SettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { language, setLanguage, t } = useI18n();

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

        <div className="rounded-xl bg-white/[0.018] px-4 py-3 text-xs leading-5 text-muted-foreground">
          {t("settings.futureHint")}
        </div>
      </div>
    </Dialog>
  );
}
