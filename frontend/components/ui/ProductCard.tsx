"use client"

import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";

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
          <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold text-white rounded shadow-sm z-10 ${product.isNew ? 'bg-yellow-400 text-black' : 'bg-[#D92D20]'}`}>
            {product.discount}
          </span>
        )}
        <div className="relative w-full h-full duration-500 transition-transform group-hover:scale-110">
            <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-cover"
            />
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="mb-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.category}</p>
        </div>
        
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#D92D20] transition-colors leading-relaxed h-10" title={product.name}>
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
           <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
           <span className="text-xs font-medium text-gray-600">{product.rating}</span>
           <span className="text-gray-300 text-[10px]">•</span>
           <span className="text-xs text-gray-400">{product.reviews} terjual</span>
        </div>

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
            
            <Button size="icon" className="w-8 h-8 rounded-full bg-gray-50 text-gray-900 hover:bg-[#D92D20] hover:text-white transition-all shadow-none hover:shadow-md" onClick={handleAddToCart}>
               <ShoppingCart className="w-4 h-4" />
            </Button>
        </div>
      </CardContent>
    </Card>
  )
}
