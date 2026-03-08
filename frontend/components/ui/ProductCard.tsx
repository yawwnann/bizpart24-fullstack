"use client";

import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";

interface ProductCardProps {
  product: {
    id: number | string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number | null;
    rating: number;
    reviews: number;
    image: string;
    discount?: string | null;
    isNew?: boolean;
  };
}

import { useCart } from "@/context/CartContext";

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to detail page
    addToCart(product);
  };

  return (
    <Card className="h-full group border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden bg-white flex flex-col">
      {/* Image Container */}
      <div className="relative h-52 w-full bg-gray-100 p-0 flex items-center justify-center overflow-hidden border-b border-gray-100">
        {product.discount && (
          <span
            className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold text-white rounded shadow-sm z-10 ${product.isNew ? "bg-yellow-400 text-black" : "bg-[#D92D20]"}`}
          >
            {product.discount}
          </span>
        )}
        <div className="relative w-full h-full duration-500 transition-transform group-hover:scale-110">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="mb-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {product.category}
          </p>
        </div>

        <h3
          className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#D92D20] transition-colors leading-relaxed h-10"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Price & Action */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            {product.originalPrice && (
              <div className="text-xs text-gray-400 line-through">
                Rp {product.originalPrice.toLocaleString("id-ID")}
              </div>
            )}
            <div className="text-lg font-bold text-[#D92D20]">
              Rp {product.price.toLocaleString("id-ID")}
            </div>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(
                  `https://wa.me/6282140130066?text=${encodeURIComponent(`Halo, saya tertarik dengan produk:\n${product.name}\nHarga: Rp ${product.price.toLocaleString("id-ID")}\n\nApakah stok masih tersedia?`)}`,
                  "_blank",
                );
              }}
              className="w-8 h-8 rounded-full bg-gray-50 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all shadow-none hover:shadow-md flex items-center justify-center cursor-pointer border-none p-0"
              title="Hubungi via WhatsApp"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </button>
            <Button
              size="icon"
              className="w-8 h-8 rounded-full bg-gray-50 text-gray-900 hover:bg-[#D92D20] hover:text-white transition-all shadow-none hover:shadow-md"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
