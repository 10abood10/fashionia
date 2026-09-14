"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { orderMessage, pillOutline, pillPrimary } from "@/components/store/shared";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatPrice, whatsappLink } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const qtyButton =
  "grid size-8 place-items-center rounded-full border border-ink/15 text-ink transition-colors duration-200 hover:border-ink disabled:opacity-30";

export function CartSheet() {
  const { drawer, closeDrawer, cartItems, cartCount, subtotal, setQty, removeFromCart, openQuickView } =
    useStore();
  const open = drawer === "cart";

  return (
    <Sheet open={open} onOpenChange={(next) => !next && closeDrawer()}>
      <SheetContent
        side="right"
        className="bg-cream text-ink data-[side=right]:w-full data-[side=right]:sm:max-w-md"
      >
        <div className="flex items-baseline gap-3 px-6 pt-6 pr-14">
          <SheetTitle className="font-display text-2xl font-normal text-ink">Your Bag</SheetTitle>
          {cartCount > 0 && (
            <span className="label-xs text-muted-foreground">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>
        <SheetDescription className="sr-only">Review the pieces in your bag.</SheetDescription>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 pb-16 text-center">
            <ShoppingBag className="size-8 text-tan" strokeWidth={1.25} aria-hidden="true" />
            <p className="font-display text-xl text-ink">Your bag is empty</p>
            <p className="max-w-xs text-[13px] font-light text-muted-foreground">
              Add a piece from the new arrivals and it will wait for you here.
            </p>
            <Link href="/#new-arrivals" onClick={closeDrawer} className={cn(pillOutline, "mt-2 w-auto")}>
              Browse new arrivals
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-6 overflow-y-auto px-6 pt-4">
              {cartItems.map(({ product, qty, lineTotal }) => (
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
                        onClick={() => removeFromCart(product.id)}
                        aria-label={`Remove ${product.name} from bag`}
                        className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-sand hover:text-ink"
                      >
                        <X className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                      <div className="flex items-center gap-2" role="group" aria-label={`Quantity of ${product.name}`}>
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty - 1)}
                          aria-label={qty === 1 ? `Remove ${product.name}` : `Decrease quantity of ${product.name}`}
                          className={qtyButton}
                        >
                          <Minus className="size-3" strokeWidth={2} aria-hidden="true" />
                        </button>
                        <span className="w-5 text-center text-sm font-medium tabular-nums" aria-live="polite">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label={`Increase quantity of ${product.name}`}
                          className={qtyButton}
                        >
                          <Plus className="size-3" strokeWidth={2} aria-hidden="true" />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-ink">{formatPrice(lineTotal)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-ink/10 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="label-xs text-muted-foreground">Subtotal</span>
                <span className="font-display text-xl text-ink">{formatPrice(subtotal)}</span>
              </div>
              <Link href="/pay/" onClick={closeDrawer} className={pillPrimary}>
                Pay
              </Link>
              <a
                href={whatsappLink(orderMessage(cartItems, subtotal))}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs font-light text-muted-foreground underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                or send the order on WhatsApp
              </a>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
