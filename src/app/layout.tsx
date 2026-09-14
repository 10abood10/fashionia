import type { Metadata } from "next";
import { Jost, Playfair_Display } from "next/font/google";

import { StoreProvider } from "@/lib/store";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-playfair",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FashiOnia — Modern Luxury, Quietly Made",
  description:
    "FashiOnia is an edited wardrobe of considered pieces: warm neutrals, honest materials and silhouettes built to outlast the season.",
  openGraph: {
    title: "FashiOnia — Modern Luxury, Quietly Made",
    description:
      "An edited wardrobe of considered pieces: warm neutrals, honest materials and silhouettes built to outlast the season.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* The font variables live on <html> because `--font-sans` is consumed
       there by the base layer. */
    <html lang="en" className={`${playfair.variable} ${jost.variable}`}>
      <body className="antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
