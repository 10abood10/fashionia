"use client";

import * as React from "react";
import Link from "next/link";
import { AtSign, Camera, ImageUp, Mail, MessageCircle, Play, X } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Wordmark } from "@/components/store/wordmark";
import { contact, footerColumns, socialLinks, whatsappLink } from "@/lib/data";
import type { FooterLink } from "@/lib/data";
import { useStore } from "@/lib/store";

/* lucide-react v1 no longer ships brand marks, so these are neutral glyphs
   carrying the platform name in their accessible label. A platform without a
   configured URL routes to WhatsApp instead of going nowhere. */
const socials = [
  {
    label: socialLinks.instagram ? "FashiOnia on Instagram" : "Instagram — ask us on WhatsApp",
    href: socialLinks.instagram || whatsappLink("Hello FashiOnia, where can I follow you on Instagram?"),
    Icon: Camera,
  },
  {
    label: socialLinks.youtube ? "FashiOnia on YouTube" : "YouTube — ask us on WhatsApp",
    href: socialLinks.youtube || whatsappLink("Hello FashiOnia, do you have a YouTube channel?"),
    Icon: Play,
  },
  {
    label: socialLinks.threads ? "FashiOnia on Threads" : "Threads — ask us on WhatsApp",
    href: socialLinks.threads || whatsappLink("Hello FashiOnia, are you on Threads?"),
    Icon: AtSign,
  },
  { label: `Email FashiOnia at ${contact.email}`, href: `mailto:${contact.email}`, Icon: Mail },
];

const linkClass =
  "text-[13px] font-light text-cream/65 transition-colors duration-300 hover:text-cream";

/** Longest side of the stored logo, in px. Keeps the data URL well within storage limits. */
const LOGO_MAX_EDGE = 480;

/** Reads an image file and returns a downscaled PNG data URL. */
function fileToLogoDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, LOGO_MAX_EDGE / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas unavailable"));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unreadable image"));
    };
    image.src = url;
  });
}

function LogoUpload() {
  const { logo, setLogo, hydrated } = useStore();
  const [message, setMessage] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file (PNG, JPG or SVG).");
      return;
    }
    try {
      setLogo(await fileToLogoDataUrl(file));
      setMessage("Logo updated on this device.");
    } catch (error) {
      console.warn("[logo] could not read file", error);
      setMessage("That image couldn't be read. Try another file.");
    }
  }

  if (!hydrated) return null;

  return (
    <div className="mt-7">
      <input
        ref={inputRef}
        id="logo-upload"
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="sr-only"
      />
      <div className="flex flex-wrap items-center gap-4">
        <label
          htmlFor="logo-upload"
          className="label-xs inline-flex cursor-pointer items-center gap-2 text-cream/70 transition-colors duration-300 hover:text-cream focus-within:text-cream"
        >
          <ImageUp className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
          {logo ? "Replace logo" : "Upload logo"}
        </label>
        {logo && (
          <button
            type="button"
            onClick={() => {
              setLogo(null);
              setMessage("Logo removed.");
            }}
            className="label-xs inline-flex items-center gap-1.5 text-cream/70 transition-colors duration-300 hover:text-cream"
          >
            <X className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
            Remove
          </button>
        )}
      </div>
      <p role="status" aria-live="polite" className="mt-2 text-xs font-light text-cream/60">
        {message ?? ""}
      </p>
    </div>
  );
}

function FooterAnchor({ link }: { link: FooterLink }) {
  const { setFilter } = useStore();

  if (link.kind === "whatsapp") {
    return (
      <a href={whatsappLink(link.message)} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {link.label}
      </a>
    );
  }
  if (link.kind === "filter") {
    return (
      <Link href="/#new-arrivals" onClick={() => setFilter(link.filter)} className={linkClass}>
        {link.label}
      </Link>
    );
  }
  return (
    <Link href={link.href} className={linkClass}>
      {link.label}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-espresso text-cream">
      <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-12 lg:py-24">
        <Reveal className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 lg:gap-x-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-2xl">
              <Wordmark imgClassName="h-9 max-w-[200px]" />
            </p>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed font-light text-cream/60">
              An edited wardrobe of considered pieces — warm neutrals, honest
              materials and silhouettes built to outlast the season.
            </p>
            <a
              href={whatsappLink("Hello FashiOnia 👋")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[13px] font-light text-cream/80 transition-colors duration-300 hover:text-cream"
            >
              <MessageCircle className="size-4 text-tan" strokeWidth={1.5} aria-hidden="true" />
              <span>
                WhatsApp <span className="tabular-nums" dir="ltr">{contact.whatsapp.display}</span>
              </span>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="mt-2 flex items-center gap-2 text-[13px] font-light text-cream/80 transition-colors duration-300 hover:text-cream"
            >
              <Mail className="size-4 text-tan" strokeWidth={1.5} aria-hidden="true" />
              <span className="break-all">{contact.email}</span>
            </a>
            <ul className="mt-7 flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full border border-cream/15 transition-colors duration-300 hover:border-tan hover:text-tan"
                  >
                    <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <LogoUpload />
          </div>

          {/* Link columns */}
          {footerColumns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="label-xs text-tan">{column.heading}</h2>
              <ul className="mt-6 space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterAnchor link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </Reveal>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-5 px-6 py-7 text-center sm:flex-row sm:justify-between sm:text-left lg:px-12">
          <p className="text-xs font-light text-cream/60">
            © {new Date().getFullYear()} FashiOnia. All rights reserved.
          </p>
          {/* Payment: bank transfer only — the shop takes no card payments on the site. */}
          <dl className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-medium tracking-[0.1em] text-cream/65 uppercase">
            <div className="rounded-md border border-cream/20 px-2.5 py-1.5">
              <dt className="sr-only">Payment method</dt>
              <dd>Bank Transfer · {contact.bank.name}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="text-cream/45">Account</dt>
              <dd className="tabular-nums">{contact.bank.accountNumber}</dd>
            </div>
            <div className="flex items-center gap-1.5 normal-case tracking-normal">
              <dt className="sr-only">Account name</dt>
              <dd lang="ar" dir="rtl" className="text-[12px]">
                {contact.bank.accountName}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </footer>
  );
}
