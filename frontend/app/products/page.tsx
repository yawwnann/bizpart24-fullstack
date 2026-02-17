"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ProductCard } from "@/components/ui/ProductCard"
import { Card } from "@/components/ui/Card"
import { Filter, ChevronDown, Loader2, Settings } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import api from "@/lib/api"
import { useFetchCategories } from "@/hooks/useFetchCategories"

// Create a wrapper component for the content that uses useSearchParams
function ProductCatalogContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const searchParam = searchParams.get("search")

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { categories } = useFetchCategories()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params: any = {}
        if (categoryParam) params.category = categoryParam
        if (searchParam) params.search = searchParam

        const response = await api.get('/products', { params })
        
        if (response.data.success) {
          const mappedProducts = response.data.data.map((item: any) => ({
            ...item,
            id: item._id, // Map _id to id
            rating: item.rating || 4.5,
            reviews: item.reviews || 0,
            originalPrice: null,
            discount: null,
            isNew: false
          }))
          setProducts(mappedProducts)
        }
      } catch (err) {
        console.error("Failed to fetch products", err)
        setError("Gagal memuat produk.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoryParam, searchParam])

  // Dynamic Title
  const title = categoryParam
    ? `Kategori: ${categories.find(c => c.name.toLowerCase() === categoryParam.toLowerCase())?.name || categoryParam}`
    : "Katalog Suku Cadang"

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {categoryParam 
                            ? `Menampilkan ${products.length} produk untuk kategori "${categoryParam}"`
                            : "Jelajahi semua kategori dan produk berkualitas untuk kendaraan Anda."}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                     <span className="text-sm text-gray-500">Urutkan:</span>
                     <Button variant="outline" className="h-9 text-sm gap-2">
                        Paling Sesuai <ChevronDown className="w-4 h-4" />
                     </Button>
                </div>
            </div>

            {/* Category Quick Links (Visible when no category selected) */}
            {!categoryParam && (
                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat) => (
                        <Link key={cat._id} href={`/products?category=${cat.name.toLowerCase()}`} className="group">
                            <Card className="h-full border border-gray-100 hover:border-[#D92D20] hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center p-4 text-center bg-white rounded-xl">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-red-50 transition-colors">
                                    <Settings className="w-5 h-5 text-gray-700 group-hover:text-[#D92D20] transition-colors" />
                                </div>
                                <span className="text-xs font-bold text-gray-700 group-hover:text-black uppercase">{cat.name}</span>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 flex-1">
        <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 shrink-0 space-y-8">
                <div>
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filter Kategori
                    </h3>
                    <div className="space-y-2">
                        <Link href="/products" className={`block text-sm ${!categoryParam ? 'font-bold text-[#D92D20]' : 'text-gray-600 hover:text-[#D92D20]'}`}>
                            Semua Kategori
                        </Link>
                        {categories.map((cat) => (
                            <Link 
                                key={cat._id} 
                                href={`/products?category=${cat.name.toLowerCase()}`}
                                className={`block text-sm ${categoryParam && cat.name.toLowerCase() === categoryParam.toLowerCase() ? 'font-bold text-[#D92D20]' : 'text-gray-600 hover:text-[#D92D20]'} transition-all`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>

                 <div>
                    <h3 className="font-bold text-gray-900 mb-4">Rentang Harga</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <input type="number" placeholder="Min" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#D92D20]" />
                            <input type="number" placeholder="Max" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#D92D20]" />
                        </div>
                        <Button className="w-full bg-gray-900 hover:bg-[#D92D20] text-white h-9 text-sm">Terapkan</Button>
                    </div>
                </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">
                        <p>{error}</p>
                        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                            Coba Lagi
                        </Button>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="h-full">
                                <Link href={`/products/${product.id}`} className="block h-full"> 
                                    <ProductCard product={product} />
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">Tidak ada produk ditemukan untuk kategori ini.</p>
                        <Button variant="outline" className="mt-4" asChild>
                            <Link href="/products">Lihat Semua Produk</Link>
                        </Button>
                    </div>
                )}
                
                {/* Pagination */}
                <div className="mt-12 flex justify-center">
                    <nav className="flex items-center gap-2">
                         <Button variant="outline" className="w-10 h-10 p-0" disabled>&lt;</Button>
                         <Button className="w-10 h-10 p-0 bg-[#D92D20] text-white hover:bg-[#b91c1c]">1</Button>
                         <Button variant="outline" className="w-10 h-10 p-0">2</Button>
                         <Button variant="outline" className="w-10 h-10 p-0">3</Button>
                         <Button variant="outline" className="w-10 h-10 p-0">&gt;</Button>
                    </nav>
                </div>
            </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}

// Main Page Component wrapped in Suspense
export default function CatalogPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
    }>
      <ProductCatalogContent />
    </Suspense>
  )
}
