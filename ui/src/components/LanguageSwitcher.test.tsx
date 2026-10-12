// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { changeLocale, LANGUAGE_STORAGE_KEY } from "@/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("LanguageSwitcher", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(async () => {
    container.remove();
    await act(async () => {
      await changeLocale("en");
    });
    window.localStorage.clear();
  });

  it("switches the UI between English and Traditional Chinese and remembers the choice", async () => {
    const root = createRoot(container);
    await act(async () => {
      root.render(<LanguageSwitcher />);
    });

    const buttons = () => Array.from(container.querySelectorAll("button"));
    expect(buttons().map((button) => button.textContent)).toEqual(["English", "繁體中文"]);
    expect(buttons()[0]?.getAttribute("aria-pressed")).toBe("true");
    expect(container.textContent).toContain("Choose the display language.");

    await act(async () => {
      buttons()[1]?.click();
    });

    expect(buttons()[1]?.getAttribute("aria-pressed")).toBe("true");
    expect(container.textContent).toContain("選擇顯示語言。");
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("zh-TW");

    await act(async () => root.unmount());
  });
});
