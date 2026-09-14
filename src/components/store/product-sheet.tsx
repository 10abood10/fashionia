"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";

import { pillOutline, pillPrimary } from "@/components/store/shared";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatPrice, productById } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Quick view: opens from any product image or title. Shows exactly the data
 * the card shows — nothing is invented here — plus wishlist and add-to-bag.
 */
export function ProductSheet() {
  const { quickViewId, closeQuickView, addToCart, openDrawer, isWished, toggleWish } = useStore();
  const [added, setAdded] = React.useState(false);

  const product = quickViewId ? productById(quickViewId) : undefined;
  const open = !!product;

  React.useEffect(() => {
    if (!open) setAdded(false);
  }, [open]);

  function handleAdd() {
    if (!product) return;
    addToCart(product.id);
    setAdded(true);
  }

  return (
    <Sheet open={open} onOpenChange={(next) => !next && closeQuickView()}>
      <SheetContent
        side="right"
        className="bg-cream text-ink data-[side=right]:w-full data-[side=right]:sm:max-w-md"
      >
        {product && (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="relative aspect-4/5 bg-sand">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  priority
                  sizes="(max-width: 639px) 100vw, 448px"
                  className="object-cover"
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 rounded-full bg-tan px-3 py-1.5 text-[10px] font-medium tracking-[0.18em] text-espresso uppercase">
                    New
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => toggleWish(product.id)}
                  aria-pressed={isWished(product.id)}
                  aria-label={
                    isWished(product.id)
                      ? `Remove ${product.name} from wishlist`
                      : `Add ${product.name} to wishlist`
                  }
                  className="absolute top-4 right-14 grid size-9 place-items-center rounded-full bg-white/85 backdrop-blur-sm transition-colors duration-300 hover:bg-white"
                >
                  <Heart
                    className={cn(
                      "size-4 transition-colors duration-300",
                      isWished(product.id) ? "fill-tan text-tan" : "text-ink",
                    )}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </button>
              </div>

              <div className="px-6 pt-6 pb-4">
                <p className="label-xs text-muted-foreground">{product.category}</p>
                <SheetTitle className="mt-3 font-display text-3xl leading-[1.05] font-normal text-ink">
                  {product.name}
                </SheetTitle>
                <SheetDescription className="mt-3 flex items-baseline gap-3 text-base">
                  <span className="font-medium text-ink">{formatPrice(product.price)}</span>
                  {product.compareAt && (
                    <span className="text-sm font-light text-muted-foreground line-through">
                      {formatPrice(product.compareAt)}
                    </span>
                  )}
                </SheetDescription>

                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Collections">
                  {product.collections.map((collection) => (
                    <li
                      key={collection}
                      className="rounded-full border border-ink/15 px-3 py-1.5 text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase"
                    >
                      {collection}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-3 border-t border-ink/10 px-6 py-5">
              <button type="button" onClick={handleAdd} className={pillPrimary}>
                <ShoppingBag className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                {added ? "Added to bag" : "Add to bag"}
              </button>
              {added && (
                <button type="button" onClick={() => openDrawer("cart")} className={pillOutline}>
                  View bag
                </button>
              )}
              <p role="status" aria-live="polite" className="sr-only">
                {added ? `${product.name} added to your bag.` : ""}
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
