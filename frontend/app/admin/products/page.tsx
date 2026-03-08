"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Edit, Loader2, Plus, Search, Trash2, Package } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import { Input } from "@/components/ui/Input";

const PAGE_SIZE = 30;

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastRowRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !search) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loadingMore, hasMore, search],
  );

  // Initial fetch
  useEffect(() => {
    fetchProducts(1);
  }, []);

  // Load more on page change
  useEffect(() => {
    if (page > 1) fetchProducts(page);
  }, [page]);

  // Search filter (client-side on loaded data)
  useEffect(() => {
    if (!search) return setFilteredProducts(products);
    const q = search.toLowerCase();
    setFilteredProducts(
      products.filter(
        (p: Product) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q),
      ),
    );
  }, [search, products]);

  const fetchProducts = async (pageNum: number) => {
    try {
      if (pageNum > 1) setLoadingMore(true);
      const res = await api.get<{
        success: boolean;
        data: Product[];
        pagination: { total: number; hasNext: boolean };
      }>("/products", {
        params: { page: pageNum, limit: PAGE_SIZE },
      });
      if (res.data.success) {
        const newData = res.data.data;
        setTotalCount(res.data.pagination?.total || 0);
        setHasMore(res.data.pagination?.hasNext ?? false);
        if (pageNum === 1) {
          setProducts(newData);
          setFilteredProducts(newData);
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
      setProducts((prev: Product[]) =>
        prev.filter((p: Product) => p.id !== id),
      );
    } catch {
      alert("Gagal menghapus produk");
    }
  };

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-gray-300" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Produk</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {totalCount > 0
              ? `${products.length} dari ${totalCount}`
              : products.length}{" "}
            produk tersedia
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full md:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari produk..."
              className="pl-9 bg-gray-50 border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-gray-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Tambah Produk
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
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
              {filteredProducts.map((product: Product, idx: number) => (
                <tr
                  key={product.id}
                  ref={idx === filteredProducts.length - 1 ? lastRowRef : null}
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
                      <p className="font-medium text-gray-900 line-clamp-1">
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
                      className={`px-2 py-0.5 rounded text-xs font-medium ${product.stock > 5 ? "bg-emerald-50 text-emerald-700" : product.stock > 0 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"}`}
                    >
                      {product.stock}
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
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
                    <Package className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">
                      Tidak ada produk ditemukan.
                    </p>
                  </td>
                </tr>
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
        {!hasMore && products.length > 0 && !search && (
          <p className="text-center text-xs text-gray-300 py-3">
            Semua produk telah dimuat
          </p>
        )}
      </div>
    </div>
  );
}
