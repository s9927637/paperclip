// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";
import { changeLocale, i18n, t } from ".";
import { LANGUAGE_STORAGE_KEY, matchSelectableLocale, resolveInitialLocale } from "./language";

function storageWith(value: string | null) {
  return { getItem: () => value };
}

describe("resolveInitialLocale", () => {
  it("prefers a saved choice over the browser language", () => {
    expect(resolveInitialLocale(storageWith("zh-TW"), ["en-US"])).toBe("zh-TW");
    expect(resolveInitialLocale(storageWith("en"), ["zh-TW"])).toBe("en");
  });

  it("ignores saved values that are not selectable", () => {
    expect(resolveInitialLocale(storageWith("fr"), ["zh-TW"])).toBe("zh-TW");
    expect(resolveInitialLocale(storageWith("fr"), [])).toBe("en");
  });

  it("follows the first recognised browser language and defaults to English", () => {
    expect(resolveInitialLocale(null, ["de-DE", "zh-Hant-TW", "en"])).toBe("zh-TW");
    expect(resolveInitialLocale(null, ["fr-FR"])).toBe("en");
  });

  it("survives storage that throws", () => {
    const blocked = {
      getItem: () => {
        throw new Error("blocked");
      },
    };
    expect(resolveInitialLocale(blocked, ["zh-HK"])).toBe("zh-TW");
  });
});

describe("matchSelectableLocale", () => {
  it("maps Traditional Chinese variants and English regions", () => {
    expect(matchSelectableLocale("zh")).toBe("zh-TW");
    expect(matchSelectableLocale("zh_TW")).toBe("zh-TW");
    expect(matchSelectableLocale("zh-HK")).toBe("zh-TW");
    expect(matchSelectableLocale("en-GB")).toBe("en");
  });

  it("does not map Simplified Chinese or unknown tags", () => {
    expect(matchSelectableLocale("zh-CN")).toBeNull();
    expect(matchSelectableLocale("zh-Hans")).toBeNull();
    expect(matchSelectableLocale("ja")).toBeNull();
    expect(matchSelectableLocale(undefined)).toBeNull();
  });
});

describe("changeLocale", () => {
  afterEach(async () => {
    await changeLocale("en");
    window.localStorage.clear();
  });

  it("switches translations, persists the choice and updates <html lang>", async () => {
    expect(t("sidebar.inbox")).toBe("Inbox");

    await changeLocale("zh-TW");

    expect(i18n.language).toBe("zh-TW");
    expect(t("sidebar.inbox")).toBe("收件匣");
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("zh-TW");
    expect(document.documentElement.lang).toBe("zh-TW");
  });
});
