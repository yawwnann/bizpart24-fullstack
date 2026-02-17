"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import api from "@/lib/api";

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

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await import("@/lib/api").then(mod => mod.default.get('/products'));
        console.log("API Response (ProductList):", response.data);
        if (response.data.success) {
          // Map backend _id to frontend id
          const mappedProducts = response.data.data.map((item: any) => ({
            ...item,
            id: item._id,
            rating: item.rating || 4.5, // Default if missing
            reviews: item.reviews || 0,
            originalPrice: null, // Backend might not have this yet
            discount: null,
            isNew: false
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
      <section className="py-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
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
           <h2 className="text-2xl font-bold text-gray-900">Rekomendasi Pilihan</h2>
           <p className="text-gray-500 mt-1 text-sm">Produk terbaik dengan ulasan tertinggi.</p>
        </div>
        <Button variant="ghost" className="text-[#D92D20] hover:text-[#b91c1c] hover:bg-red-50">
          Lihat Katalog <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>

      {products.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">Belum ada produk tersedia.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
