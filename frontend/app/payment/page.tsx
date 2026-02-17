"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { Loader2, Search, Upload, CheckCircle, AlertCircle } from "lucide-react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

export default function PaymentPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [orderId, setOrderId] = useState("")
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Step 1: Find Order
  const handleCheckOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId.trim()) return

    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/orders/${orderId}`)
      if (response.data.success) {
        setOrder(response.data.data)
        setStep(2)
      }
    } catch (err: any) {
      console.error("Order not found", err)
      setError("Pesanan tidak ditemukan. Mohon cek kembali ID Pesanan Anda.")
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  // Step 2: Upload Proof
  const handleUpload = async () => {
    if (!file || !order) return

    setLoading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append("orderId", order.orderId)
    formData.append("image", file)

    try {
      // We need to use native fetch or specific axios config for multipart/form-data if the interceptor interferes, 
      // but usually axios handles FormData automatically by removing Content-Type header to let browser set boundary.
      const response = await api.post('/orders/upload-proof', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setUploadProgress(percentCompleted)
        }
      })

      if (response.data.success) {
        setStep(3) // Success
      }
    } catch (err: any) {
      console.error("Upload failed", err)
      setError("Gagal mengupload bukti pembayaran. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Konfirmasi Pembayaran</h1>
                <p className="text-gray-500">Lacak pesanan dan upload bukti pembayaran Anda di sini.</p>
            </div>

            {/* Step 1: Input Order ID */}
            {step === 1 && (
                <Card className="p-8 bg-white border-gray-100 shadow-sm">
                    <form onSubmit={handleCheckOrder} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="orderId" className="text-sm font-medium text-gray-700">Masukkan ID Pesanan</label>
                            <Input 
                                id="orderId" 
                                placeholder="Contoh: INV-2024-0001" 
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                className="h-12 text-lg uppercase tracking-wider bg-gray-50 border-gray-200 text-gray-900 rounded-full focus:bg-white focus:ring-1 focus:ring-gray-200 focus:border-transparent transition-all placeholder:text-gray-400"
                                autoFocus
                            />
                            <p className="text-xs text-gray-400">ID Pesanan dapat ditemukan di pesan WhatsApp atau email konfirmasi.</p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> {error}
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full h-12 bg-[#D92D20] hover:bg-[#b91c1c] text-white font-bold"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Cek Pesanan"}
                        </Button>
                    </form>
                </Card>
            )}

            {/* Step 2: Payment Details & Upload */}
            {step === 2 && order && (
                <div className="space-y-6">
                    {/* Order Details */}
                    <Card className="p-6 bg-white border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">ID: {order.orderId}</h3>
                                <p className="text-sm text-gray-500">{order.customerName}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total Tagihan</p>
                                <p className="font-bold text-xl text-[#D92D20]">Rp {order.grandTotal.toLocaleString("id-ID")}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Item Pesanan:</h4>
                            <ul className="space-y-2">
                                {order.items.map((item: any) => (
                                    <li key={item._id} className="text-sm flex justify-between text-gray-600">
                                        <span>{item.qty}x {item.name}</span>
                                        <span>Rp {(item.price * item.qty).toLocaleString("id-ID")}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>

                    {/* QRIS Section */}
                    <Card className="p-6 bg-white border-gray-100 shadow-sm text-center">
                        <h3 className="font-bold text-lg text-gray-900 mb-4">Scan QRIS untuk Membayar</h3>
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 inline-block mb-4">
                           {/* Placeholder QRIS Image */}
                           <div className="w-64 h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                                <img 
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" 
                                    alt="QRIS Code" 
                                    className="w-full h-full object-contain opacity-80"
                                />
                           </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">Menerima pembayaran dari semua e-wallet dan mobile banking.</p>
                        <p className="text-xs text-gray-400">Halaman ini otomatis, silakan upload bukti transfer di bawah.</p>
                    </Card>

                    {/* Upload Section */}
                    <Card className="p-6 bg-white border-gray-100 shadow-sm">
                        <h3 className="font-bold text-lg text-gray-900 mb-4">Upload Bukti Pembayaran</h3>
                        
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 font-medium">
                                    {file ? file.name : "Klik untuk pilih gambar bukti transfer"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">Format: JPG, PNG, max 5MB</p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => setStep(1)}
                                    disabled={loading}
                                >
                                    Kembali
                                </Button>
                                <Button 
                                    className="flex-1 bg-[#D92D20] hover:bg-[#b91c1c] text-white"
                                    onClick={handleUpload}
                                    disabled={!file || loading}
                                >
                                    {loading ? (uploadProgress > 0 ? `Uploading ${uploadProgress}%` : "Memproses...") : "Kirim Bukti Pembayaran"}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
                <Card className="p-12 bg-white border-gray-100 shadow-sm text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Bukti Pembayaran Terkirim!</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Terima kasih! Admin kami akan memverifikasi pembayaran Anda secepatnya. Status pesanan akan diupdate via WhatsApp/Email.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={() => router.push('/')}>
                            Kembali ke Beranda
                        </Button>
                        <Button className="bg-gray-900 text-white hover:bg-black" onClick={() => window.location.reload()}>
                            Cek Pesanan Lain
                        </Button>
                    </div>
                </Card>
            )}

        </div>
      </div>

      <Footer />
    </main>
  )
}
