"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { CheckCircle, CreditCard, Home, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 py-20">
         <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h1>
            <p className="text-gray-500 mb-8">
                Terima kasih telah berbelanja di BIZSPAREPART24. Kami akan segera memproses pesanan Anda dan menghubungi via WhatsApp.
            </p>

            <div className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                    <Link href="/payment">
                        <CreditCard className="w-4 h-4 mr-2" /> Konfirmasi Pembayaran
                    </Link>
                </Button>
                <Button className="w-full bg-[#D92D20] hover:bg-[#b91c1c]" asChild>
                    <Link href="/products">
                        <ShoppingBag className="w-4 h-4 mr-2" /> Belanja Lagi
                    </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard">
                        <Home className="w-4 h-4 mr-2" /> Kembali ke Beranda
                    </Link>
                </Button>
            </div>
         </div>
      </div>

      <Footer />
    </main>
  )
}
