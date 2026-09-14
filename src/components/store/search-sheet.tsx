"use client";

import * as React from "react";
import Image from "next/image";
import { Search } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatPrice, products } from "@/lib/data";
import { useStore } from "@/lib/store";

/** Case-insensitive match against name, category and collections. */
function matches(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((product) =>
    [product.name, product.category, ...product.collections].some((field) =>
      field.toLowerCase().includes(q),
    ),
  );
}

export function SearchSheet() {
  const { drawer, closeDrawer, openQuickView, addToCart } = useStore();
  const [query, setQuery] = React.useState("");
  const open = drawer === "search";
  const results = matches(query);

  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={(next) => !next && closeDrawer()}>
      <SheetContent
        side="right"
        className="bg-cream text-ink data-[side=right]:w-full data-[side=right]:sm:max-w-md"
      >
        <div className="px-6 pt-6 pr-14">
          <SheetTitle className="font-display text-2xl font-normal text-ink">Search</SheetTitle>
          <SheetDescription className="sr-only">Find a piece by name, category or collection.</SheetDescription>
        </div>

        <div className="relative px-6">
          <label htmlFor="search-products" className="sr-only">
            Search products
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-11 size-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <input
            id="search-products"
            type="search"
            autoFocus
            autoComplete="off"
            placeholder="Coat, bag, footwear…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-12 w-full rounded-full border border-ink/15 bg-white pr-5 pl-12 text-sm font-light text-ink placeholder:text-muted-foreground focus:border-tan focus:outline-none"
          />
        </div>

        <p role="status" aria-live="polite" className="label-xs px-6 pt-2 text-muted-foreground">
          {query.trim()
            ? `${results.length} ${results.length === 1 ? "result" : "results"}`
            : "All pieces"}
        </p>

        {results.length === 0 ? (
          <p className="px-6 pt-6 text-sm font-light text-muted-foreground">
            Nothing matches “{query.trim()}”. Try a category such as bags or footwear.
          </p>
        ) : (
          <ul className="flex-1 space-y-2 overflow-y-auto px-6 pt-2 pb-6">
            {results.map((product) => (
              <li key={product.id} className="flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-sand/60">
                <button
                  type="button"
                  onClick={() => openQuickView(product.id)}
                  className="flex min-w-0 flex-1 items-center gap-4 text-left"
                >
                  <span className="relative aspect-4/5 w-14 shrink-0 overflow-hidden rounded-lg bg-sand">
                    <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-[15px] leading-snug text-ink">
                      {product.name}
                    </span>
                    <span className="mt-0.5 block text-xs font-light text-muted-foreground">
                      {product.category} · {formatPrice(product.price)}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => addToCart(product.id)}
                  aria-label={`Add ${product.name} to bag`}
                  className="label-xs shrink-0 rounded-full border border-ink/15 px-3.5 py-2 text-ink transition-colors duration-300 hover:border-ink"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  );
}
