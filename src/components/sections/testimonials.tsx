"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { DURATION, EASE, Eyebrow, Reveal } from "@/components/motion/reveal";
import { testimonials } from "@/lib/data";
import { cn } from "@/lib/utils";

const ROTATE_MS = 6000;

export function Testimonials() {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (paused) return;

    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % testimonials.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, [paused]);

  const active = testimonials[index];

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="bg-sand py-24 lg:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <Reveal className="mx-auto max-w-3xl text-center">
          {/* Darker than the default muted brown, which is too low-contrast on sand */}
          <Eyebrow className="text-espresso/75">Kind Words</Eyebrow>
          <h2 id="testimonials-heading" className="sr-only">
            What our customers say
          </h2>

          <div
            aria-live="polite"
            className="relative mt-10 min-h-[260px] sm:min-h-[240px]"
          >
            <AnimatePresence mode="wait">
              <motion.figure
                key={active.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0.15 : DURATION, ease: EASE }}
                className="absolute inset-0 flex flex-col items-center"
              >
                <blockquote className="font-display text-[clamp(22px,3.2vw,38px)] leading-[1.25] font-normal tracking-[-0.01em] text-espresso">
                  “{active.quote}”
                </blockquote>
                <figcaption className="mt-8">
                  <span className="block text-sm font-medium text-ink">
                    {active.name}
                  </span>
                  <span className="mt-1 block text-xs font-light text-espresso/70">
                    {active.role}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Avatars double as pagination */}
          <div
            role="group"
            aria-label="Choose a customer review"
            className="mt-10 flex items-center justify-center gap-3"
          >
            {testimonials.map((testimonial, position) => {
              const isActive = position === index;
              return (
                <button
                  key={testimonial.id}
                  type="button"
                  aria-pressed={isActive}
                  aria-label={`Read the review from ${testimonial.name}`}
                  onClick={() => setIndex(position)}
                  className={cn(
                    "relative size-11 overflow-hidden rounded-full transition-all duration-300 ease-out",
                    isActive
                      ? "ring-2 ring-tan ring-offset-2 ring-offset-sand"
                      : "opacity-55 hover:opacity-100",
                  )}
                >
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.alt}
                    width={88}
                    height={88}
                    sizes="44px"
                    className="size-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
