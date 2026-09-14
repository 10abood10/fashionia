"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { contact, formatPrice } from "@/lib/data";
import type { CartItem } from "@/lib/store";

export const pillPrimary =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-espresso px-6 py-3.5 text-[11px] font-medium tracking-[0.18em] text-cream uppercase transition-colors duration-300 hover:bg-tan hover:text-espresso disabled:cursor-not-allowed disabled:opacity-40";

export const pillOutline =
  "inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-[11px] font-medium tracking-[0.18em] text-ink uppercase transition-colors duration-300 hover:border-ink";

/** Plain-text order summary, used in the WhatsApp message and the receipt form. */
export function orderSummaryText(items: CartItem[], subtotal: number) {
  if (items.length === 0) return "";
  const lines = items.map(
    (item) => `${item.qty} × ${item.product.name} — ${formatPrice(item.lineTotal)}`,
  );
  return [...lines, "", `Subtotal: ${formatPrice(subtotal)}`].join("\n");
}

/** The WhatsApp message that carries an order to the shop. */
export function orderMessage(items: CartItem[], subtotal: number) {
  return [
    "Hello FashiOnia 👋",
    "I'd like to place an order:",
    "",
    orderSummaryText(items, subtotal),
    "",
    `I'll pay by bank transfer to ${contact.bank.name} and send the receipt.`,
  ].join("\n");
}

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.warn("[copy] clipboard unavailable", error);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className="grid size-8 shrink-0 place-items-center rounded-full border border-ink/15 text-ink transition-colors duration-200 hover:border-ink"
    >
      {copied ? (
        <Check className="size-3.5 text-tan" strokeWidth={2} aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
      )}
    </button>
  );
}

/** Bank transfer details — shown wherever the customer needs to pay. */
export function BankDetails({ compact = false }: { compact?: boolean }) {
  return (
    <dl className={compact ? "space-y-2.5 text-sm" : "space-y-3 text-sm"}>
      <div className="flex items-center justify-between gap-3">
        <dt className="font-light text-muted-foreground">Bank</dt>
        <dd className="font-medium text-ink">{contact.bank.name}</dd>
      </div>
      <div className="flex items-center justify-between gap-3">
        <dt className="font-light text-muted-foreground">Account name</dt>
        <dd className="font-medium text-ink" lang="ar" dir="rtl">
          {contact.bank.accountName}
        </dd>
      </div>
      <div className="flex items-center justify-between gap-3">
        <dt className="font-light text-muted-foreground">Account number</dt>
        <dd className="flex items-center gap-2">
          <span className="font-medium text-ink tabular-nums">{contact.bank.accountNumber}</span>
          <CopyButton value={contact.bank.accountNumber} label="account number" />
        </dd>
      </div>
    </dl>
  );
}
