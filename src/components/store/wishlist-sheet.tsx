"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, X } from "lucide-react";

import { pillOutline } from "@/components/store/shared";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatPrice, productById } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function WishlistSheet() {
  const { drawer, closeDrawer, wishlist, toggleWish, addToCart, openQuickView, openDrawer } = useStore();
  const open = drawer === "wishlist";
  const items = wishlist.flatMap((id) => productById(id) ?? []);

  return (
    <Sheet open={open} onOpenChange={(next) => !next && closeDrawer()}>
      <SheetContent
        side="right"
        className="bg-cream text-ink data-[side=right]:w-full data-[side=right]:sm:max-w-md"
      >
        <div className="flex items-baseline gap-3 px-6 pt-6 pr-14">
          <SheetTitle className="font-display text-2xl font-normal text-ink">Wishlist</SheetTitle>
          {items.length > 0 && (
            <span className="label-xs text-muted-foreground">
              {items.length} {items.length === 1 ? "piece" : "pieces"}
            </span>
          )}
        </div>
        <SheetDescription className="sr-only">Pieces you have saved for later.</SheetDescription>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 pb-16 text-center">
            <Heart className="size-8 text-tan" strokeWidth={1.25} aria-hidden="true" />
            <p className="font-display text-xl text-ink">Nothing saved yet</p>
            <p className="max-w-xs text-[13px] font-light text-muted-foreground">
              Tap the heart on any piece to keep it here.
            </p>
            <Link href="/#new-arrivals" onClick={closeDrawer} className={cn(pillOutline, "mt-2 w-auto")}>
              Browse new arrivals
            </Link>
          </div>
        ) : (
          <ul className="flex-1 space-y-6 overflow-y-auto px-6 pt-4 pb-6">
            {items.map((product) => (
              <li key={product.id} className="flex gap-4">
                <button
                  type="button"
                  onClick={() => openQuickView(product.id)}
                  aria-label={`View ${product.name}`}
                  className="relative aspect-4/5 w-20 shrink-0 overflow-hidden rounded-xl bg-sand"
                >
                  <Image src={product.image} alt={product.alt} fill sizes="80px" className="object-cover" />
                </button>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-display text-[15px] leading-snug text-ink">{product.name}</p>
                      <p className="mt-0.5 text-xs font-light text-muted-foreground">{product.category}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleWish(product.id)}
                      aria-label={`Remove ${product.name} from wishlist`}
                      className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-sand hover:text-ink"
                    >
                      <X className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <p className="text-sm font-medium text-ink">
                      {formatPrice(product.price)}
                      {product.compareAt && (
                        <span className="ml-2 text-xs font-light text-muted-foreground line-through">
                          {formatPrice(product.compareAt)}
                        </span>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product.id);
                        openDrawer("cart");
                      }}
                      className="label-xs rounded-full bg-espresso px-4 py-2.5 text-cream transition-colors duration-300 hover:bg-tan hover:text-espresso"
                    >
                      Add to bag
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  );
}
