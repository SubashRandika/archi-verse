import { resolveTheme, THEME_BOOT_SCRIPT, THEME_PREFERENCES } from "./theme";

const STORAGE_KEY = "archiverse:preferences";

function runBootScript({ saved, systemLight }: { saved?: string; systemLight: boolean }) {
  localStorage.clear();
  if (saved !== undefined) localStorage.setItem(STORAGE_KEY, saved);
  window.matchMedia = ((query: string) => ({
    matches: query === "(prefers-color-scheme: light)" && systemLight,
  })) as unknown as typeof window.matchMedia;
  delete document.documentElement.dataset.theme;
  new Function(THEME_BOOT_SCRIPT)();
  return document.documentElement.dataset.theme;
}

describe("resolveTheme", () => {
  it("uses an explicit choice whatever the system says", () => {
    expect(resolveTheme("dark", true)).toBe("dark");
    expect(resolveTheme("light", false)).toBe("light");
  });

  it("follows the system when set to system", () => {
    expect(resolveTheme("system", true)).toBe("light");
    expect(resolveTheme("system", false)).toBe("dark");
  });
});

describe("THEME_BOOT_SCRIPT", () => {
  afterEach(() => vi.restoreAllMocks());

  it("matches resolveTheme for every saved preference", () => {
    for (const preference of THEME_PREFERENCES) {
      for (const systemLight of [true, false]) {
        const saved = JSON.stringify({ state: { theme: preference }, version: 1 });
        expect(runBootScript({ saved, systemLight })).toBe(resolveTheme(preference, systemLight));
      }
    }
  });

  it("falls back to dark when storage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(runBootScript({ systemLight: true })).toBe("dark");
  });

  it("falls back to dark for missing, unreadable or unknown values", () => {
    expect(runBootScript({ systemLight: true })).toBe("dark");
    expect(runBootScript({ saved: "{not json", systemLight: true })).toBe("dark");
    const blue = JSON.stringify({ state: { theme: "blue" }, version: 1 });
    expect(runBootScript({ saved: blue, systemLight: true })).toBe("dark");
  });
});
