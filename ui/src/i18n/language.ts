/**
 * Languages offered in the language picker. Only locales whose message files
 * are complete belong here; every other locale file falls back to English.
 */
export const SELECTABLE_LOCALES = [
  { code: "en", label: "English" },
  { code: "zh-TW", label: "繁體中文" },
] as const;

export type SelectableLocale = (typeof SELECTABLE_LOCALES)[number]["code"];

export const DEFAULT_SELECTABLE_LOCALE: SelectableLocale = "en";
export const LANGUAGE_STORAGE_KEY = "paperclip.language";

export function isSelectableLocale(value: unknown): value is SelectableLocale {
  return SELECTABLE_LOCALES.some((locale) => locale.code === value);
}

/** Maps a BCP 47 tag such as `zh-Hant-HK` or `en-GB` to a selectable locale. */
export function matchSelectableLocale(tag: string | null | undefined): SelectableLocale | null {
  if (!tag) return null;
  const normalized = tag.toLowerCase().replace(/_/g, "-");
  if (normalized === "zh" || normalized.startsWith("zh-")) {
    // Simplified Chinese has no locale yet; do not show it Traditional text.
    return /^zh-(cn|sg|hans)/.test(normalized) ? null : "zh-TW";
  }
  if (normalized === "en" || normalized.startsWith("en-")) return "en";
  return null;
}

type StorageReader = Pick<Storage, "getItem">;

/** Resolves the startup language: saved choice, then browser preference, then English. */
export function resolveInitialLocale(
  storage: StorageReader | null,
  browserLanguages: readonly string[] = [],
): SelectableLocale {
  try {
    const stored = storage?.getItem(LANGUAGE_STORAGE_KEY);
    if (isSelectableLocale(stored)) return stored;
  } catch {
    // Storage can throw in private mode or when blocked; fall through.
  }
  for (const tag of browserLanguages) {
    const match = matchSelectableLocale(tag);
    if (match) return match;
  }
  return DEFAULT_SELECTABLE_LOCALE;
}
