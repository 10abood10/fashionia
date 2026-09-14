"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, FileText, Paperclip, X } from "lucide-react";

import { Eyebrow } from "@/components/motion/reveal";
import { BankDetails, orderSummaryText, pillOutline, pillPrimary } from "@/components/store/shared";
import { contact, formatPrice, whatsappLink } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Receipt delivery is handled by Netlify Forms: the <form> below carries
 * `data-netlify`, so Netlify registers it when the site is deployed and emails
 * every submission (with the attached receipt) to the address configured in
 * the Netlify dashboard. Nothing here talks to a server of our own.
 */
const FORM_NAME = "payment-receipt";
const MAX_RECEIPT_BYTES = 8 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

const fieldClass =
  "h-12 w-full rounded-full border border-ink/15 bg-white px-5 text-sm font-light text-ink placeholder:text-muted-foreground focus:border-tan focus:outline-none aria-invalid:border-tan";
const areaClass =
  "w-full rounded-2xl border border-ink/15 bg-white px-5 py-4 text-sm font-light text-ink placeholder:text-muted-foreground focus:border-tan focus:outline-none";
const labelClass = "label-xs mb-2 block text-muted-foreground";

type Status = "idle" | "sending" | "sent" | "failed";

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function PayPage() {
  const { hydrated, cartItems, subtotal, clearCart } = useStore();
  const formRef = React.useRef<HTMLFormElement>(null);

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [orderDetails, setOrderDetails] = React.useState("");
  const [note, setNote] = React.useState("");
  const [receipt, setReceipt] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<Status>("idle");
  const [reference, setReference] = React.useState("");
  const [sentSummary, setSentSummary] = React.useState({ amount: "", name: "" });

  /* Pre-fill from the bag once storage has been read; the customer can edit both. */
  const prefilled = React.useRef(false);
  React.useEffect(() => {
    if (!hydrated || prefilled.current) return;
    prefilled.current = true;
    if (cartItems.length > 0) {
      setAmount(String(subtotal));
      setOrderDetails(orderSummaryText(cartItems, subtotal));
    }
  }, [hydrated, cartItems, subtotal]);

  React.useEffect(() => {
    if (!receipt || !receipt.type.startsWith("image/")) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(receipt);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [receipt]);

  function pickReceipt(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setReceipt(null);
      return;
    }
    if (!ACCEPTED.includes(file.type)) {
      setErrors((current) => ({ ...current, receipt: "Please attach a photo (JPG, PNG) or a PDF of the receipt." }));
      event.target.value = "";
      setReceipt(null);
      return;
    }
    if (file.size > MAX_RECEIPT_BYTES) {
      setErrors((current) => ({ ...current, receipt: `That file is ${formatBytes(file.size)} — the limit is 8 MB.` }));
      event.target.value = "";
      setReceipt(null);
      return;
    }
    setErrors((current) => {
      const rest = { ...current };
      delete rest.receipt;
      return rest;
    });
    setReceipt(file);
  }

  function clearReceipt() {
    setReceipt(null);
    const input = formRef.current?.elements.namedItem("receipt") as HTMLInputElement | null;
    if (input) input.value = "";
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please tell us your name.";
    if (!phone.trim() || phone.replace(/\D/g, "").length < 7) next.phone = "Please enter a phone or WhatsApp number.";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = "That email doesn't look right.";
    const value = Number(amount);
    if (!amount.trim() || !Number.isFinite(value) || value <= 0) next.amount = "Enter the amount you transferred.";
    if (!receipt) next.receipt = "Please attach the transfer receipt.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;

    const form = event.currentTarget;
    const body = new FormData(form);
    body.set("form-name", FORM_NAME);
    body.set("submitted-at", new Date().toISOString());

    setStatus("sending");
    try {
      const response = await fetch(form.getAttribute("action") ?? "/pay/", {
        method: "POST",
        body,
      });
      if (!response.ok) throw new Error(`Form endpoint answered ${response.status}`);

      setReference(`FO-${Date.now().toString(36).toUpperCase()}`);
      setSentSummary({ amount: formatPrice(Number(amount)), name: name.trim() });
      setStatus("sent");
      clearCart();
    } catch (error) {
      console.error("[pay] receipt submission failed", error);
      setStatus("failed");
    }
  }

  const whatsappFallback = whatsappLink(
    [
      `Hello FashiOnia, I'm ${name.trim() || "…"} and I've transferred ${amount ? formatPrice(Number(amount)) : "…"} to ${contact.bank.name}.`,
      orderDetails.trim() ? `\nOrder:\n${orderDetails.trim()}` : "",
      "\nI'll send the receipt here.",
    ].join(""),
  );

  return (
    <main className="bg-cream pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <Link
          href="/"
          className="label-xs inline-flex items-center gap-2 text-muted-foreground transition-colors duration-300 hover:text-ink"
        >
          <ArrowLeft className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
          Back to shop
        </Link>

        <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-20">
          {/* ---- Form -------------------------------------------------- */}
          <div>
            <Eyebrow className="justify-start">Payment</Eyebrow>
            <h1 className="mt-6 font-display text-[clamp(36px,5vw,60px)] leading-[0.95] font-normal tracking-[-0.02em] text-ink">
              Complete your payment
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed font-light text-muted-foreground">
              Transfer the total to the account shown, then attach your receipt below. We confirm every
              payment personally and get in touch on WhatsApp or email.
            </p>

            {status === "sent" ? (
              <div role="status" className="mt-12 rounded-2xl border border-tan/40 bg-tan/10 p-8">
                <div className="flex items-start gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-tan text-espresso">
                    <Check className="size-4" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-display text-2xl text-ink">Receipt sent</h2>
                    <p className="mt-2 text-sm font-light text-muted-foreground">
                      Thank you, {sentSummary.name}. Your transfer of {sentSummary.amount} has been
                      logged under reference <span className="font-medium text-ink tabular-nums">{reference}</span>.
                      We check every receipt personally and will confirm shortly.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <a
                        href={whatsappFallback}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(pillOutline, "sm:w-auto")}
                      >
                        Also notify us on WhatsApp
                      </a>
                      <Link href="/" className={cn(pillPrimary, "sm:w-auto")}>
                        Back to shop
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form
                ref={formRef}
                name={FORM_NAME}
                method="POST"
                action="/pay/"
                encType="multipart/form-data"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                noValidate
                onSubmit={handleSubmit}
                className="mt-12 space-y-7"
              >
                {/* Netlify needs these in the static markup and in the POST body. */}
                <input type="hidden" name="form-name" value={FORM_NAME} />
                <p className="hidden" aria-hidden="true">
                  <label>
                    Don’t fill this in: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>

                <div className="grid gap-7 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pay-name" className={labelClass}>
                      Full name
                    </label>
                    <input
                      id="pay-name"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? "pay-name-error" : undefined}
                      className={fieldClass}
                    />
                    {errors.name && (
                      <p id="pay-name-error" role="alert" className="mt-2 text-xs font-light text-tan">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="pay-phone" className={labelClass}>
                      Phone / WhatsApp
                    </label>
                    <input
                      id="pay-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      aria-invalid={errors.phone ? true : undefined}
                      aria-describedby={errors.phone ? "pay-phone-error" : undefined}
                      className={fieldClass}
                    />
                    {errors.phone && (
                      <p id="pay-phone-error" role="alert" className="mt-2 text-xs font-light text-tan">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-7 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pay-email" className={labelClass}>
                      Email <span className="normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      id="pay-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? "pay-email-error" : undefined}
                      className={fieldClass}
                    />
                    {errors.email && (
                      <p id="pay-email-error" role="alert" className="mt-2 text-xs font-light text-tan">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="pay-amount" className={labelClass}>
                      Amount transferred (USD)
                    </label>
                    <input
                      id="pay-amount"
                      name="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      aria-invalid={errors.amount ? true : undefined}
                      aria-describedby={errors.amount ? "pay-amount-error" : undefined}
                      className={fieldClass}
                    />
                    {errors.amount && (
                      <p id="pay-amount-error" role="alert" className="mt-2 text-xs font-light text-tan">
                        {errors.amount}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="pay-order" className={labelClass}>
                    Order details
                  </label>
                  <textarea
                    id="pay-order"
                    name="order"
                    rows={5}
                    value={orderDetails}
                    onChange={(e) => setOrderDetails(e.target.value)}
                    placeholder="What are you paying for? Filled in automatically from your bag."
                    className={areaClass}
                  />
                </div>

                <div>
                  <span id="pay-receipt-label" className={labelClass}>
                    Transfer receipt
                  </span>
                  <input
                    id="pay-receipt"
                    name="receipt"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
                    onChange={pickReceipt}
                    aria-labelledby="pay-receipt-label"
                    aria-describedby={errors.receipt ? "pay-receipt-error" : "pay-receipt-hint"}
                    className="sr-only"
                  />
                  {receipt ? (
                    <div className="flex items-center gap-4 rounded-2xl border border-tan/50 bg-white p-4">
                      {preview ? (
                        <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                          <Image src={preview} alt="" fill unoptimized sizes="64px" className="object-cover" />
                        </span>
                      ) : (
                        <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-sand text-muted-foreground">
                          <FileText className="size-6" strokeWidth={1.25} aria-hidden="true" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{receipt.name}</p>
                        <p className="mt-0.5 text-xs font-light text-muted-foreground">{formatBytes(receipt.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={clearReceipt}
                        aria-label="Remove receipt"
                        className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-sand hover:text-ink"
                      >
                        <X className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="pay-receipt"
                      className={cn(
                        "flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed bg-white/60 px-6 py-8 text-sm font-light text-muted-foreground transition-colors duration-300 hover:border-tan hover:text-ink focus-within:border-tan",
                        errors.receipt ? "border-tan" : "border-ink/20",
                      )}
                    >
                      <Paperclip className="size-4 shrink-0 text-tan" strokeWidth={1.5} aria-hidden="true" />
                      Attach a photo or PDF of the receipt
                    </label>
                  )}
                  {errors.receipt ? (
                    <p id="pay-receipt-error" role="alert" className="mt-2 text-xs font-light text-tan">
                      {errors.receipt}
                    </p>
                  ) : (
                    <p id="pay-receipt-hint" className="mt-2 text-xs font-light text-muted-foreground">
                      JPG, PNG or PDF, up to 8 MB.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="pay-note" className={labelClass}>
                    Note <span className="normal-case tracking-normal">(optional)</span>
                  </label>
                  <textarea
                    id="pay-note"
                    name="note"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Delivery address, sizing, anything we should know."
                    className={areaClass}
                  />
                </div>

                {status === "failed" && (
                  <div role="alert" className="rounded-2xl border border-tan/50 bg-tan/10 p-5 text-sm font-light text-ink">
                    <p>
                      The receipt couldn’t be sent just now. Please try again, or send it to us directly:
                    </p>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <a href={whatsappFallback} target="_blank" rel="noopener noreferrer" className={cn(pillOutline, "sm:w-auto")}>
                        WhatsApp
                      </a>
                      <a
                        href={`mailto:${contact.email}?subject=${encodeURIComponent("Payment receipt — FashiOnia")}`}
                        className={cn(pillOutline, "sm:w-auto")}
                      >
                        Email {contact.email}
                      </a>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button type="submit" disabled={status === "sending"} className={cn(pillPrimary, "sm:w-auto sm:px-10")}>
                    {status === "sending" ? "Sending…" : "Send receipt"}
                  </button>
                  <p className="mt-4 text-xs font-light text-muted-foreground">
                    Your receipt goes straight to the FashiOnia team at{" "}
                    <a href={`mailto:${contact.email}`} className="underline underline-offset-4 hover:text-ink">
                      {contact.email}
                    </a>
                    .
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* ---- Pay-to card ---------------------------------------------- */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl bg-sand/60 p-6 lg:p-8">
              <h2 className="label-xs text-muted-foreground">Pay to · Bank transfer</h2>
              <div className="mt-5">
                <BankDetails />
              </div>

              <div className="mt-7 border-t border-ink/10 pt-6">
                <div className="flex items-baseline justify-between">
                  <span className="label-xs text-muted-foreground">Amount due</span>
                  <span className="font-display text-2xl text-ink">
                    {cartItems.length > 0 ? formatPrice(subtotal) : "—"}
                  </span>
                </div>
                {cartItems.length > 0 ? (
                  <ul className="mt-4 space-y-2.5">
                    {cartItems.map(({ product, qty, lineTotal }) => (
                      <li key={product.id} className="flex items-baseline justify-between gap-4 text-sm">
                        <span className="min-w-0 truncate font-light text-ink">
                          <span className="tabular-nums">{qty} ×</span> {product.name}
                        </span>
                        <span className="shrink-0 font-medium text-ink">{formatPrice(lineTotal)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-xs leading-relaxed font-light text-muted-foreground">
                    Your bag is empty — enter the amount you transferred and describe what it’s for.
                  </p>
                )}
              </div>

              <p className="mt-6 text-xs leading-relaxed font-light text-muted-foreground">
                Questions? WhatsApp{" "}
                <a href={whatsappLink("Hello FashiOnia 👋")} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-ink" dir="ltr">
                  {contact.whatsapp.display}
                </a>{" "}
                or email{" "}
                <a href={`mailto:${contact.email}`} className="underline underline-offset-4 hover:text-ink">
                  {contact.email}
                </a>
                .
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
