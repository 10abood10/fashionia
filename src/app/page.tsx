import { BrandStory } from "@/components/sections/brand-story";
import { Categories } from "@/components/sections/categories";
import { Hero } from "@/components/sections/hero";
import { Lookbook } from "@/components/sections/lookbook";
import { Navbar } from "@/components/sections/navbar";
import { NewArrivals } from "@/components/sections/new-arrivals";
import { Newsletter } from "@/components/sections/newsletter";
import { PromoBanner } from "@/components/sections/promo-banner";
import { SiteFooter } from "@/components/sections/site-footer";
import { Testimonials } from "@/components/sections/testimonials";
import { StoreDrawers } from "@/components/store/drawers";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <BrandStory />
        <NewArrivals />
        <PromoBanner />
        <Lookbook />
        <Testimonials />
        <Newsletter />
      </main>
      <SiteFooter />
      <StoreDrawers />
    </>
  );
}
