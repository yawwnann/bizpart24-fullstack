import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { CategoryList } from "@/components/sections/CategoryList";
import { ProductList } from "@/components/sections/ProductList";
import { FeatureBenefits } from "@/components/sections/FeatureBenefits";
import { Brands } from "@/components/sections/Brands";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | BIZSPAREPART24",
  description: "Temukan ribuan suku cadang asli dengan harga terbaik.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero />
        <div className="container mx-auto px-4 md:px-8 space-y-12 pb-16">
          <CategoryList />
          <ProductList />
          <FeatureBenefits />
          <Brands />
        </div>
      </main>
      <Footer />
    </div>
  );
}
