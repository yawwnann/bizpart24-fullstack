"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import {
  ShoppingCart,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  Minus,
  Plus,
  ArrowLeft,
  Package,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useCart } from "@/context/CartContext";

interface ProductImage {
  id: string;
  url: string;
  order: number;
}

interface ProductDetail {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  year: number;
  category: string;
  make: string;
  model: string;
  images?: ProductImage[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.data);
          setActiveImage(res.data.data.image);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main id="main-content" className="flex-1">
        {/* Skeleton Breadcrumb */}
        <div className="container mx-auto px-4 md:px-8 py-3">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="flex items-center gap-1">
            <div className="h-3 w-14 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-3 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-14 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-3 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        {/* Skeleton Content */}
        <div className="container mx-auto px-4 md:px-8 pb-10 space-y-4">
          <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Skeleton Image */}
            <div className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
            {/* Skeleton Info */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <div className="h-6 w-28 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="h-7 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
              <div className="border-t border-b border-gray-100 py-3 space-y-2">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-14 bg-gray-200 rounded animate-pulse" />
                <div className="h-9 w-28 bg-gray-200 rounded-lg animate-pulse" />
              </div>
              <div className="h-11 w-full bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-11 w-full bg-gray-200 rounded-lg animate-pulse" />
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Skeleton Description */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 space-y-3">
            <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-4/6 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main id="main-content" className="flex-1">
        <div className="flex flex-col items-center justify-center h-96 gap-4 text-center px-4">
          <Package className="w-16 h-16 text-gray-200" />
          <p className="text-xl font-bold text-gray-700">
            Produk tidak ditemukan
          </p>
          <p className="text-gray-400 text-sm max-w-xs">
            Produk ini mungkin telah dihapus atau ID tidak valid.
          </p>
          <Button
            className="bg-[#D92D20] hover:bg-[#b91c1c] text-white"
            asChild
          >
            <Link href="/products">Kembali ke Katalog</Link>
          </Button>
        </div>
        </main>
        <Footer />
      </div>
    );
  }

  const descParagraphs = product.description
    ? product.description.split("\n").filter((l) => l.trim().length > 0)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
      {/* Back + Breadcrumb */}
      <nav aria-label="Breadcrumb" className="container mx-auto px-4 md:px-8 py-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#D92D20] transition-colors font-medium mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
        <ol className="text-xs text-gray-400 flex items-center gap-1 flex-wrap list-none p-0 m-0">
          <li>
            <Link href="/dashboard" className="hover:text-[#D92D20] transition-colors">
              Beranda
            </Link>
          </li>
          <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
          <li>
            <Link href="/products" className="hover:text-[#D92D20] transition-colors">
              Katalog
            </Link>
          </li>
          <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
          <li>
            <Link
              href={`/products?category=${product.category.toLowerCase()}`}
              className="hover:text-[#D92D20] transition-colors"
            >
              {product.category}
            </Link>
          </li>
          <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
          <li aria-current="page">
            <span className="text-gray-600 font-medium truncate max-w-50 inline-block">{product.name}</span>
          </li>
        </ol>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 pb-10 space-y-4">
        <article className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-3">
            {/* Main Image */}
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 group">
              <img
                src={activeImage || product.image}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Thumbnails — show only if there are detail images */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {/* Profile image thumbnail */}
                <button
                  onClick={() => setActiveImage(product.image)}
                  className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === product.image
                      ? "border-[#D92D20] ring-1 ring-[#D92D20]/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={product.image}
                    alt="Utama"
                    className="w-full h-full object-cover"
                  />
                </button>
                {/* Detail image thumbnails */}
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img.url)}
                    className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === img.url
                        ? "border-[#D92D20] ring-1 ring-[#D92D20]/30"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Detail ${img.order + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {/* Category + Stock */}
            <div className="flex items-center justify-between">
              <Link
                href={`/products?category=${product.category.toLowerCase()}`}
                className="text-xs font-bold text-[#D92D20] bg-red-50 px-3 py-1 rounded-full uppercase tracking-wide hover:bg-red-100 transition-colors"
              >
                {product.category}
              </Link>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  product.stock > 0
                    ? "text-green-700 bg-green-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {product.stock > 0 ? ` Stok ${product.stock}` : " Habis"}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>

            {/* Price */}
            <div className="border-t border-b border-gray-100 py-3">
              <div className="text-2xl md:text-3xl font-bold text-[#D92D20]">
                Rp {product.price.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-gray-400 mt-1">Sudah termasuk pajak</p>
            </div>

            {/* Qty + Actions */}
            <div className="space-y-3">
              {/* Qty Row */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-16">
                  Jumlah
                </span>
                <div className="flex items-center border border-gray-400 rounded-lg overflow-hidden">
                  <button
                    className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-30"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold select-none border-x border-gray-400 text-gray-900">
                    {qty}
                  </span>
                  <button
                    className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-30"
                    onClick={() =>
                      setQty((q) => Math.min(product.stock, q + 1))
                    }
                    disabled={qty >= product.stock}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 h-11 font-bold gap-2 transition-all ${
                    added
                      ? "bg-green-600 hover:bg-green-600"
                      : "bg-[#D92D20] hover:bg-[#b91c1c]"
                  } text-white shadow-sm`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {added ? "Ditambahkan!" : "Masuk Keranjang"}
                </Button>
              </div>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/6282140130066?text=${encodeURIComponent(`Halo, saya tertarik dengan produk:\n${product.name}\nHarga: Rp ${product.price.toLocaleString("id-ID")}\n\nApakah stok masih tersedia?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-11 rounded-lg font-bold text-white bg-[#25D366] hover:bg-[#1da851] transition-colors text-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Hubungi via WhatsApp
              </a>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-[#D92D20]" />
                </div>
                <span className="text-xs text-gray-500 leading-tight">
                  Pengiriman Cepat
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#D92D20]" />
                </div>
                <span className="text-xs text-gray-500 leading-tight">
                  Jaminan Asli
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-[#D92D20]" />
                </div>
                <span className="text-xs text-gray-500 leading-tight">
                  Garansi Retur
                </span>
              </div>
            </div>
          </div>
        </article>

        {/* Description Section */}}
        {descParagraphs.length > 0 && (
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
              Deskripsi Produk
            </h2>
            <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
              {descParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        )}
      </div>
      </main>
      <Footer />
    </div>
  );
}
