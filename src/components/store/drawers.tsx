"use client";

import { CartSheet } from "@/components/store/cart-sheet";
import { ProductSheet } from "@/components/store/product-sheet";
import { SearchSheet } from "@/components/store/search-sheet";
import { WishlistSheet } from "@/components/store/wishlist-sheet";

/** Mounted once on the page; each drawer reads its own open state from the store. */
export function StoreDrawers() {
  return (
    <>
      <CartSheet />
      <WishlistSheet />
      <SearchSheet />
      <ProductSheet />
    </>
  );
}
