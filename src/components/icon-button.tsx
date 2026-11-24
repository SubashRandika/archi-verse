"use client";

import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type IconButtonProps = Omit<ComponentProps<typeof Button>, "children" | "aria-label"> & {
  /** Accessible name; also shown as the tooltip. */
  label: string;
  icon: ReactNode;
  tooltipSide?: "top" | "right" | "bottom" | "left";
};

/**
 * Icon-only button with a guaranteed accessible name and a matching tooltip.
 * Every icon-only control in the app should use this component.
 */
export function IconButton({
  label,
  icon,
  tooltipSide = "bottom",
  variant = "ghost",
  size = "icon",
  ...props
}: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<Button variant={variant} size={size} aria-label={label} {...props} />}
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>{label}</TooltipContent>
    </Tooltip>
  );
}
