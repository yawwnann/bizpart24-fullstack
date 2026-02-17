import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { getProductById, products } from "@/mock/data"
import { Button } from "@/components/ui/Button"
import { Star, ShoppingCart, Heart, Truck, ShieldCheck, RefreshCw } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params
  const product = getProductById(parseInt(id))

  // Handle "duplicate" products for demo
  const displayProduct = product || getProductById(parseInt(id.toString().substring(0, 1)))

  if (!displayProduct) {
    return notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="text-sm text-gray-500 flex items-center gap-2">
            <Link href="/dashboard" className="hover:text-[#D92D20]">Beranda</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#D92D20]">Katalog</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{displayProduct.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 pb-16">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Image Gallery Section */}
            <div className="space-y-4">
                <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-8 border border-gray-100">
                    <img 
                        src={displayProduct.image} 
                        alt={displayProduct.name} 
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                    />
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`aspect-square rounded-lg border cursor-pointer p-2 flex items-center justify-center ${i === 1 ? 'border-[#D92D20] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                             <img 
                                src={displayProduct.image} 
                                alt="Thumbnail" 
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col">
                <div className="mb-2">
                     <span className="text-xs font-bold text-[#D92D20] bg-red-50 px-2 py-1 rounded full uppercase tracking-wide">
                        {displayProduct.category}
                     </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">{displayProduct.name}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="text-black font-bold ml-1">{displayProduct.rating}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500 text-sm">{displayProduct.reviews} Ulasan</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-green-600 text-sm font-medium">Stok Tersedia</span>
                </div>

                <div className="mb-8">
                    {displayProduct.originalPrice && (
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-400 line-through text-sm">Rp {displayProduct.originalPrice.toLocaleString('id-ID')}</span>
                            <span className="bg-red-100 text-[#D92D20] text-xs font-bold px-1.5 py-0.5 rounded">{displayProduct.discount}</span>
                        </div>
                    )}
                    <div className="text-3xl font-extrabold text-[#D92D20]">
                        Rp {displayProduct.price.toLocaleString('id-ID')}
                    </div>
                </div>

                <div className="prose prose-sm text-gray-600 mb-8 border-t border-b border-gray-100 py-6">
                    <p>
                        Produk berkualitas tinggi yang dirancang khusus untuk memenuhi standar spesifikasi kendaraan Anda. 
                        Dibuat dengan material premium untuk daya tahan maksimal dan performa yang optimal.
                        Cocok untuk penggantian rutin atau upgrade performa.
                    </p>
                    <ul className="list-disc pl-4 mt-4 space-y-1">
                        <li>100% Original Genuine Part</li>
                        <li>Garansi Resmi Distributor</li>
                        <li>Pemasangan Presisi (Plug & Play)</li>
                        <li>Tahan Lama dan Awet</li>
                    </ul>
                </div>

                <div className="flex flex-col gap-4 mt-auto">
                    <div className="flex gap-4">
                        <div className="w-32 flex items-center border border-gray-200 rounded-lg">
                            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50">-</button>
                            <input type="text" value="1" className="w-full text-center border-none text-sm font-bold focus:ring-0" readOnly />
                            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50">+</button>
                        </div>
                        <Button className="flex-1 bg-[#D92D20] hover:bg-[#b91c1c] text-white h-12 text-base font-bold shadow-lg shadow-red-200">
                            Masuk Keranjang
                        </Button>
                        <Button variant="outline" className="w-12 h-12 p-0 border-gray-200 hover:border-[#D92D20] hover:text-[#D92D20]">
                            <Heart className="w-5 h-5" />
                        </Button>
                    </div>
                    <Button variant="ghost" className="w-full text-gray-900 font-bold border-2 border-gray-900 hover:bg-gray-900 hover:text-white h-12">
                        Beli Sekarang
                    </Button>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
                    <div className="flex flex-col items-center text-center gap-2">
                        <Truck className="w-6 h-6 text-[#D92D20]" />
                        <span className="text-xs font-medium text-gray-600">Pengiriman Cepat</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-[#D92D20]" />
                        <span className="text-xs font-medium text-gray-600">Jaminan Asli</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                        <RefreshCw className="w-6 h-6 text-[#D92D20]" />
                        <span className="text-xs font-medium text-gray-600">Garansi Retur</span>
                    </div>
                </div>

            </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
