"use client";

import * as React from "react";

import { productById, type Product, type ShopFilter } from "@/lib/data";

/* ---------------------------------------------------------------------------
   Persistence
   Only ids and quantities are stored; product details are always re-derived
   from lib/data.ts, so the cart can never show a stale image or price.
   --------------------------------------------------------------------------- */

const KEYS = {
  cart: "fashionia:cart",
  wishlist: "fashionia:wishlist",
  logo: "fashionia:logo",
} as const;

export type CartLine = { id: string; qty: number };

const MAX_QTY = 20;

function readStorage<T>(key: string, validate: (raw: unknown) => T | null): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return validate(JSON.parse(raw));
  } catch (error) {
    // Corrupt or inaccessible storage: report it and start clean.
    console.warn(`[store] discarding unreadable "${key}"`, error);
    return null;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[store] could not persist "${key}"`, error);
  }
}

/** Keeps only well-formed lines that point at a product we still sell. */
function validateCart(raw: unknown): CartLine[] | null {
  if (!Array.isArray(raw)) return null;
  const seen = new Set<string>();
  const lines: CartLine[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const { id, qty } = item as Record<string, unknown>;
    if (typeof id !== "string" || !productById(id) || seen.has(id)) continue;
    const quantity = Number(qty);
    if (!Number.isInteger(quantity) || quantity < 1) continue;
    seen.add(id);
    lines.push({ id, qty: Math.min(quantity, MAX_QTY) });
  }
  return lines;
}

function validateWishlist(raw: unknown): string[] | null {
  if (!Array.isArray(raw)) return null;
  return [...new Set(raw.filter((id): id is string => typeof id === "string" && !!productById(id)))];
}

function validateLogo(raw: unknown): string | null {
  return typeof raw === "string" && raw.startsWith("data:image/") ? raw : null;
}

/* ---------------------------------------------------------------------------
   Context
   --------------------------------------------------------------------------- */

export type CartItem = { product: Product; qty: number; lineTotal: number };

type Drawer = "cart" | "wishlist" | "search" | null;

type StoreValue = {
  hydrated: boolean;

  cart: CartLine[];
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;

  wishlist: string[];
  isWished: (id: string) => boolean;
  toggleWish: (id: string) => void;

  filter: ShopFilter;
  setFilter: (filter: ShopFilter) => void;

  logo: string | null;
  setLogo: (dataUrl: string | null) => void;

  drawer: Drawer;
  openDrawer: (drawer: Exclude<Drawer, null>) => void;
  closeDrawer: () => void;

  quickViewId: string | null;
  openQuickView: (id: string) => void;
  closeQuickView: () => void;
};

const StoreContext = React.createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = React.useState(false);
  const [cart, setCart] = React.useState<CartLine[]>([]);
  const [wishlist, setWishlist] = React.useState<string[]>([]);
  const [logo, setLogoState] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<ShopFilter>("All");
  const [drawer, setDrawer] = React.useState<Drawer>(null);
  const [quickViewId, setQuickViewId] = React.useState<string | null>(null);

  /* Restore after the first paint so server and client markup agree. */
  React.useEffect(() => {
    setCart(readStorage(KEYS.cart, validateCart) ?? []);
    setWishlist(readStorage(KEYS.wishlist, validateWishlist) ?? []);
    setLogoState(readStorage(KEYS.logo, validateLogo));
    setHydrated(true);
  }, []);

  /* Persist — but never before hydration, or we'd wipe storage with []. */
  React.useEffect(() => {
    if (hydrated) writeStorage(KEYS.cart, cart);
  }, [cart, hydrated]);

  React.useEffect(() => {
    if (hydrated) writeStorage(KEYS.wishlist, wishlist);
  }, [wishlist, hydrated]);

  React.useEffect(() => {
    if (hydrated) writeStorage(KEYS.logo, logo);
  }, [logo, hydrated]);

  /* Another tab changed storage: pick it up rather than going stale. */
  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === KEYS.cart) setCart(readStorage(KEYS.cart, validateCart) ?? []);
      if (event.key === KEYS.wishlist) setWishlist(readStorage(KEYS.wishlist, validateWishlist) ?? []);
      if (event.key === KEYS.logo) setLogoState(readStorage(KEYS.logo, validateLogo));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addToCart = React.useCallback((id: string, qty = 1) => {
    if (!productById(id)) return;
    setCart((current) => {
      const existing = current.find((line) => line.id === id);
      if (existing) {
        return current.map((line) =>
          line.id === id ? { ...line, qty: Math.min(line.qty + qty, MAX_QTY) } : line,
        );
      }
      return [...current, { id, qty: Math.min(qty, MAX_QTY) }];
    });
  }, []);

  const removeFromCart = React.useCallback((id: string) => {
    setCart((current) => current.filter((line) => line.id !== id));
  }, []);

  const setQty = React.useCallback((id: string, qty: number) => {
    setCart((current) =>
      qty < 1
        ? current.filter((line) => line.id !== id)
        : current.map((line) => (line.id === id ? { ...line, qty: Math.min(qty, MAX_QTY) } : line)),
    );
  }, []);

  const clearCart = React.useCallback(() => setCart([]), []);

  const toggleWish = React.useCallback((id: string) => {
    if (!productById(id)) return;
    setWishlist((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);

  const isWished = React.useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const setLogo = React.useCallback((dataUrl: string | null) => {
    setLogoState(dataUrl && dataUrl.startsWith("data:image/") ? dataUrl : null);
  }, []);

  const openDrawer = React.useCallback((next: Exclude<Drawer, null>) => {
    setQuickViewId(null);
    setDrawer(next);
  }, []);
  const closeDrawer = React.useCallback(() => setDrawer(null), []);

  const openQuickView = React.useCallback((id: string) => {
    if (!productById(id)) return;
    setDrawer(null);
    setQuickViewId(id);
  }, []);
  const closeQuickView = React.useCallback(() => setQuickViewId(null), []);

  const cartItems = React.useMemo<CartItem[]>(
    () =>
      cart.flatMap((line) => {
        const product = productById(line.id);
        return product ? [{ product, qty: line.qty, lineTotal: product.price * line.qty }] : [];
      }),
    [cart],
  );

  const cartCount = React.useMemo(
    () => cartItems.reduce((sum, item) => sum + item.qty, 0),
    [cartItems],
  );

  const subtotal = React.useMemo(
    () => cartItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [cartItems],
  );

  const value = React.useMemo<StoreValue>(
    () => ({
      hydrated,
      cart,
      cartItems,
      cartCount,
      subtotal,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      wishlist,
      isWished,
      toggleWish,
      filter,
      setFilter,
      logo,
      setLogo,
      drawer,
      openDrawer,
      closeDrawer,
      quickViewId,
      openQuickView,
      closeQuickView,
    }),
    [
      hydrated,
      cart,
      cartItems,
      cartCount,
      subtotal,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      wishlist,
      isWished,
      toggleWish,
      filter,
      logo,
      setLogo,
      drawer,
      openDrawer,
      closeDrawer,
      quickViewId,
      openQuickView,
      closeQuickView,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = React.useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside <StoreProvider>");
  return context;
}
