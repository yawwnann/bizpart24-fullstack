"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  Grid,
  ShoppingBag,
  CreditCard,
  BookOpen,
  Phone,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useFetchCategories } from "@/hooks/useFetchCategories";
import { useCart } from "@/context/CartContext";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const { categories } = useFetchCategories();
  const { cartItems } = useCart();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={toggleMenu} className="mr-2">
        <Menu className="w-6 h-6 text-gray-700" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-60 animate-in fade-in duration-200"
          onClick={closeMenu}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-[80%] max-w-xs bg-white shadow-xl z-70 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="font-bold text-lg text-gray-900">Menu</div>
          <Button variant="ghost" size="icon" onClick={closeMenu}>
            <X className="w-5 h-5 text-gray-500" />
          </Button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-64px)] p-4 space-y-6">
          {/* Main Navigation */}
          <nav className="space-y-1">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-[#D92D20] transition-colors font-medium"
            >
              <Home className="w-5 h-5" /> Beranda
            </Link>

            {/* Katalog with collapsible categories */}
            <Link
              href="/products"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-[#D92D20] transition-colors font-medium"
            >
              <Grid className="w-5 h-5" /> Katalog Produk
            </Link>
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center justify-between w-full px-3 py-2 ml-4 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-[#D92D20] transition-colors"
              suppressHydrationWarning
            >
              <span>Semua Kategori</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showCategories ? "rotate-180" : ""}`}
              />
            </button>
            {showCategories &&
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.name.toLowerCase()}`}
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-[#D92D20] transition-colors text-sm ml-8 border-l border-gray-100"
                >
                  {cat.name}
                </Link>
              ))}

            <Link
              href="/cart"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-[#D92D20] transition-colors font-medium"
            >
              <ShoppingBag className="w-5 h-5" /> Keranjang
              {cartCount > 0 && (
                <span className="ml-auto bg-[#D92D20] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/payment"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-[#D92D20] transition-colors font-medium"
            >
              <CreditCard className="w-5 h-5" /> Pembayaran
            </Link>
          </nav>

          {/* Other Links */}
          <div className="border-t border-gray-100 pt-6 space-y-1">
            <Link
              href="/tutorial"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-[#D92D20] transition-colors font-medium"
            >
              <BookOpen className="w-5 h-5" /> Tutorial Pembelian
            </Link>
            <a
              href="https://wa.me/6282140130066"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-[#D92D20] transition-colors font-medium"
            >
              <Phone className="w-5 h-5" /> Hubungi Kami
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
