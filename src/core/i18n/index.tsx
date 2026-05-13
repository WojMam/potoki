import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { TimelineEntryType } from "../models/timeline";
import type { WorkstreamStatus } from "../models/workstream";
import { en } from "./translations.en";
import { pl } from "./translations.pl";

export type Language = "pl" | "en";
type TranslationKey = keyof typeof pl;
type TranslationMap = Record<TranslationKey, string>;

const translations: Record<Language, TranslationMap> = { pl, en };
const storageKey = "potoki.language";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  statusLabel: (status: WorkstreamStatus) => string;
  timelineTypeLabel: (type: TimelineEntryType) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readInitialLanguage(): Language {
  if (typeof window === "undefined") return "pl";
  return window.localStorage.getItem(storageKey) === "en" ? "en" : "pl";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(storageKey, language);
  }, [language]);

  const value = useMemo<I18nContextValue>(() => {
    const t = (key: TranslationKey, params?: Record<string, string | number>) => {
      const template = translations[language][key] ?? key;
      if (!params) return template;
      return Object.entries(params).reduce(
        (text, [name, replacement]) => text.replaceAll(`{${name}}`, String(replacement)),
        template,
      );
    };

    return {
      language,
      setLanguage: setLanguageState,
      t,
      statusLabel: (status) => t(`status.${status}` as TranslationKey),
      timelineTypeLabel: (type) => t(`timeline.type.${type}` as TranslationKey),
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside LanguageProvider");
  return context;
}

export type { TranslationKey };
