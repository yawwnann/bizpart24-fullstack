"use client";

import Link from "next/link";
import { ArrowRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CategoryCardSkeleton } from "@/components/ui/CategoryCardSkeleton";
import { useFetchCategories } from "@/hooks/useFetchCategories";

export function CategoryList() {
  const { categories, loading } = useFetchCategories();

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Kategori Terpopuler
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Paling banyak dicari oleh pelanggan kami minggu ini.
          </p>
        </div>
        <Button
          variant="ghost"
          className="text-[#D92D20] hover:text-[#b91c1c] hover:bg-red-50"
          asChild
        >
          <Link href="/products">
            Lihat Semua <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {loading
          ? // Category Skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))
          : categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.name.toLowerCase()}`}
                className="group"
              >
                <Card className="h-full border border-gray-100 hover:border-[#D92D20] hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center p-6 text-center bg-white rounded-xl">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-50 transition-colors">
                    <Settings className="w-6 h-6 text-gray-700 group-hover:text-[#D92D20] transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-black">
                    {category.name}
                  </span>
                </Card>
              </Link>
            ))}
      </div>
    </section>
  );
}
