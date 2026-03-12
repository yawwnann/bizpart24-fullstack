"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/ProductCardSkeleton";

interface Product {
  id: string | number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviews: number;
  image: string;
  discount?: string | null;
  isNew?: boolean;
}

interface ProductResponse {
  success: boolean;
  data: Product[];
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await import("@/lib/api").then((mod) =>
          mod.default.get<ProductResponse>("/products"),
        );
        console.log("API Response (ProductList):", response.data);
        if (response.data.success) {
          // Add default values for missing fields
          const mappedProducts = response.data.data.map((item) => ({
            ...item,
            rating: item.rating || 4.5,
            reviews: item.reviews || 0,
            originalPrice: null,
            discount: null,
            isNew: false,
          }));
          setProducts(mappedProducts);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
        setError("Gagal memuat produk. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Produk Terbaru</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Koleksi terbaru suku cadang berkualitas tinggi
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 text-center text-red-500">
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Rekomendasi Pilihan
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Produk terbaik dengan ulasan tertinggi.
          </p>
        </div>
        <Button
          variant="ghost"
          className="text-[#D92D20] hover:text-[#b91c1c] hover:bg-red-50"
        >
          Lihat Katalog <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center col-span-full">
          Belum ada produk tersedia.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
