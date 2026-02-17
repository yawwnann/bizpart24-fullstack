"use client"

import { useCart } from "@/context/CartContext"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
// import { Label } from "@/components/ui/Label" // Assuming we have Label or just use standard label
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart')
    }
  }, [cartItems, router])

  if (cartItems.length === 0) {
     return null
  }

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        name: formData.name, // Backend maps this to customerName
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        items: cartItems.map(item => ({
          productId: item.id,
          qty: item.quantity
        }))
      }

      const response = await import("@/lib/api").then(mod => mod.default.post('/orders/create', payload))

      if (response.data.success) {
        clearCart()
        router.push("/checkout/success")
      }
    } catch (err: any) {
      console.error("Order failed", err)
      setError(err.response?.data?.message || "Gagal membuat pesanan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 py-12">
        <Link href="/cart" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Keranjang
        </Link>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout Pesanan</h1>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
            
            {/* Customer Details Form */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#D92D20] text-white flex items-center justify-center text-xs">1</span>
                    Informasi Pengiriman
                </h2>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <label htmlFor="name" className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                             <Input 
                                id="name" 
                                name="name" 
                                required 
                                placeholder="Nama penerima" 
                                value={formData.name}
                                onChange={handleChange}
                                className="bg-gray-50 border-gray-200 text-gray-900"
                             />
                        </div>
                        <div className="space-y-2">
                             <label htmlFor="phone" className="text-sm font-medium text-gray-700">Nomor Telepon (WhatsApp)</label>
                             <Input 
                                id="phone" 
                                name="phone" 
                                required 
                                placeholder="08xxxxxxxxxx" 
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="bg-gray-50 border-gray-200 text-gray-900"
                             />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email (Opsional)</label>
                        <Input 
                            id="email" 
                            name="email" 
                            type="email"
                            placeholder="email@example.com" 
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-gray-50 border-gray-200 text-gray-900"
                        />
                    </div>

                    <div className="space-y-2">
                         <label htmlFor="address" className="text-sm font-medium text-gray-700">Alamat Lengkap</label>
                         <textarea 
                            id="address" 
                            name="address" 
                            required 
                            placeholder="Alamat lengkap, nama jalan, nomor rumah, detail lainnya..."
                            className="w-full min-h-[120px] px-3 bg-gray-50 border-gray-200 text-gray-900 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                            value={formData.address}
                            // @ts-ignore - native textarea change event compatible
                            onChange={handleChange}
                        
                        />
                    </div>
                </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96 shrink-0 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#D92D20] text-white flex items-center justify-center text-xs">2</span>
                        Ringkasan Pesanan
                    </h2>
                    
                    <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                        {cartItems.map((item) => (
                             <div key={item.id} className="flex gap-3 text-sm">
                                <div className="w-12 h-12 bg-gray-100 rounded shrink-0 overflow-hidden">
                                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                    <p className="text-gray-500">{item.quantity} x Rp {item.price.toLocaleString("id-ID")}</p>
                                </div>
                                <div className="font-bold text-gray-900">
                                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                                </div>
                             </div>
                        ))}
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                         <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal Produk</span>
                            <span className="font-medium">Rp {totalPrice.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Ongkos Kirim</span>
                            <span className="font-medium text-green-600">Gratis (Promo)</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-dashed border-gray-200">
                            <span className="font-bold text-lg text-gray-900">Total Tagihan</span>
                            <span className="font-bold text-lg text-[#D92D20]">Rp {totalPrice.toLocaleString("id-ID")}</span>
                        </div>
                    </div>
                </div>

                <Button 
                    type="submit" 
                    className="w-full bg-[#D92D20] hover:bg-[#b91c1c] h-12 text-md font-bold shadow-lg shadow-red-100 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? "Memproses..." : "Buat Pesanan Sekarang"}
                </Button>
                {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
                
                <p className="text-xs text-center text-gray-400">
                    Dengan membuat pesanan, Anda menyetujui Syarat & Ketentuan kami.
                </p>
            </div>

        </form>
      </div>

      <Footer />
    </main>
  )
}
