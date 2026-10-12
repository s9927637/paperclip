import { Languages } from "lucide-react";

import { SELECTABLE_LOCALES, changeLocale, isSelectableLocale, useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";

type LanguageSwitcherVariant = "menu-action" | "compact";

interface LanguageSwitcherProps {
  className?: string;
  /**
   * `menu-action` (default): label + description row with a segmented picker,
   * matching the rows in `SidebarAccountMenu`.
   *
   * `compact`: just the segmented picker, for surfaces like the signed-out
   * `/auth` chrome.
   */
  variant?: LanguageSwitcherVariant;
}

/** English / 繁體中文 picker. The choice is persisted by `changeLocale`. */
export function LanguageSwitcher({ className, variant = "menu-action" }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const active = isSelectableLocale(i18n.resolvedLanguage) ? i18n.resolvedLanguage : "en";

  const picker = (
    <div
      role="group"
      aria-label={t("language.label")}
      className="inline-flex shrink-0 rounded-lg border border-border bg-background/70 p-0.5"
    >
      {SELECTABLE_LOCALES.map((locale) => (
        <button
          key={locale.code}
          type="button"
          lang={locale.code}
          aria-pressed={active === locale.code}
          onClick={() => void changeLocale(locale.code)}
          className={cn(
            "rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active === locale.code
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {locale.label}
        </button>
      ))}
    </div>
  );

  if (variant === "compact") {
    return <div className={className}>{picker}</div>;
  }

  return (
    <div className={cn("flex w-full items-start gap-3 rounded-xl px-3 py-3", className)}>
      <span className="mt-0.5 rounded-lg border border-border bg-background/70 p-2 text-muted-foreground">
        <Languages className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground">{t("language.label")}</span>
        <span className="mb-2 block text-xs text-muted-foreground">{t("language.description")}</span>
        {picker}
      </span>
    </div>
  );
}
