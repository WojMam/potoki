import { cn } from "../ui/utils";
import { useI18n } from "../../core/i18n";

export type AppModule = "potoki" | "harbor";

export function ModuleSwitch({
  value,
  onChange,
  collapsed,
}: {
  value: AppModule;
  onChange: (module: AppModule) => void;
  collapsed?: boolean;
}) {
  const { t } = useI18n();

  if (collapsed) return null;

  const items: Array<{ id: AppModule; label: string }> = [
    { id: "potoki", label: t("module.potoki") },
    { id: "harbor", label: t("module.harbor") },
  ];

  return (
    <div className="px-4 pb-3">
      <div className="flex rounded-xl bg-black/[0.12] p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            onClick={() => onChange(item.id)}
            className={cn(
              "flex-1 rounded-lg px-2 py-1.5 text-center text-[11px] font-medium tracking-wide transition duration-200 ease-out",
              value === item.id
                ? "bg-primary/[0.12] text-primary-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.14)]"
                : "text-muted-foreground/72 hover:text-foreground/88",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
