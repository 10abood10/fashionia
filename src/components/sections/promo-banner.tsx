"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { promoImage, saleEndsAt } from "@/lib/data";
import { useStore } from "@/lib/store";

type Remaining = { days: string; hours: string; mins: string; secs: string };

const PLACEHOLDER: Remaining = { days: "--", hours: "--", mins: "--", secs: "--" };

function remainingUntil(target: number): Remaining {
  const diff = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const pad = (value: number) => String(value).padStart(2, "0");

  return {
    days: pad(Math.floor(totalSeconds / 86_400)),
    hours: pad(Math.floor((totalSeconds % 86_400) / 3_600)),
    mins: pad(Math.floor((totalSeconds % 3_600) / 60)),
    secs: pad(totalSeconds % 60),
  };
}

/**
 * Ticks client-side only, so the server and first client render agree.
 * Stops its own interval once the target passes; an invalid date renders
 * zeros rather than NaN.
 */
function useCountdown(isoDate: string) {
  const [remaining, setRemaining] = React.useState<Remaining>(PLACEHOLDER);

  React.useEffect(() => {
    const target = new Date(isoDate).getTime();
    if (Number.isNaN(target)) {
      console.warn(`[countdown] invalid sale end date: ${isoDate}`);
      setRemaining(remainingUntil(0));
      return;
    }

    const tick = () => {
      setRemaining(remainingUntil(target));
      if (Date.now() >= target) window.clearInterval(id);
    };
    const id = window.setInterval(tick, 1000);
    tick();
    return () => window.clearInterval(id);
  }, [isoDate]);

  return remaining;
}

export function PromoBanner() {
  const remaining = useCountdown(saleEndsAt);
  const { setFilter } = useStore();

  const tiles = [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Mins", value: remaining.mins },
    { label: "Secs", value: remaining.secs },
  ];

  return (
    <section aria-labelledby="promo-heading" className="bg-cream">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Image — first on mobile, right on desktop */}
        <div className="relative order-first aspect-4/3 lg:order-last lg:aspect-auto lg:min-h-[620px]">
          <Image
            src={promoImage.src}
            alt={promoImage.alt}
            fill
            sizes="(max-width: 1023px) 100vw, 55vw"
            className="object-cover object-top"
          />
        </div>

        {/* Copy panel */}
        <div className="flex items-center bg-espresso px-6 py-20 sm:px-10 lg:px-16 lg:py-28 xl:px-24">
          <Reveal className="w-full max-w-md">
            <p className="label-xs text-tan">Mid-Season Event</p>
            <h2
              id="promo-heading"
              className="mt-6 font-display text-[clamp(44px,6vw,80px)] leading-[0.92] font-normal tracking-[-0.02em] text-cream"
            >
              Up to 40% Off
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed font-light text-cream/70">
              Selected outerwear, knitwear and leather goods — reduced while the
              sizes last.
            </p>

            <ul className="mt-10 flex gap-3 sm:gap-4">
              {tiles.map((tile) => (
                <li
                  key={tile.label}
                  className="flex-1 rounded-xl border border-cream/15 bg-cream/5 px-2 py-4 text-center sm:px-4"
                >
                  <span
                    className="block font-display text-2xl leading-none text-cream tabular-nums sm:text-3xl"
                    suppressHydrationWarning
                  >
                    {tile.value}
                  </span>
                  <span className="mt-2 block text-[10px] font-medium tracking-[0.18em] text-cream/55 uppercase">
                    {tile.label}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/#new-arrivals"
              onClick={() => setFilter("Sale")}
              className="mt-10 inline-flex items-center rounded-full bg-cream px-8 py-3.5 text-[11px] font-medium tracking-[0.18em] text-espresso uppercase transition-colors duration-300 hover:bg-tan"
            >
              Shop the Sale
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
