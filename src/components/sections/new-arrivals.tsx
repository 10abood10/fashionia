"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Heart, Plus } from "lucide-react";

import { Eyebrow, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { filterProducts, formatPrice, shopFilters } from "@/lib/data";
import type { Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function ProductCard({ product }: { product: Product }) {
  const { isWished, toggleWish, addToCart, openQuickView } = useStore();
  const [added, setAdded] = React.useState(false);
  const timer = React.useRef<number | null>(null);
  const wished = isWished(product.id);

  React.useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  function quickAdd() {
    addToCart(product.id);
    setAdded(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-2xl bg-sand">
        <button
          type="button"
          onClick={() => openQuickView(product.id)}
          aria-label={`View ${product.name}`}
          className="relative block aspect-4/5 w-full"
        >
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
            className="hover-zoom object-cover"
          />
        </button>

        {product.isNew && (
          <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-tan px-3 py-1.5 text-[10px] font-medium tracking-[0.18em] text-espresso uppercase">
            New
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWish(product.id)}
          aria-pressed={wished}
          aria-label={
            wished
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/85 backdrop-blur-sm transition-colors duration-300 hover:bg-white"
        >
          <Heart
            className={cn(
              "size-4 transition-colors duration-300",
              wished ? "fill-tan text-tan" : "text-ink",
            )}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>

        {/* Quick add — slides up on hover/focus; always shown where there is
            no hover (touch) or where motion is reduced, so it is never unreachable. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-[250ms] ease-out group-focus-within:translate-y-0 group-hover:translate-y-0 pointer-coarse:translate-y-0 motion-reduce:translate-y-0 motion-reduce:transition-none">
          <button
            type="button"
            onClick={quickAdd}
            className="pointer-events-auto flex w-full items-center justify-center gap-2 bg-espresso/92 py-3.5 text-[11px] font-medium tracking-[0.18em] text-cream uppercase backdrop-blur-sm transition-colors duration-300 hover:bg-espresso"
          >
            {added ? (
              <Check className="size-3.5" strokeWidth={2} aria-hidden="true" />
            ) : (
              <Plus className="size-3.5" strokeWidth={2} aria-hidden="true" />
            )}
            {added ? "Added" : "Quick Add"}
            <span className="sr-only"> — {product.name}</span>
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-[17px] leading-snug text-ink">
            <button
              type="button"
              onClick={() => openQuickView(product.id)}
              className="text-left transition-colors duration-300 hover:text-tan"
            >
              {product.name}
            </button>
          </h3>
          <p className="mt-0.5 text-xs font-light text-muted-foreground">
            {product.category}
          </p>
        </div>
        <p className="shrink-0 text-sm font-medium text-ink">
          {formatPrice(product.price)}
          {product.compareAt && (
            <span className="ml-2 text-xs font-light text-muted-foreground line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </p>
      </div>
    </article>
  );
}

export function NewArrivals() {
  const { filter, setFilter } = useStore();
  const visible = filterProducts(filter);

  return (
    <section id="new-arrivals" className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <Reveal className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <Eyebrow className="md:justify-start">New Arrivals</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(36px,5vw,64px)] leading-[0.95] font-normal tracking-[-0.02em] text-ink">
              Fresh Off The Rail
            </h2>
          </div>
          <Link
            href="/#new-arrivals"
            onClick={() => setFilter("All")}
            className="label-xs shrink-0 border-b border-tan pb-1.5 text-ink transition-colors duration-300 hover:border-ink"
          >
            View all
          </Link>
        </Reveal>

        {/* Category filter — driven by the shop-by-category cards and footer too */}
        <Reveal
          delay={0.05}
          role="group"
          aria-label="Filter products"
          className="mt-10 flex flex-wrap justify-center gap-2 md:justify-start"
        >
          {shopFilters.map((option) => {
            const active = option === filter;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={active}
                className={cn(
                  "label-xs rounded-full border px-4 py-2.5 transition-colors duration-300",
                  active
                    ? "border-espresso bg-espresso text-cream"
                    : "border-ink/15 text-muted-foreground hover:border-ink hover:text-ink",
                )}
              >
                {option}
              </button>
            );
          })}
        </Reveal>

        <p role="status" aria-live="polite" className="sr-only">
          Showing {visible.length} {visible.length === 1 ? "piece" : "pieces"}
          {filter === "All" ? "" : ` in ${filter}`}.
        </p>

        {visible.length === 0 ? (
          <p className="mt-14 text-center text-sm font-light text-muted-foreground">
            Nothing in {filter} right now — try another collection.
          </p>
        ) : (
          /* Keyed by filter: the reveal animation runs once per mount, so a
             fresh grid is the only way items added by a filter change animate
             in instead of staying at their hidden initial state. */
          <Stagger
            key={filter}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:mt-14 lg:grid-cols-4"
          >
            {visible.map((product, index) => (
              <StaggerItem key={product.id} index={index % 8}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
