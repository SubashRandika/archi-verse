"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { lazyMenu } from "@/components/lazy-menu";
import { Button } from "@/components/ui/button";
import { useStrings } from "@/features/locale/use-strings";
import type { ThemePreference } from "@/lib/theme";
import { usePreferencesStore } from "./preferences-store";

const ThemeMenuPopup = lazyMenu(() =>
  import("./theme-menus").then((menus) => menus.ThemeMenuPopup),
);

const ICONS: Record<ThemePreference, typeof Moon> = { dark: Moon, light: Sun, system: Monitor };

/** Header control for the colour theme: Dark (default), Light or System. */
export function ThemeMenu() {
  const theme = usePreferencesStore((state) => state.theme);
  const setTheme = usePreferencesStore((state) => state.setTheme);
  const t = useStrings();
  const name = { dark: t.themeDark, light: t.themeLight, system: t.themeSystem }[theme];
  const Icon = ICONS[theme];
  return (
    <ThemeMenuPopup
      trigger={
        <Button
          variant="ghost"
          size="icon"
          aria-label={t.themeButton(name)}
          title={t.themeButton(name)}
          className="text-graphite hover:text-paper"
        >
          <Icon />
        </Button>
      }
      theme={theme}
      onChange={setTheme}
    />
  );
}
