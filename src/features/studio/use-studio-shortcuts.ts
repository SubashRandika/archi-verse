import { useEffect } from "react";
import { useStudioSessionStore } from "./studio-session";

/** Elements where typing must never trigger shortcuts. */
const TEXT_ENTRY = "input, textarea, select, [contenteditable=''], [contenteditable='true']";
/** Widgets that use these keys themselves (activation, arrow navigation, dismissal). */
const OWNS_SPACE = `${TEXT_ENTRY}, button, a[href], [role='button'], [role='checkbox'], [role='switch'], [role='tab'], [role='menuitem'], [role='menuitemradio'], [role='option'], [role='radio']`;
const OWNS_ARROWS = `${TEXT_ENTRY}, [role='slider'], [role='separator'], [role='tablist'], [role='tab'], [role='menu'], [role='menuitem'], [role='menuitemradio'], [role='listbox'], [role='radiogroup'], [role='group'], [aria-pressed]`;
const OWNS_ESCAPE = "[role='dialog'], [role='alertdialog'], [role='menu'], [role='listbox']";

/**
 * Studio keyboard shortcuts: Space play/pause, ← → previous/next step, R restart,
 * Esc clear the selection. Ignored while typing or when the focused widget uses the key.
 */
export function useStudioShortcuts() {
  const store = useStudioSessionStore();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target instanceof Element ? event.target : null;
      const owns = (selector: string) => Boolean(target?.closest(selector));
      const session = store.getState();

      switch (event.key) {
        case " ":
          if (owns(OWNS_SPACE)) return;
          session.togglePlaying();
          break;
        case "ArrowRight":
          if (owns(OWNS_ARROWS) || session.stepIndex >= session.stepCount - 1) return;
          session.nextStep();
          break;
        case "ArrowLeft":
          if (owns(OWNS_ARROWS) || session.stepIndex <= 0) return;
          session.previousStep();
          break;
        case "r":
        case "R":
          if (owns(TEXT_ENTRY) || event.shiftKey) return;
          session.restart();
          break;
        case "Escape":
          if (owns(OWNS_ESCAPE) || !session.selectedId) return;
          session.select(null);
          break;
        default:
          return;
      }
      event.preventDefault();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [store]);
}
