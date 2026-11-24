import { cn } from "@/lib/utils";

/** Isometric cube mark: the smallest possible "drawing" of the product's visual language. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={cn("size-5 shrink-0", className)}
      fill="none"
      strokeLinejoin="round"
    >
      <path d="M10 2.5 16.5 6.25 10 10 3.5 6.25Z" fill="var(--paper)" />
      <path d="M3.5 6.25 10 10v7.5L3.5 13.75Z" fill="var(--graphite)" opacity="0.55" />
      <path d="M10 10l6.5-3.75v7.5L10 17.5Z" stroke="var(--paper)" strokeWidth="1.1" />
    </svg>
  );
}

export function BrandWordmark() {
  return (
    <span className="font-condensed text-[1.0625rem] leading-none font-semibold tracking-[0.01em] text-paper">
      Archiverse
    </span>
  );
}
