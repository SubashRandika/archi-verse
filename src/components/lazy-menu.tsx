"use client";

import {
  cloneElement,
  type ComponentType,
  lazy,
  type ReactElement,
  Suspense,
  useCallback,
  useState,
} from "react";

/** Props every lazily loaded menu receives, besides its own. */
export interface LazyMenuProps {
  /** The trigger element. The menu renders it through its own trigger (`render={trigger}`). */
  trigger: ReactElement;
  /** True when the menu mounts because of the first click, so it opens straight away. */
  defaultOpen: boolean;
}

/**
 * Open state for a lazily loaded menu: `<Menu open onOpenChange>` and `<Trigger ref>`.
 *
 * The first click replaces the placeholder trigger with the menu's own trigger, so focus is
 * moved to the new trigger *before* the menu opens. The menu then returns focus to it on close.
 */
export function useLazyMenuState(defaultOpen: boolean) {
  const [open, setOpen] = useState(defaultOpen);
  // Refs attach before the popup's focus manager runs (the trigger precedes the popup), so the
  // menu records this trigger as the element to return focus to.
  const triggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (node && defaultOpen) node.focus({ preventScroll: true });
    },
    [defaultOpen],
  );
  return { open, onOpenChange: setOpen, triggerRef };
}

interface PlaceholderTriggerProps {
  "aria-haspopup"?: "menu";
  "aria-expanded"?: boolean;
  onClick?: () => void;
  onFocus?: () => void;
  onPointerEnter?: () => void;
}

/**
 * Creates a menu whose code (the menu primitives and its popup) loads on first use, keeping it
 * out of the first-load JavaScript (ADR-0009).
 *
 * Until the first click, the trigger renders on its own: it looks the same and prefetches the
 * menu chunk on hover or focus. The first click mounts the real menu, already open; from then
 * on the real menu stays mounted.
 */
export function lazyMenu<P extends object>(load: () => Promise<ComponentType<P & LazyMenuProps>>) {
  let pending: Promise<{ default: ComponentType<P & LazyMenuProps> }> | undefined;
  const importOnce = () => (pending ??= load().then((component) => ({ default: component })));
  const prefetch = () => void importOnce();
  const Menu = lazy(importOnce);

  function LazyMenu({ trigger, ...props }: P & { trigger: ReactElement<PlaceholderTriggerProps> }) {
    const [requested, setRequested] = useState(false);
    const placeholder = cloneElement(trigger, {
      "aria-haspopup": "menu",
      "aria-expanded": false,
      onPointerEnter: prefetch,
      onFocus: prefetch,
      onClick: () => setRequested(true),
    });
    if (!requested) return placeholder;
    return (
      <Suspense fallback={placeholder}>
        <Menu {...(props as P)} trigger={trigger} defaultOpen />
      </Suspense>
    );
  }
  return LazyMenu;
}
