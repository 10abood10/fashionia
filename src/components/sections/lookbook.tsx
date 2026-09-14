import Image from "next/image";

import { Eyebrow, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { lookbook } from "@/lib/data";

export function Lookbook() {
  return (
    <section id="lookbook" className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>The Lookbook</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(36px,5vw,64px)] leading-[0.95] font-normal tracking-[-0.02em] text-ink">
            Three Ways To Wear It
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <Stagger
          className="scrollbar-hide mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 lg:mt-20 lg:px-12"
          role="list"
          aria-label="Editorial looks"
        >
          {lookbook.map((look, index) => (
            <StaggerItem
              key={look.id}
              index={index}
              role="listitem"
              className="w-[78vw] shrink-0 snap-start sm:w-[52vw] lg:w-[38vw] lg:max-w-[460px]"
            >
              <figure className="group relative aspect-2/3 overflow-hidden rounded-2xl bg-sand">
                <Image
                  src={look.image}
                  alt={look.alt}
                  fill
                  sizes="(max-width: 639px) 78vw, (max-width: 1023px) 52vw, 38vw"
                  className="hover-zoom object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/10 to-transparent"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                  <h3 className="font-display text-2xl leading-tight text-white lg:text-3xl">
                    {look.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-[13px] leading-relaxed font-light text-cream/75">
                    {look.caption}
                  </p>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}

          {/* Trailing spacer so the last card can snap clear of the edge. */}
          <div aria-hidden="true" className="w-px shrink-0" />
        </Stagger>
      </Reveal>
    </section>
  );
}
