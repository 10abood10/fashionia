"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Headphones, ShieldCheck, Sparkles, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { EASE, DURATION } from "@/components/motion/reveal";
import { heroFeatures, heroImage } from "@/lib/data";
import type { HeroFeature } from "@/lib/data";
import { useStore } from "@/lib/store";

const featureIcons: Record<HeroFeature["icon"], LucideIcon> = {
  truck: Truck,
  shield: ShieldCheck,
  sparkles: Sparkles,
  headset: Headphones,
};

export function Hero() {
  const reduced = useReducedMotion();
  const { setFilter } = useStore();

  /** Entrance: each block trails the previous one by 60ms. */
  const entrance = (index: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION, ease: EASE, delay: index * 0.06 },
  });

  return (
    <section
      id="top"
      aria-label="FashiOnia autumn winter collection"
      className="relative isolate min-h-[92vh] overflow-hidden rounded-b-[2rem] bg-mocha lg:rounded-b-[2.5rem]"
    >
      {/* Warm gradient ground */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_15%_0%,#6b5646_0%,#4a3b30_45%,#2e241d_100%)]"
      />

      {/* Diagonal light streak */}
      <div
        aria-hidden="true"
        className="absolute -top-1/3 -left-1/4 -z-10 h-[180%] w-[70%] rotate-[18deg] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.55)_45%,rgba(255,255,255,0.75)_55%,transparent_100%)] opacity-25 mix-blend-overlay blur-2xl"
      />

      {/* Oversized display word, sitting behind the model */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <h1 className="w-full text-center">
          <span className="sr-only">
            FashiOnia — modern luxury fashion for the way you actually dress
          </span>
          <motion.span
            {...entrance(1)}
            aria-hidden="true"
            className="block font-display text-[clamp(120px,20vw,320px)] leading-[0.8] font-normal tracking-[0.06em] text-white/15 select-none"
          >
            STYLE
          </motion.span>
        </h1>
      </div>

      {/* Model — a full-bleed backdrop on mobile, an arched column from md up */}
      <div className="absolute inset-0 -z-10 overflow-hidden md:inset-auto md:right-[3%] md:bottom-0 md:z-10 md:h-[78%] md:w-[42vw] md:max-w-[520px] md:rounded-t-[260px] lg:right-[6%]">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          sizes="(max-width: 767px) 100vw, 42vw"
          className="object-cover object-top"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-espresso/75 via-mocha/60 to-espresso/85 md:hidden"
        />
        {/* Scrim that carries the editorial quote sitting over the model */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 hidden h-64 bg-gradient-to-t from-espresso/90 via-espresso/45 to-transparent md:block"
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-20 mx-auto flex min-h-[92vh] w-full max-w-[1280px] flex-col px-6 pt-32 pb-8 lg:px-12 lg:pt-40 lg:pb-12">
        <div className="relative flex-1">
          <motion.div {...entrance(0)} className="max-w-xs">
            <p className="label-xs text-tan">Autumn / Winter 2026</p>
            <p className="mt-5 font-display text-2xl leading-[1.15] text-cream/90 lg:text-[28px]">
              The new arrivals have landed.
            </p>
            <Link
              href="/#new-arrivals"
              onClick={() => setFilter("All")}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-tan px-7 py-3.5 text-[11px] font-medium tracking-[0.18em] text-espresso uppercase transition-colors duration-300 hover:bg-cream"
            >
              Shop the collection
            </Link>
          </motion.div>

          {/* Editorial line, right rail */}
          <motion.figure
            {...entrance(2)}
            className="absolute right-0 bottom-2 hidden w-[220px] border-r border-tan/60 pr-5 text-right md:block lg:w-[260px]"
          >
            <blockquote className="font-display text-lg leading-[1.35] text-white italic drop-shadow-[0_2px_14px_rgba(26,21,18,0.65)] lg:text-xl">
              “Style is a way to say who you are without speaking.”
            </blockquote>
            <figcaption className="label-xs mt-4 text-cream/70">
              The FashiOnia Edit
            </figcaption>
          </motion.figure>
        </div>

        {/* Glassmorphic assurance bar */}
        <motion.ul
          {...entrance(3)}
          className="mt-12 grid grid-cols-2 gap-y-6 rounded-2xl border border-white/20 bg-white/10 px-5 py-6 backdrop-blur-md sm:px-8 lg:grid-cols-4 lg:gap-y-0"
        >
          {heroFeatures.map((feature, index) => {
            const Icon = featureIcons[feature.icon];
            return (
              <li
                key={feature.title}
                className={[
                  "flex items-center gap-3.5 px-1 sm:px-3",
                  index % 2 === 1 ? "border-l border-white/20" : "",
                  "lg:border-l lg:first:border-l-0",
                ].join(" ")}
              >
                <Icon
                  className="size-5 shrink-0 text-tan"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{feature.title}</p>
                  <p className="truncate text-xs font-light text-cream/65">
                    {feature.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
