"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/ProductCardSkeleton";
import { Filter, Loader2, X, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import api from "@/lib/api";
import { useFetchCategories } from "@/hooks/useFetchCategories";

interface ProductItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  originalPrice?: number | null;
  discount?: string | null;
  isNew?: boolean;
  [key: string]: unknown;
}

interface ApiProductResponse {
  id: string;
  name: string;
  price: number;
  category?: { name: string } | string;
  image?: string;
  rating?: number;
  reviews?: number;
  originalPrice?: number | null;
  discount?: string | null;
  isNew?: boolean;
}

// Create a wrapper component for the content that uses useSearchParams
function ProductCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const sortParam = searchParams.get("sort") || "newest";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const makeParam = searchParams.get("make") || "";
  const modelParam = searchParams.get("model") || "";
  const yearParam = searchParams.get("year") || "";

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 12,
    hasNext: false,
    hasPrev: false,
  });

  const { categories } = useFetchCategories();

  // Filter categories based on search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  useEffect(() => {
    // Reset to page 1 when any filter changes
    setCurrentPage(1);
  }, [
    categoryParam,
    searchParam,
    sortParam,
    minPriceParam,
    maxPriceParam,
    makeParam,
    modelParam,
    yearParam,
  ]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string | number> = {
          page: currentPage,
          limit: 12,
          sort: sortParam,
        };
        if (categoryParam) params.category = categoryParam;
        if (searchParam) params.search = searchParam;
        if (minPriceParam) params.minPrice = minPriceParam;
        if (maxPriceParam) params.maxPrice = maxPriceParam;
        if (makeParam) params.make = makeParam;
        if (modelParam) params.model = modelParam;
        if (yearParam) params.year = yearParam;

        const response = await api.get("/products", {
          params,
          signal: controller.signal,
        });

        if (response.data.success) {
          const mappedProducts: ProductItem[] = response.data.data.map(
            (item: ApiProductResponse) => ({
              ...item,
              category:
                typeof item.category === "object" && item.category?.name
                  ? item.category.name
                  : typeof item.category === "string"
                    ? item.category
                    : "",
              image: item.image ?? "",
              rating: item.rating ?? 4.5,
              reviews: item.reviews ?? 0,
              originalPrice: item.originalPrice ?? null,
              discount: item.discount ?? null,
              isNew: item.isNew ?? false,
            }),
          );
          setProducts(mappedProducts);

          if (response.data.pagination) {
            setPagination(response.data.pagination);
          }
        }
      } catch (err: unknown) {
        // Ignore abort errors — they're intentional cleanup
        if (
          (err as { code?: string })?.code === "ERR_CANCELED" ||
          (err as { name?: string })?.name === "AbortError" ||
          (err as { name?: string })?.name === "CanceledError"
        )
          return;
        console.error("Failed to fetch products", err);
        setError("Gagal memuat produk.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [
    categoryParam,
    searchParam,
    currentPage,
    sortParam,
    minPriceParam,
    maxPriceParam,
    makeParam,
    modelParam,
    yearParam,
  ]);

  const PRICE_RANGES = [
    { label: "Semua Harga", min: "", max: "" },
    { label: "Di bawah Rp 100.000", min: "0", max: "100000" },
    { label: "Rp 100.000 – Rp 300.000", min: "100000", max: "300000" },
    { label: "Rp 300.000 – Rp 1.000.000", min: "300000", max: "1000000" },
    { label: "Rp 1.000.000 – Rp 3.000.000", min: "1000000", max: "3000000" },
    { label: "Di atas Rp 3.000.000", min: "3000000", max: "" },
  ];

  const selectedPriceRange = `${minPriceParam}-${maxPriceParam}`;

  const handlePriceRange = (value: string) => {
    const range = PRICE_RANGES.find((r) => `${r.min}-${r.max}` === value);
    const params = new URLSearchParams(searchParams.toString());
    if (range && (range.min || range.max)) {
      if (range.min) params.set("minPrice", range.min);
      else params.delete("minPrice");
      if (range.max) params.set("maxPrice", range.max);
      else params.delete("maxPrice");
    } else {
      params.delete("minPrice");
      params.delete("maxPrice");
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1"); // Reset to page 1
    router.push(`/products?${params.toString()}`);
  };

  // Dynamic Title
  const title = categoryParam
    ? `Kategori: ${categories.find((c) => c.name.toLowerCase() === categoryParam.toLowerCase())?.name || categoryParam}`
    : searchParam
      ? `Hasil Pencarian: "${searchParam}"`
      : makeParam || modelParam || yearParam
        ? `Hasil Filter: ${[yearParam, makeParam, modelParam].filter(Boolean).join(" ")}`
        : "Katalog Suku Cadang";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1 flex flex-col">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-500 text-sm mt-1">
                  {categoryParam
                    ? `Menampilkan ${pagination.total} produk untuk kategori "${categoryParam}"`
                    : "Jelajahi semua kategori dan produk berkualitas untuk kendaraan Anda."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Mobile Category Filter Button */}
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="md:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 h-10 text-sm font-medium text-gray-700"
                >
                  <Filter className="w-4 h-4" />
                  {categoryParam ? (
                    <span className="text-[#D92D20] font-semibold truncate max-w-30">
                      {categoryParam}
                    </span>
                  ) : (
                    "Kategori"
                  )}
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {/* Sort */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 h-10">
                  <span className="text-xs text-gray-900 font-medium whitespace-nowrap">
                    Urutkan
                  </span>
                  <div className="w-px h-4 bg-gray-200" />
                  <select
                    value={sortParam}
                    onChange={(e) => handleSort(e.target.value)}
                    className="text-sm text-gray-700 border-0 focus:ring-0 cursor-pointer bg-transparent pr-1 font-medium"
                  >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                    <option value="price_asc">Harga Terendah</option>
                    <option value="price_desc">Harga Tertinggi</option>
                    <option value="name_asc">Nama (A-Z)</option>
                    <option value="name_desc">Nama (Z-A)</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 h-10">
                  <span className="text-xs text-gray-900 font-medium whitespace-nowrap">
                    Harga
                  </span>
                  <div className="w-px h-4 bg-gray-200" />
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => handlePriceRange(e.target.value)}
                    className="text-sm text-gray-700 border-0 focus:ring-0 cursor-pointer bg-transparent pr-1 font-medium"
                  >
                    {PRICE_RANGES.map((r) => (
                      <option
                        key={`${r.min}-${r.max}`}
                        value={`${r.min}-${r.max}`}
                      >
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-8 flex-1">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Sidebar - hidden on mobile */}
            <aside className="hidden md:block w-full md:w-64 shrink-0 md:sticky md:top-8 md:self-start">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filter Kategori
                </h3>

                {/* Search Box */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari kategori..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D92D20] focus:border-transparent"
                  />
                </div>

                {/* Category List with Scroll */}
                <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <Link
                    href="/products"
                    className={`block text-sm px-3 py-2 rounded-md transition-all ${
                      !categoryParam
                        ? "font-bold text-[#D92D20] bg-red-50"
                        : "text-gray-600 hover:text-[#D92D20] hover:bg-gray-50"
                    }`}
                  >
                    Semua Kategori
                  </Link>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.name.toLowerCase()}`}
                        className={`block text-sm px-3 py-2 rounded-md transition-all ${
                          categoryParam &&
                          cat.name.toLowerCase() === categoryParam.toLowerCase()
                            ? "font-bold text-[#D92D20] bg-red-50"
                            : "text-gray-600 hover:text-[#D92D20] hover:bg-gray-50"
                        }`}
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 px-3 py-2">
                      Kategori tidak ditemukan
                    </p>
                  )}
                </div>

                {/* Category Count */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Menampilkan {filteredCategories.length} dari{" "}
                    {categories.length} kategori
                  </p>
                </div>
              </div>
            </aside>

            {/* Mobile Category Modal */}
            {showCategoryModal && (
              <>
                <div
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  onClick={() => setShowCategoryModal(false)}
                />
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl md:hidden max-h-[80vh] flex flex-col">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Filter Kategori</h3>
                    <button onClick={() => setShowCategoryModal(false)}>
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Search Box Mobile */}
                  <div className="px-4 pt-4 pb-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cari kategori..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D92D20] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="overflow-y-auto p-4 space-y-1 flex-1">
                    <Link
                      href="/products"
                      onClick={() => {
                        setShowCategoryModal(false);
                        setCategorySearch("");
                      }}
                      className={`block text-sm px-3 py-2.5 rounded-lg transition-all ${
                        !categoryParam
                          ? "font-bold text-[#D92D20] bg-red-50"
                          : "text-gray-700 hover:text-[#D92D20] hover:bg-gray-50"
                      }`}
                    >
                      Semua Kategori
                    </Link>
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.name.toLowerCase()}`}
                          onClick={() => {
                            setShowCategoryModal(false);
                            setCategorySearch("");
                          }}
                          className={`block text-sm px-3 py-2.5 rounded-lg transition-all ${
                            categoryParam &&
                            cat.name.toLowerCase() ===
                              categoryParam.toLowerCase()
                              ? "font-bold text-[#D92D20] bg-red-50"
                              : "text-gray-700 hover:text-[#D92D20] hover:bg-gray-50"
                          }`}
                        >
                          {cat.name}
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 px-3 py-2 text-center">
                        Kategori tidak ditemukan
                      </p>
                    )}
                  </div>

                  {/* Footer with count */}
                  <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-500 text-center">
                      {filteredCategories.length} dari {categories.length}{" "}
                      kategori
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Product Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-20 text-red-500">
                  <p>{error}</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Coba Lagi
                  </Button>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="h-full">
                      <Link
                        href={`/products/${product.id}`}
                        className="block h-full"
                      >
                        <ProductCard product={product} />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500">
                    Tidak ada produk ditemukan untuk kategori ini.
                  </p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href="/products">Lihat Semua Produk</Link>
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && pagination.totalPages > 1 && (
                <div className="mt-12 flex flex-col items-center gap-4">
                  <div className="text-sm text-gray-500">
                    Halaman {pagination.currentPage} dari{" "}
                    {pagination.totalPages}
                    <span className="mx-2">•</span>
                    Total {pagination.total} produk
                  </div>
                  <nav className="flex items-center gap-2">
                    {/* Previous Button */}
                    <Button
                      variant="outline"
                      className="w-10 h-10 p-0"
                      disabled={!pagination.hasPrev}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      &lt;
                    </Button>

                    {/* Page Numbers */}
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1,
                    )
                      .filter((pageNum) => {
                        // Show first page, last page, current page, and pages around current
                        return (
                          pageNum === 1 ||
                          pageNum === pagination.totalPages ||
                          Math.abs(pageNum - pagination.currentPage) <= 1
                        );
                      })
                      .map((pageNum, idx, arr) => {
                        // Add ellipsis if there's a gap
                        const prevPageNum = arr[idx - 1];
                        const showEllipsis =
                          prevPageNum && pageNum - prevPageNum > 1;

                        return (
                          <div
                            key={pageNum}
                            className="flex items-center gap-2"
                          >
                            {showEllipsis && (
                              <span className="text-gray-900">...</span>
                            )}
                            <Button
                              variant={
                                pageNum === pagination.currentPage
                                  ? "primary"
                                  : "outline"
                              }
                              className={`w-10 h-10 p-0 ${pageNum === pagination.currentPage ? "bg-[#D92D20] text-white hover:bg-[#b91c1c]" : ""}`}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          </div>
                        );
                      })}

                    {/* Next Button */}
                    <Button
                      variant="outline"
                      className="w-10 h-10 p-0"
                      disabled={!pagination.hasNext}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      &gt;
                    </Button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}

// Main Page Component wrapped in Suspense
export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
        </div>
      }
    >
      <ProductCatalogContent />
    </Suspense>
  );
}
