"use client";

import { type LazyMenuProps, useLazyMenuState } from "@/components/lazy-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ExplorerFilter, StatusFilter } from "./filter";

/*
 * The sidebar's menus and the reset dialog, loaded on first use (see `lazyMenu`). Their
 * triggers are built by the sidebar, so they render before this module loads.
 */

const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  all: "All concepts",
  "not-started": "Not started",
  "in-progress": "In progress",
  completed: "Completed",
};

export interface FilterMenuProps {
  filter: ExplorerFilter;
  onChange: (update: (current: ExplorerFilter) => ExplorerFilter) => void;
}

export function FilterMenu({
  filter,
  onChange,
  trigger,
  defaultOpen,
}: FilterMenuProps & LazyMenuProps) {
  const { open, onOpenChange, triggerRef } = useLazyMenuState(defaultOpen);
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger ref={triggerRef} render={trigger} />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Show</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={filter.status}
            onValueChange={(status) =>
              onChange((current) => ({ ...current, status: status as StatusFilter }))
            }
          >
            {(Object.keys(STATUS_FILTER_LABELS) as StatusFilter[]).map((status) => (
              <DropdownMenuRadioItem key={status} value={status}>
                {STATUS_FILTER_LABELS[status]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={filter.withVisualizationOnly}
          onCheckedChange={(checked) =>
            onChange((current) => ({ ...current, withVisualizationOnly: checked }))
          }
        >
          Only with a visualization
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export interface ProgressMenuProps {
  canReset: boolean;
  onReset: () => void;
}

export function ProgressMenu({
  canReset,
  onReset,
  trigger,
  defaultOpen,
}: ProgressMenuProps & LazyMenuProps) {
  const { open, onOpenChange, triggerRef } = useLazyMenuState(defaultOpen);
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger ref={triggerRef} render={trigger} />
      <DropdownMenuContent side="top" align="end" className="w-48">
        <DropdownMenuItem variant="destructive" disabled={!canReset} onClick={onReset}>
          Reset progress…
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export interface ResetProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ResetProgressDialog({ open, onOpenChange, onConfirm }: ResetProgressDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
          <AlertDialogDescription>
            This clears the status of every concept saved in this browser. It can’t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep progress</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Reset progress
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
