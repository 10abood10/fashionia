"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";

import { Wordmark } from "@/components/store/wordmark";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks, whatsappLink } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/* No account system exists — order questions go to the shop on WhatsApp. */
const accountLink = whatsappLink("Hello FashiOnia, I'd like help with my order.");

/** Highlights the nav link whose section is currently crossing the viewport. */
function useActiveSection(hrefs: string[]) {
  const [active, setActive] = React.useState(hrefs[0]);

  React.useEffect(() => {
    // hrefs look like "/#story" — the fragment is the section id.
    const targets = hrefs
      .map((href) => document.getElementById(href.split("#")[1] ?? ""))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActive(`/#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [hrefs]);

  return active;
}

const iconButton =
  "grid size-9 place-items-center rounded-full transition-colors duration-300 hover:bg-current/10";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const { cartCount, openDrawer } = useStore();
  const pathname = usePathname();

  /* Only the home hero is dark enough for the transparent, white-text state;
     every other page starts in the pinned cream pill. */
  const pinned = scrolled || pathname !== "/";

  /** From the mobile menu: close it first, then open the requested drawer. */
  const fromMenu = (drawer: "cart" | "wishlist" | "search") => () => {
    setMenuOpen(false);
    openDrawer(drawer);
  };

  const sectionIds = React.useMemo(() => navLinks.map((link) => link.href), []);
  const active = useActiveSection(sectionIds);

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 80);
  });

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6">
      <motion.div
        initial={false}
        animate={pinned ? "pinned" : "top"}
        variants={{
          top: {
            maxWidth: 1280,
            marginTop: 0,
            paddingTop: 22,
            paddingBottom: 22,
            borderRadius: 0,
            backgroundColor: "rgba(247, 243, 238, 0)",
            boxShadow: "0 0 0 0 rgba(46, 36, 29, 0)",
          },
          pinned: {
            maxWidth: 1200,
            marginTop: 14,
            paddingTop: 12,
            paddingBottom: 12,
            borderRadius: 999,
            backgroundColor: "rgba(247, 243, 238, 0.85)",
            boxShadow: "0 14px 40px -16px rgba(46, 36, 29, 0.35)",
          },
        }}
        transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
        className={cn(
          "mx-auto flex items-center justify-between gap-6 px-2 transition-colors duration-300 sm:px-4",
          pinned ? "text-ink backdrop-blur-md" : "text-white",
        )}
      >
        {/* Wordmark */}
        <Link
          href="/#top"
          aria-label="FashiOnia — back to top"
          className="flex shrink-0 items-center text-xl tracking-[-0.01em] sm:text-2xl"
        >
          <Wordmark imgClassName="h-7 max-w-[160px] sm:h-8" />
        </Link>

        {/* Desktop links */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = active === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "label-xs relative block py-2 transition-opacity duration-200",
                      isActive ? "opacity-100" : "opacity-75 hover:opacity-100",
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-tan transition-transform duration-300",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Utilities */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={() => openDrawer("search")}
            aria-label="Search products"
            className={cn(iconButton, "hidden sm:grid")}
          >
            <Search className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <a
            href={accountLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Your account — message us on WhatsApp"
            className={cn(iconButton, "hidden sm:grid")}
          >
            <User className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => openDrawer("wishlist")}
            aria-label="Wishlist"
            className={cn(iconButton, "hidden sm:grid")}
          >
            <Heart className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => openDrawer("cart")}
            aria-label={
              cartCount === 0
                ? "Shopping bag, empty"
                : `Shopping bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}`
            }
            className={cn(iconButton, "relative")}
          >
            <ShoppingBag className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
            {cartCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 grid min-w-[18px] place-items-center rounded-full bg-tan px-1 py-0.5 text-[10px] leading-none font-medium text-espresso"
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <button type="button" aria-label="Open menu" className={cn(iconButton, "lg:hidden")} />
              }
            >
              <Menu className="size-5" strokeWidth={1.5} aria-hidden="true" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-none bg-espresso text-cream data-[side=right]:w-full data-[side=right]:sm:max-w-none"
            >
              <SheetTitle className="px-6 pt-6 font-display text-2xl text-cream">
                <Wordmark imgClassName="h-8 max-w-[180px]" />
              </SheetTitle>

              <nav aria-label="Mobile" className="mt-10 px-6">
                <ul className="flex flex-col">
                  {navLinks.map((link) => (
                    <li key={link.href} className="border-b border-cream/10">
                      <SheetClose
                        nativeButton={false}
                        render={
                          <Link
                            href={link.href}
                            className="block py-5 font-display text-3xl text-cream/90 transition-colors hover:text-tan"
                          />
                        }
                      >
                        {link.label}
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-auto flex flex-wrap items-center gap-6 px-6 pb-10">
                <button type="button" onClick={fromMenu("search")} className="label-xs text-cream/70 hover:text-cream">
                  Search
                </button>
                <a
                  href={accountLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-xs text-cream/70 hover:text-cream"
                >
                  Account
                </a>
                <button type="button" onClick={fromMenu("wishlist")} className="label-xs text-cream/70 hover:text-cream">
                  Wishlist
                </button>
                <button type="button" onClick={fromMenu("cart")} className="label-xs text-cream/70 hover:text-cream">
                  Bag{cartCount > 0 ? ` (${cartCount})` : ""}
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>
    </header>
  );
}
