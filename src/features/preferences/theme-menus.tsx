"use client";

import { type LazyMenuProps, useLazyMenuState } from "@/components/lazy-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStrings } from "@/features/locale/use-strings";
import { THEME_PREFERENCES, type ThemePreference } from "@/lib/theme";

/** The theme menu's popup, loaded on first use (see `lazyMenu`). */

export interface ThemeMenuPopupProps {
  theme: ThemePreference;
  onChange: (theme: ThemePreference) => void;
}

export function ThemeMenuPopup({
  theme,
  onChange,
  trigger,
  defaultOpen,
}: ThemeMenuPopupProps & LazyMenuProps) {
  const { open, onOpenChange, triggerRef } = useLazyMenuState(defaultOpen);
  const t = useStrings();
  const names: Record<ThemePreference, string> = {
    dark: t.themeDark,
    light: t.themeLight,
    system: t.themeSystem,
  };
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger ref={triggerRef} render={trigger} />
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t.theme}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={theme}
            onValueChange={(value) => onChange(value as ThemePreference)}
          >
            {THEME_PREFERENCES.map((option) => (
              <DropdownMenuRadioItem key={option} value={option}>
                {names[option]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
