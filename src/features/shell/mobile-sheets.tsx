"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

/*
 * Drawers used below the desktop breakpoint, loaded the first time one opens (ADR-0009).
 */

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

/** The learning navigation as a drawer (tablet and mobile). */
export function NavigationSheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[min(88vw,22rem)] gap-0 bg-hull p-0">
        <SheetTitle className="sr-only">Learning navigation</SheetTitle>
        <SheetDescription className="sr-only">Browse categories and concepts.</SheetDescription>
        {children}
      </SheetContent>
    </Sheet>
  );
}

/** The explanation panel as a bottom sheet (mobile). */
export function ExplanationSheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="gap-0 rounded-t-xl bg-hull p-0 data-[side=bottom]:h-[78dvh]"
      >
        <div className="relative flex h-9 shrink-0 items-center justify-center border-b border-rule">
          <span aria-hidden="true" className="h-1 w-10 rounded-full bg-rule-strong" />
          <SheetClose
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Close explanation"
                className="absolute right-2 text-graphite hover:text-paper"
              />
            }
          >
            <X />
          </SheetClose>
        </div>
        <SheetTitle className="sr-only">Explanation</SheetTitle>
        <SheetDescription className="sr-only">
          Explanation for the current step and details of the selected component.
        </SheetDescription>
        {children}
      </SheetContent>
    </Sheet>
  );
}
