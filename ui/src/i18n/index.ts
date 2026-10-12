import i18n, { type InitOptions, type TOptions } from "i18next";
import { initReactI18next, useTranslation as useReactI18nextTranslation } from "react-i18next";

import {
  LANGUAGE_STORAGE_KEY,
  isSelectableLocale,
  resolveInitialLocale,
  type SelectableLocale,
} from "./language";
import { DEFAULT_LOCALE, i18nextResources, supportedLocales } from "./locales";

function safeLocalStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

const i18nextOptions: InitOptions = {
  resources: i18nextResources,
  lng: resolveInitialLocale(
    safeLocalStorage(),
    typeof navigator === "undefined" ? [] : (navigator.languages ?? [navigator.language]),
  ),
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: supportedLocales,
  defaultNS: "translation",
  interpolation: { escapeValue: false },
  returnObjects: false,
  initAsync: false,
};

function syncDocumentLanguage(locale: string) {
  if (typeof document !== "undefined") document.documentElement.lang = locale;
}

void i18n.use(initReactI18next).init(i18nextOptions).catch((error: unknown) => {
  console.error("Failed to initialize i18next", error);
});

syncDocumentLanguage(i18n.language);
i18n.on("languageChanged", syncDocumentLanguage);

export function t(key: string, options: TOptions = {}) {
  return i18n.t(key, options);
}

/** Switches the UI language and remembers the choice for the next visit. */
export async function changeLocale(locale: SelectableLocale) {
  if (!isSelectableLocale(locale)) return;
  try {
    safeLocalStorage()?.setItem(LANGUAGE_STORAGE_KEY, locale);
  } catch {
    // Persisting is best-effort; the in-memory switch still applies.
  }
  await i18n.changeLanguage(locale);
}

export const useTranslation = useReactI18nextTranslation;
export { i18n };
export * from "./language";
