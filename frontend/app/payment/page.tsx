"use client"

import { useState, useRef } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Search, CheckCircle, Loader2, Upload, X, ImageIcon, Receipt, MapPin, Package, PackageCheck } from "lucide-react"
import api from "@/lib/api"

type OrderItem = { name: string; qty: number; price: number; subtotal: number }
type Order = {
  id: string; orderId: string; customerName: string; email: string
  phone: string; address: string; itemsTotal: number; shippingCost: number
  grandTotal: number; status: string; paymentProof: string | null
  trackingNumber: string | null; courierType: string | null; items: OrderItem[]
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  menunggu_pembayaran: { label: "Menunggu Pembayaran",  cls: "bg-amber-50 text-amber-700 border-amber-200" },
  diproses:           { label: "Sedang Diproses",       cls: "bg-blue-50 text-blue-700 border-blue-200"   },
  dikirim:            { label: "Sedang Dikirim",         cls: "bg-violet-50 text-violet-700 border-violet-200" },
  selesai:            { label: "Selesai",                cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  batal:              { label: "Dibatalkan",             cls: "bg-red-50 text-red-700 border-red-200" },
}

export default function PaymentPage() {
  const [orderId, setOrderId]           = useState("")
  const [order, setOrder]               = useState<Order | null>(null)
  const [searching, setSearching]       = useState(false)
  const [searchError, setSearchError]   = useState("")

  const [imageFile, setImageFile]       = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading]       = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError]   = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  // Confirm received state
  const [receiptFile, setReceiptFile]       = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [confirming, setConfirming]         = useState(false)
  const [confirmSuccess, setConfirmSuccess] = useState(false)
  const [confirmError, setConfirmError]     = useState("")
  const receiptFileRef = useRef<HTMLInputElement>(null)

  const handleSearch = async () => {
    if (!orderId.trim()) return
    setSearching(true); setSearchError(""); setOrder(null); setUploadSuccess(false)
    try {
      const res = await api.get(`/orders/${orderId.trim()}`)
      if (res.data.success) setOrder(res.data.data)
      else setSearchError("Pesanan tidak ditemukan. Periksa kembali ID pesanan Anda.")
    } catch {
      setSearchError("Pesanan tidak ditemukan. Periksa kembali ID pesanan Anda.")
    } finally { setSearching(false) }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file); setImagePreview(URL.createObjectURL(file)); setUploadError("")
  }

  const handleUpload = async () => {
    if (!imageFile || !order) return
    setUploading(true); setUploadError("")
    try {
      const formData = new FormData()
      formData.append("image", imageFile)
      formData.append("orderId", order.orderId)
      const res = await api.post("/orders/upload-proof", formData, { headers: { "Content-Type": "multipart/form-data" } })
      if (res.data.success) { setUploadSuccess(true); setOrder(res.data.data) }
    } catch {
      setUploadError("Gagal mengunggah. Silakan coba lagi.")
    } finally { setUploading(false) }
  }

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setReceiptFile(file); setReceiptPreview(URL.createObjectURL(file)); setConfirmError("")
  }

  const handleConfirmReceived = async () => {
    if (!order) return
    setConfirming(true); setConfirmError("")
    try {
      const formData = new FormData()
      formData.append("orderId", order.orderId)
      if (receiptFile) formData.append("image", receiptFile)
      const res = await api.post("/orders/confirm-received", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      if (res.data.success) { setConfirmSuccess(true); setOrder(res.data.data) }
      else setConfirmError("Gagal mengkonfirmasi. Silakan coba lagi.")
    } catch {
      setConfirmError("Gagal mengkonfirmasi. Silakan coba lagi.")
    } finally { setConfirming(false) }
  }

  const alreadyPaid = order?.paymentProof || uploadSuccess
  const status = order ? (STATUS_MAP[order.status] ?? { label: order.status, cls: "bg-gray-50 text-gray-600 border-gray-200" }) : null

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 md:px-8 py-14">
        <div className="max-w-xl mx-auto">

          {/* Page title */}
          <div className="text-center mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Konfirmasi Pembayaran</h1>
            <p className="text-gray-400 text-sm mt-2">Masukkan ID Pesanan Anda untuk melanjutkan pembayaran</p>
          </div>

          {/* Search box */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5 shadow-sm">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">ID Pesanan</label>
            <div className="flex gap-2.5">
              <input
                type="text"
                placeholder="Contoh: INV-2026-0001"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
              <button
                onClick={handleSearch}
                disabled={searching || !orderId.trim()}
                className="px-5 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
              >
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Cari
              </button>
            </div>
            {searchError && <p className="mt-3 text-sm text-red-500 flex items-center gap-1.5">⚠ {searchError}</p>}
          </div>

          {/* Order result */}
          {order && (
            <div className="space-y-4">

              {/* Header card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 flex items-start justify-between border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">ID Pesanan</p>
                    <p className="text-lg font-bold text-gray-900">#{order.orderId}</p>
                    <p className="text-sm text-gray-500 mt-0.5">a.n. <span className="font-medium text-gray-700">{order.customerName}</span></p>
                  </div>
                  {status && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.cls}`}>
                      {status.label}
                    </span>
                  )}
                </div>

                {/* Items */}
                <div className="px-6 pt-4 pb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" /> Item Pesanan
                  </p>
                  <div className="space-y-2.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-sm">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.qty} pcs × Rp {item.price.toLocaleString("id-ID")}</p>
                        </div>
                        <p className="font-semibold text-gray-900 shrink-0 ml-4">Rp {item.subtotal.toLocaleString("id-ID")}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="mx-6 my-4 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3.5 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal Produk</span>
                    <span>Rp {order.itemsTotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Ongkos Kirim</span>
                    <span>
                      {order.shippingCost > 0
                        ? `Rp ${order.shippingCost.toLocaleString("id-ID")}`
                        : <span className="text-amber-500 italic text-xs">Menunggu konfirmasi</span>}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200 text-base">
                    <span>Total Bayar</span>
                    <span className="text-[#D92D20]">Rp {order.grandTotal.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="px-6 pb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Alamat Pengiriman
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">{order.address}</p>
                </div>
              </div>

              {/* Info Pengiriman - tampil saat status dikirim */}
              {order.courierType && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Informasi Pengiriman</p>
                    <p className="text-xs text-gray-400 mt-0.5">Paket Anda sedang dalam perjalanan</p>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Ekspedisi</span>
                      <span className="font-semibold text-gray-900">{order.courierType}</span>
                    </div>
                    {order.trackingNumber ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Nomor Resi</span>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-center">
                          <p className="font-bold text-gray-900 text-xl tracking-widest">{order.trackingNumber}</p>
                        </div>
                        <p className="text-xs text-gray-400 text-center">Gunakan nomor resi di atas untuk melacak paket di website {order.courierType}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Paket diantarkan langsung oleh tim kami — tidak ada nomor resi.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Konfirmasi Penerimaan - tampil saat status dikirim */}
              {order.status === 'dikirim' && !confirmSuccess && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Sudah Terima Barang?</p>
                    <p className="text-xs text-gray-400 mt-0.5">Konfirmasi jika paket sudah tiba di tangan Anda</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Optional photo */}
                    <div
                      onClick={() => receiptFileRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-colors flex flex-col items-center justify-center text-center overflow-hidden
                        ${receiptPreview ? "border-gray-200 p-0" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 p-8"}`}
                    >
                      {receiptPreview ? (
                        <>
                          <img src={receiptPreview} alt="Preview" className="w-full max-h-48 object-contain bg-gray-50" />
                          <button
                            onClick={(e) => { e.stopPropagation(); setReceiptFile(null); setReceiptPreview(null) }}
                            className="absolute top-2 right-2 bg-white shadow rounded-full p-1 text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-7 h-7 text-gray-300 mb-2" />
                          <p className="text-sm text-gray-400">Lampirkan foto barang <span className="text-gray-300">(opsional)</span></p>
                        </>
                      )}
                    </div>
                    <input ref={receiptFileRef} type="file" accept="image/*" className="hidden" onChange={handleReceiptFileChange} />

                    {confirmError && <p className="text-sm text-red-500">{confirmError}</p>}

                    <button
                      onClick={handleConfirmReceived}
                      disabled={confirming}
                      className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {confirming
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
                        : <><PackageCheck className="w-4 h-4" /> Barang Sudah Diterima</>
                      }
                    </button>
                  </div>
                </div>
              )}

              {/* Selesai */}
              {(order.status === 'selesai' || confirmSuccess) && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">Pesanan Selesai</p>
                      <p className="text-xs text-emerald-700 mt-0.5">Terima kasih telah berbelanja di BIZSPAREPART24!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload section */}
              {alreadyPaid ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Bukti Pembayaran Terkirim</p>
                      <p className="text-xs text-gray-400 mt-0.5">Admin akan memverifikasi pembayaran Anda dalam waktu dekat.</p>
                    </div>
                  </div>
                </div>
              ) : order.shippingCost === 0 ? (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-sm">
                  <p className="font-semibold text-amber-800 mb-1">⏳ Ongkos kirim belum dikonfirmasi</p>
                  <p className="text-amber-700">Admin sedang menghitung ongkos kirim. Anda akan mendapat email tagihan final setelah selesai.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Upload Bukti Transfer</p>
                    <p className="text-xs text-gray-400 mt-0.5">Unggah screenshot / foto bukti transfer Anda</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Drop area */}
                    <div
                      onClick={() => fileRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-colors flex flex-col items-center justify-center text-center overflow-hidden
                        ${imagePreview ? "border-gray-200 p-0" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 p-10"}`}
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain bg-gray-50" />
                          <button
                            onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null) }}
                            className="absolute top-2 right-2 bg-white shadow rounded-full p-1 text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-gray-300 mb-3" />
                          <p className="text-sm font-medium text-gray-500">Klik untuk memilih foto</p>
                          <p className="text-xs text-gray-300 mt-1">JPG, PNG, WebP</p>
                        </>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                    {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

                    <button
                      onClick={handleUpload}
                      disabled={!imageFile || uploading}
                      className="w-full h-11 bg-gray-900 hover:bg-gray-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {uploading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengunggah...</>
                        : <><Upload className="w-4 h-4" /> Kirim Bukti Pembayaran</>}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
