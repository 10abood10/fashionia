"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

import { DURATION, EASE, Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "fashionia:newsletter";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  /* A subscription from a previous visit keeps the success state after refresh. */
  React.useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) setSubmitted(true);
    } catch (storageError) {
      console.warn("[newsletter] storage unavailable", storageError);
    }
  }, []);

  /* There is no email provider wired up: the address is only kept locally so
     the form cannot be re-submitted by accident. Nothing is sent anywhere. */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const value = email.trim();
    if (!value) {
      setError("Please enter your email address.");
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setError("That doesn't look like a valid email address.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (storageError) {
      console.warn("[newsletter] could not remember subscription", storageError);
    }
    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <section aria-labelledby="newsletter-heading" className="bg-espresso py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2
            id="newsletter-heading"
            className="font-display text-[clamp(34px,4.6vw,58px)] leading-[0.98] font-normal tracking-[-0.02em] text-cream"
          >
            Join the FashiOnia Circle
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed font-light text-cream/65">
            Early access to new edits, private sales and the occasional letter
            from the atelier.
          </p>

          <div className="mt-10 min-h-[60px]">
            <AnimatePresence mode="wait" initial={false}>
              {submitted ? (
                <motion.p
                  key="success"
                  role="status"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DURATION, ease: EASE }}
                  className="flex items-center justify-center gap-2.5 rounded-full border border-tan/40 bg-tan/10 px-6 py-4 text-sm font-light text-cream"
                >
                  <Check className="size-4 shrink-0 text-tan" strokeWidth={2} aria-hidden="true" />
                  You’re on the list. Look out for a note from us shortly.
                </motion.p>
              ) : (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DURATION, ease: EASE }}
                  className="mx-auto max-w-md"
                >
                  <div className="relative flex items-center">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="your@email.com"
                      value={email}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? "newsletter-error" : undefined}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (error) setError(null);
                      }}
                      className={cn(
                        "h-[60px] w-full rounded-full border bg-cream/5 pr-[150px] pl-7 text-sm font-light text-cream placeholder:text-cream/55 focus:border-tan/60 focus:outline-none",
                        error ? "border-tan" : "border-cream/20",
                      )}
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="absolute top-1.5 right-1.5 bottom-1.5 inline-flex items-center gap-2 rounded-full bg-tan px-6 text-[11px] font-medium tracking-[0.18em] text-espresso uppercase transition-colors duration-300 hover:bg-cream disabled:opacity-60"
                    >
                      Subscribe
                      <ArrowRight className="size-3.5" strokeWidth={2} aria-hidden="true" />
                    </button>
                  </div>
                  <p
                    id="newsletter-error"
                    role="alert"
                    className={cn("mt-3 text-xs font-light text-tan", !error && "sr-only")}
                  >
                    {error ?? ""}
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-5 text-xs font-light text-cream/60">
            No more than two emails a month. Unsubscribe any time.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
