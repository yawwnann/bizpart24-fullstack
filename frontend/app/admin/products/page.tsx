"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Edit,
  Loader2,
  Plus,
  Search,
  Trash2,
  Package,
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { useFetchCategories } from "@/hooks/useFetchCategories";

const PAGE_SIZE = 30;

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

type StockFilter = "all" | "low" | "out";
type SortOption =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc"
  | "stock_asc"
  | "stock_desc";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Terbaru",
  oldest: "Terlama",
  price_asc: "Harga Terendah",
  price_desc: "Harga Tertinggi",
  name_asc: "Nama (A-Z)",
  name_desc: "Nama (Z-A)",
  stock_asc: "Stok Terendah",
  stock_desc: "Stok Tertinggi",
};

export default function AdminProductsPage() {
  const { categories } = useFetchCategories();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const activeFilterCount = [
    categoryFilter !== "",
    stockFilter !== "all",
    sort !== "newest",
  ].filter(Boolean).length;

  // Debounce search input
  const handleSearchInput = (val: string) => {
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(val);
    }, 350);
  };

  // Whenever filters change, reset to page 1
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
  }, [search, categoryFilter, stockFilter, sort]);

  // Fetch products
  useEffect(() => {
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, categoryFilter, stockFilter, sort]);

  const lastRowRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loadingMore, hasMore],
  );

  const buildStockParams = () => {
    if (stockFilter === "out") return { maxStock: 0 };
    if (stockFilter === "low") return { minStock: 1, maxStock: 5 };
    return {};
  };

  const fetchProducts = async (pageNum: number) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const params: Record<string, string | number> = {
        page: pageNum,
        limit: PAGE_SIZE,
        sort,
        ...(search ? { search } : {}),
        ...(categoryFilter ? { category: categoryFilter } : {}),
        ...buildStockParams(),
      };

      const res = await api.get<{
        success: boolean;
        data: Product[];
        pagination: { total: number; hasNext: boolean };
      }>("/products", { params });

      if (res.data.success) {
        const newData = res.data.data;
        setTotalCount(res.data.pagination?.total || 0);
        setHasMore(res.data.pagination?.hasNext ?? false);
        if (pageNum === 1) {
          setProducts(newData);
        } else {
          setProducts((prev) => [...prev, ...newData]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await api.delete(`/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setTotalCount((prev) => prev - 1);
    } catch {
      alert("Gagal menghapus produk");
    }
  };

  const clearFilters = () => {
    setCategoryFilter("");
    setStockFilter("all");
    setSort("newest");
    setSearch("");
    setSearchInput("");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Produk</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading
              ? "Memuat..."
              : `${products.length}${totalCount > products.length ? ` dari ${totalCount}` : ""} produk`}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Tambah Produk
        </Link>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari nama produk atau kategori..."
            className="pl-9 bg-white border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-gray-300 h-10"
            value={searchInput}
            onChange={(e) => handleSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                setSearch("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category dropdown */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-medium cursor-pointer focus:outline-none focus:border-gray-300 appearance-none"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>

        {/* Filter toggle button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`h-10 px-3.5 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${
            showFilters || activeFilterCount > 0
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
          {activeFilterCount > 0 && (
            <span className="bg-white text-gray-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-wrap gap-4 items-end">
          {/* Stock Status */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Status Stok
            </span>
            <div className="flex gap-1.5">
              {(["all", "low", "out"] as StockFilter[]).map((s) => {
                const labels = {
                  all: "Semua",
                  low: "Stok Rendah (1-5)",
                  out: "Habis",
                };
                const colors = {
                  all:
                    stockFilter === "all"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                  low:
                    stockFilter === "low"
                      ? "bg-amber-500 text-white"
                      : "bg-amber-50 text-amber-700 hover:bg-amber-100",
                  out:
                    stockFilter === "out"
                      ? "bg-red-600 text-white"
                      : "bg-red-50 text-red-600 hover:bg-red-100",
                };
                return (
                  <button
                    key={s}
                    onClick={() => setStockFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${colors[s]}`}
                  >
                    {labels[s]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Urutkan
            </span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-medium cursor-pointer focus:outline-none focus:border-gray-300 appearance-none"
              >
                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(
                  ([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ),
                )}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Clear button */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="h-9 px-3 rounded-lg border border-dashed border-gray-300 text-xs text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors flex items-center gap-1.5 self-end"
            >
              <X className="w-3 h-3" /> Reset filter
            </button>
          )}
        </div>
      )}

      {/* Active filter chips */}
      {(categoryFilter ||
        stockFilter !== "all" ||
        sort !== "newest" ||
        search) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400">Filter aktif:</span>
          {search && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
              "{search}"
              <button
                onClick={() => {
                  setSearch("");
                  setSearchInput("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {categoryFilter && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-xs font-medium text-blue-700">
              {categoryFilter}
              <button
                onClick={() => setCategoryFilter("")}
                className="text-blue-400 hover:text-blue-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {stockFilter !== "all" && (
            <span
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${stockFilter === "out" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}
            >
              {stockFilter === "out" ? "Habis" : "Stok Rendah"}
              <button
                onClick={() => setStockFilter("all")}
                className="opacity-60 hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {sort !== "newest" && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-50 text-xs font-medium text-violet-700">
              {SORT_LABELS[sort]}
              <button
                onClick={() => setSort("newest")}
                className="text-violet-400 hover:text-violet-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Produk
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Kategori
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Harga
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Stok
                </th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-300 mx-auto" />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
                    <Package className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">
                      Tidak ada produk ditemukan.
                    </p>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="mt-2 text-xs text-[#D92D20] hover:underline"
                      >
                        Reset semua filter
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                products.map((product, idx) => (
                  <tr
                    key={product.id}
                    ref={idx === products.length - 1 ? lastRowRef : null}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          <img
                            src={product.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="font-medium text-gray-900 line-clamp-1 max-w-60">
                          {product.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-900">
                      Rp {Number(product.price).toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          product.stock === 0
                            ? "bg-red-50 text-red-600"
                            : product.stock <= 5
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {product.stock === 0 ? "Habis" : `${product.stock} pcs`}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {loadingMore && (
          <div className="flex items-center justify-center py-4 gap-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Memuat lebih banyak...</span>
          </div>
        )}
        {!hasMore && products.length > 0 && (
          <p className="text-center text-xs text-gray-300 py-3">
            Semua {products.length} produk telah dimuat
          </p>
        )}
      </div>
    </div>
  );
}
