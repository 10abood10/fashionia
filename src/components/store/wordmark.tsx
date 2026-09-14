"use client";

import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * The brand mark. Renders the owner-uploaded logo when one is set (see the
 * footer's upload control), otherwise the default ✻ FashiOnia wordmark.
 */
export function Wordmark({ className, imgClassName }: { className?: string; imgClassName?: string }) {
  const { logo } = useStore();

  if (logo) {
    return (
      // A data: URL held in localStorage — next/image has nothing to optimise here.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logo} alt="FashiOnia" className={cn("block w-auto object-contain", imgClassName)} />
    );
  }

  return (
    <span className={cn("flex items-center gap-2 font-display", className)}>
      <span aria-hidden="true" className="text-tan">
        ✻
      </span>
      <span>FashiOnia</span>
    </span>
  );
}
