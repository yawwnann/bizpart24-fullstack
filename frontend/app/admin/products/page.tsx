"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react"
import api from "@/lib/api"
import Link from "next/link"
import { Input } from "@/components/ui/Input"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (!search) {
        setFilteredProducts(products)
    } else {
        const lowerSearch = search.toLowerCase()
        setFilteredProducts(products.filter((p: any) => 
            p.name.toLowerCase().includes(lowerSearch) ||
            p.category.toLowerCase().includes(lowerSearch)
        ))
    }
  }, [search, products])

 const formatRupiah = (value: number | string) => {
  if (!value) return "Rp 0"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(Number(value))
}

  const fetchProducts = async () => {
    try {
        const response = await api.get('/products')
        if (response.data.success) {
            setProducts(response.data.data)
            setFilteredProducts(response.data.data)
        }
    } catch (error) {
        console.error("Failed to fetch products", error)
    } finally {
        setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
      if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return

      try {
        const token = localStorage.getItem("adminToken")
        const config = { headers: { Authorization: `Bearer ${token}` } }
        await api.delete(`/admin/products/${id}`, config)
        setProducts(products.filter(p => p._id !== id))
      } catch (error) {
          console.error("Failed to delete product", error)
          alert("Gagal menghapus produk")
      }
  }

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Produk</h1>
                <p className="text-gray-500">Kelola katalog produk Anda.</p>
            </div>
            
            <div className="flex gap-4">
                 <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Cari produk..." 
                        className="pl-9 bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#D92D20] placeholder:text-gray-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button asChild className="bg-gray-900 text-white">
                    <Link href="/admin/products/new">
                        <Plus className="w-4 h-4 mr-2" /> Tambah Produk
                    </Link>
                </Button>
            </div>
        </div>

        <Card className="bg-white border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Gambar</th>
                            <th className="px-6 py-4">Nama</th>
                            <th className="px-6 py-4">Kategori</th>
                            <th className="px-6 py-4">Harga</th>
                            <th className="px-6 py-4">Stok</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50 text-gray-900">
                                <td className="px-6 py-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{formatRupiah(product.price)}</td>
                                <td className="px-6 py-4">{product.stock}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/admin/products/${product._id}`}>
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(product._id)}>
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Tidak ada produk ditemukan.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
  )
}
