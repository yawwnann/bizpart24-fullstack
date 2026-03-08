"use client";

import { Filter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useFetchCategories } from "@/hooks/useFetchCategories";
import { useSearchParams } from "next/navigation";

export function CatalogSidebar() {
  const { categories } = useFetchCategories();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-gray-200 bg-white overflow-y-auto h-full">
      <div className="p-6 space-y-8">
        {/* Category Filter */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Kategori
          </h3>
          <div className="space-y-1.5">
            <Link
              href="/products"
              className={`block text-sm px-2 py-1 rounded-md transition-all ${
                !categoryParam
                  ? "font-bold text-[#D92D20] bg-red-50"
                  : "text-gray-600 hover:text-[#D92D20] hover:bg-gray-50"
              }`}
            >
              Semua Kategori
            </Link>
            {categories.map((cat) => {
              const isActive =
                !!categoryParam &&
                cat.name.toLowerCase() === categoryParam.toLowerCase();
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.name.toLowerCase()}`}
                  className={`block text-sm px-2 py-1 rounded-md transition-all ${
                    isActive
                      ? "font-bold text-[#D92D20] bg-red-50"
                      : "text-gray-600 hover:text-[#D92D20] hover:bg-gray-50"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Rentang Harga</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#D92D20]"
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#D92D20]"
              />
            </div>
            <Button className="w-full bg-gray-900 hover:bg-[#D92D20] text-white h-9 text-sm">
              Terapkan
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
