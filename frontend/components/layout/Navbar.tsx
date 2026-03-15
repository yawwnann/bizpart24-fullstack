"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ShoppingBag,
  CreditCard,
  BookOpen,
  Phone,
  Grid,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";

import { MobileMenu } from "./MobileMenu";
import { useCart } from "@/context/CartContext";
import { useFetchCategories } from "@/hooks/useFetchCategories";

function NavbarInner() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems } = useCart();
  const { categories } = useFetchCategories();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    { id: string; name: string; category: string }[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scrolledDown, setScrolledDown] = useState(false);
  const lastScrollY = useRef(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync search input with URL param
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setSuggestions([]);
    setShowSuggestions(false);
  }, [searchParams]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 60) {
        setScrolledDown(true);
      } else {
        setScrolledDown(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setLoadingSuggestions(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/products?search=${encodeURIComponent(q)}&limit=7`,
      );
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setSuggestions(
          data.data.map(
            (p: { id: string; name: string; category: string }) => ({
              id: p.id,
              name: p.name,
              category: p.category,
            }),
          ),
        );
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  const handleQueryChange = (val: string) => {
    setSearchQuery(val);
    setActiveIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSelectSuggestion = (suggestion: { id: string; name: string }) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    router.push(`/products/${suggestion.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeIndex]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/products");
    }
  };

  const isActive = (path: string, category?: string) => {
    if (pathname !== path) return false;

    const currentCategory = searchParams.get("category");
    if (category) {
      return currentCategory === category;
    }
    // If no category specified in isActive check, ensure no category in URL (for generic pages like Dashboard or main Catalog)
    return !currentCategory;
  };

  const linkClass = (active: boolean) =>
    `h-full flex items-center px-1 border-b-2 transition-all ${
      active
        ? "text-[#D92D20] border-[#D92D20] font-bold"
        : "border-transparent text-gray-600 hover:text-[#D92D20] hover:border-[#D92D20]"
    }`;

  const actionLinkClass = (active: boolean) =>
    `flex flex-col items-center gap-1 px-2 py-1 border-b-2 transition-all ${
      active
        ? "text-[#D92D20] border-[#D92D20]"
        : "border-transparent text-gray-600 hover:text-[#D92D20] hover:border-[#D92D20]"
    }`;

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 font-sans border-b border-gray-100">
      {/* Top Row: Logo, Search, Actions */}
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="shrink-0">
            <Image
              src="/logo.png"
              alt="BIZSPAREPART24 Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Search Bar with Autocomplete */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-2xl relative"
        >
          <div className="relative w-full" ref={searchRef}>
            <button
              suppressHydrationWarning
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
            >
              <Search className="w-4 h-4" />
            </button>
            <Input
              value={searchQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="w-full pl-10 pr-4 h-10 text-sm bg-gray-50 border-gray-200 text-gray-900 rounded-full focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all placeholder:text-gray-400"
              placeholder="Cari suku cadang (e.g. Kampas Rem Innova)..."
              autoComplete="off"
            />

            {/* Autocomplete Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
                {loadingSuggestions ? (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center">
                    Mencari...
                  </div>
                ) : (
                  <ul>
                    {suggestions.map((s, idx) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelectSuggestion(s)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                            idx === activeIndex
                              ? "bg-red-50 text-[#D92D20]"
                              : "hover:bg-gray-50 text-gray-800"
                          }`}
                        >
                          <Search className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                          <span className="text-sm flex-1 truncate">
                            {s.name}
                          </span>
                          <span className="text-[10px] text-gray-400 shrink-0 bg-gray-100 px-2 py-0.5 rounded-full">
                            {s.category}
                          </span>
                        </button>
                      </li>
                    ))}
                    {/* Search all results CTA */}
                    <li className="border-t border-gray-100">
                      <button
                        type="submit"
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#D92D20] font-semibold hover:bg-red-50 transition-colors"
                      >
                        <Search className="w-3.5 h-3.5" />
                        Cari semua hasil untuk &quot;{searchQuery}&quot;
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </form>

        {/* User Actions - Minimalist */}
        <div className="flex items-center gap-6">
          {/* Mobile Menu Trigger - right side */}

          <Link
            href="/products"
            className={
              actionLinkClass(pathname.startsWith("/products")) + " group"
            }
          >
            <div className="relative">
              <Grid className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase hidden md:block">
              Katalog
            </span>
          </Link>

          <Link
            href="/cart"
            className={actionLinkClass(isActive("/cart")) + " group"}
          >
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D92D20] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase hidden md:block">
              Keranjang
            </span>
          </Link>
          <MobileMenu />
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/payment"
              className={actionLinkClass(isActive("/payment")) + " group"}
            >
              <div className="relative">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase">Bayar</span>
            </Link>

            <Link
              href="/tutorial"
              className={actionLinkClass(isActive("/tutorial")) + " group"}
            >
              <div className="relative">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase">Tutorial</span>
            </Link>

            <a
              href="https://wa.me/6282140130066"
              target="_blank"
              rel="noopener noreferrer"
              className={actionLinkClass(false) + " group"}
            >
              <div className="relative">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase">Kontak</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Links - with Mega Dropdown */}
      <div className="w-full bg-white border-t border-gray-100 hidden md:block">
        <div className="container mx-auto px-4 md:px-8">
          <nav className="flex items-center gap-8 h-12 text-sm font-medium">
            <Link
              href="/dashboard"
              className={linkClass(isActive("/dashboard"))}
            >
              BERANDA
            </Link>

            {/* Kategori Dropdown Trigger */}
            <div className="group relative h-full flex items-center">
              <button
                suppressHydrationWarning
                className={`h-full flex items-center gap-1 px-1 border-b-2 transition-all ${
                  pathname.startsWith("/products")
                    ? "text-[#D92D20] border-[#D92D20] font-bold"
                    : "border-transparent text-gray-600 hover:text-[#D92D20] hover:border-[#D92D20]"
                }`}
              >
                SEMUA KATEGORI
                <svg
                  className="w-3.5 h-3.5 mt-0.5 transition-transform group-hover:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Mega Dropdown */}
              <div className="absolute top-full left-0 pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {/* invisible bridge to keep hover active */}
                <div className="h-1 w-full" />
                <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6 min-w-170">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Semua Kategori Produk
                    </span>
                    <Link
                      href="/products"
                      className="text-xs font-semibold text-[#D92D20] hover:underline"
                    >
                      Lihat Semua →
                    </Link>
                  </div>

                  {/* Categories Grid - 4 columns */}
                  <div className="grid grid-cols-4 gap-x-6 gap-y-1">
                    {categories.map((cat) => {
                      const active = isActive(
                        "/products",
                        cat.name.toLowerCase(),
                      );
                      return (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.name.toLowerCase()}`}
                          className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm transition-all group/item ${
                            active
                              ? "text-[#D92D20] bg-red-50 font-semibold"
                              : "text-gray-600 hover:text-[#D92D20] hover:bg-red-50"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? "bg-[#D92D20]" : "bg-gray-300 group-hover/item:bg-[#D92D20]"}`}
                          />
                          <span className="leading-tight">{cat.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div
        className={`md:hidden px-4 overflow-hidden transition-all duration-300 ease-in-out ${scrolledDown ? "max-h-0 pb-0 opacity-0" : "max-h-20 pb-3 opacity-100"}`}
      >
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <Input
            className="w-full pl-9 pr-4 h-9 text-sm bg-gray-50 border-none rounded-lg focus:bg-white transition-all placeholder:text-gray-400"
            placeholder="Cari suku cadang..."
          />
        </div>
      </div>
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarInner />
    </Suspense>
  );
}
