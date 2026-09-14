"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Eyebrow, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { categories } from "@/lib/data";
import { useStore } from "@/lib/store";

const arrowButton =
  "size-11 border-none bg-white text-ink shadow-[0_10px_30px_-10px_rgba(46,36,29,0.45)] hover:bg-white hover:text-tan disabled:opacity-30 [&_svg]:size-5";

export function Categories() {
  const { setFilter } = useStore();

  return (
    <section id="categories" className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Shop by Category</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(36px,5vw,64px)] leading-[0.95] font-normal tracking-[-0.02em] text-ink">
            Find Your Perfect Style
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed font-light text-muted-foreground">
            Curated collections for every mood, moment and occasion.
          </p>
        </Reveal>

        <Reveal className="relative mt-14 lg:mt-20" delay={0.1}>
          <Carousel opts={{ align: "start" }} className="w-full">
            <Stagger>
              <CarouselContent className="-ml-6">
                {categories.map((category, index) => (
                  <CarouselItem
                    key={category.name}
                    className="basis-full pl-6 sm:basis-1/2 lg:basis-1/4"
                  >
                    <StaggerItem index={index}>
                      <Link
                        href={category.href}
                        onClick={() => setFilter(category.name)}
                        aria-label={`Shop ${category.name}`}
                        className="group hover-lift block overflow-hidden rounded-2xl bg-sand transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-32px_rgba(46,36,29,0.6)]"
                      >
                        <div className="relative aspect-3/4 overflow-hidden">
                          <Image
                            src={category.image}
                            alt={category.alt}
                            fill
                            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                            className="hover-zoom object-cover"
                          />
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-t from-espresso/35 via-transparent to-transparent"
                          />

                          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-full bg-white py-3 pr-4 pl-5">
                            <span className="min-w-0">
                              <span className="block truncate font-display text-base text-ink">
                                {category.name}
                              </span>
                              <span className="block truncate text-[11px] font-light text-muted-foreground">
                                {category.count}
                              </span>
                            </span>
                            <ArrowRight
                              className="size-4 shrink-0 text-tan transition-transform duration-300 ease-out group-hover:translate-x-1"
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </Link>
                    </StaggerItem>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Stagger>

            <CarouselPrevious
              aria-label="Previous categories"
              className={`${arrowButton} -left-4 lg:-left-6`}
            />
            <CarouselNext
              aria-label="Next categories"
              className={`${arrowButton} -right-4 lg:-right-6`}
            />
          </Carousel>
        </Reveal>
      </div>
    </section>
  );
}
