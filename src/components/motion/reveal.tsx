"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

/** Shared easing curve for every transition on the page. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const DURATION = 0.6;

const VIEWPORT = { once: true, amount: 0.2 } as const;

type RevealProps = HTMLMotionProps<"div"> & {
  /** Seconds to wait before this element starts animating. */
  delay?: number;
  /** Distance in px the element travels upward. Ignored when motion is reduced. */
  y?: number;
};

/**
 * Fades a block up as it enters the viewport. Under `prefers-reduced-motion`
 * the translation is dropped and only the opacity change survives.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  ...props
}: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DURATION, ease: EASE, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = React.ComponentProps<"div"> & {
  /** Gap between children, in seconds. */
  stagger?: number;
  delay?: number;
};

const StaggerContext = React.createContext({ stagger: 0.08, delay: 0 });

/**
 * Parent for grids: children declared with <StaggerItem index={n}> animate in
 * sequence. Deliberately NOT a motion component — each item observes the
 * viewport on its own, so items mounted later (a filter change, a re-order)
 * still animate in. Parent-driven variant propagation only reaches children
 * that exist at the moment the parent fires, which left late items invisible.
 */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  ...props
}: StaggerProps) {
  const timing = React.useMemo(() => ({ stagger, delay }), [stagger, delay]);

  return (
    <StaggerContext.Provider value={timing}>
      <div className={className} {...props}>
        {children}
      </div>
    </StaggerContext.Provider>
  );
}

type StaggerItemProps = HTMLMotionProps<"div"> & {
  /** Position in the group — sets this item's delay. */
  index?: number;
  y?: number;
};

export function StaggerItem({
  children,
  className,
  index = 0,
  y = 24,
  ...props
}: StaggerItemProps) {
  const reduced = useReducedMotion();
  const { stagger, delay } = React.useContext(StaggerContext);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DURATION, ease: EASE, delay: delay + index * stagger }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Section eyebrow: uppercase micro-label flanked by thin rules — `— LABEL —`.
 */
export function Eyebrow({
  children,
  className,
  tone = "ink",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "ink" | "light";
}) {
  const rule = tone === "light" ? "bg-cream/40" : "bg-ink/20";
  const text = tone === "light" ? "text-cream/80" : "text-muted-foreground";

  return (
    <p
      className={cn(
        "label-xs flex items-center justify-center gap-3 text-center",
        text,
        className,
      )}
    >
      <span aria-hidden="true" className={cn("h-px w-8 sm:w-12", rule)} />
      {children}
      <span aria-hidden="true" className={cn("h-px w-8 sm:w-12", rule)} />
    </p>
  );
}
