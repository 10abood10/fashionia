"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { Eyebrow, Reveal } from "@/components/motion/reveal";
import { storyImage } from "@/lib/data";

export function BrandStory() {
  const ref = React.useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  /* Background travels at ~0.85x scroll speed: it drifts across 15% of the
     over-sized layer while the section moves a full viewport. */
  const y = useTransform(scrollYProgress, [0, 1], ["-7.5%", "7.5%"]);

  return (
    <section
      id="story"
      ref={ref}
      className="relative isolate flex min-h-[560px] items-center overflow-hidden py-28 lg:min-h-[680px] lg:py-40"
    >
      <motion.div
        style={reduced ? undefined : { y }}
        className="absolute inset-x-0 -top-[10%] -z-10 h-[120%]"
      >
        <Image
          src={storyImage.src}
          alt={storyImage.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-espresso/40" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-espresso/25 via-transparent to-espresso/45"
      />

      <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-12">
        <Reveal className="mx-auto max-w-xl text-center">
          <Eyebrow tone="light">Welcome to</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(40px,6vw,76px)] leading-[0.95] font-normal tracking-[-0.02em] text-white">
            More Than Fashion
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed font-light text-cream/85">
            We work with small ateliers, natural fibres and patternmakers who
            still cut by hand. Every piece is made to be worn out, not thrown
            out.
          </p>
          <Link
            href="/#lookbook"
            className="mt-9 inline-flex items-center rounded-full border border-tan px-8 py-3.5 text-[11px] font-medium tracking-[0.18em] text-tan uppercase transition-colors duration-300 hover:bg-tan hover:text-espresso"
          >
            Discover Our Story
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
