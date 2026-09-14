import type { Metadata } from "next";

import { Navbar } from "@/components/sections/navbar";
import { SiteFooter } from "@/components/sections/site-footer";
import { StoreDrawers } from "@/components/store/drawers";
import { PayPage } from "@/components/store/pay-page";

export const metadata: Metadata = {
  title: "Pay — FashiOnia",
  description: "Pay by bank transfer and send FashiOnia your receipt.",
  robots: { index: false },
};

export default function Pay() {
  return (
    <>
      <Navbar />
      <PayPage />
      <SiteFooter />
      <StoreDrawers />
    </>
  );
}
