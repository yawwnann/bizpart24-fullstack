"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Search,
  CheckCircle,
  Loader2,
  Upload,
  X,
  ImageIcon,
  Receipt,
  MapPin,
  Package,
  PackageCheck,
  Clock,
  Truck,
  CreditCard,
  BadgeCheck,
} from "lucide-react";
import api from "@/lib/api";
import { generateInvoicePDF } from "@/lib/generateInvoice";

type OrderItem = { name: string; qty: number; price: number; subtotal: number };
type Order = {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  itemsTotal: number;
  shippingCost: number;
  grandTotal: number;
  status: string;
  paymentProof: string | null;
  trackingNumber: string | null;
  courierType: string | null;
  items: OrderItem[];
  createdAt?: string;
};

const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME ?? "BCA";
const BANK_NUMBER = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? "1234567890";
const BANK_HOLDER = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? "PT BIZPART24";

const STATUS_MAP: Record<
  string,
  { label: string; dot: string; badge: string }
> = {
  menunggu_ongkir: {
    label: "Menunggu Konfirmasi Ongkir",
    dot: "bg-gray-400",
    badge: "bg-gray-100 text-gray-600 border-gray-200",
  },
  menunggu_pembayaran: {
    label: "Menunggu Pembayaran",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  diproses: {
    label: "Sedang Diproses",
    dot: "bg-blue-400",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  dikirim: {
    label: "Sedang Dikirim",
    dot: "bg-violet-400",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
  },
  selesai: {
    label: "Selesai",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  batal: {
    label: "Dibatalkan",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState("");

  // Payment proof
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const proofRef = useRef<HTMLInputElement>(null);

  // Receipt confirmation
  const [rcptFile, setRcptFile] = useState<File | null>(null);
  const [rcptPreview, setRcptPreview] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmDone, setConfirmDone] = useState(false);
  const [confirmErr, setConfirmErr] = useState("");
  const rcptRef = useRef<HTMLInputElement>(null);

  const [downloading, setDownloading] = useState(false);

  /* ─── Auto-search from URL param ─────────────────── */
  useEffect(() => {
    const paramId = searchParams.get("orderId");
    if (paramId) {
      setOrderId(paramId);
      // trigger search after state is set
      (async () => {
        setSearching(true);
        setSearchErr("");
        setOrder(null);
        setUploadDone(false);
        try {
          const res = await api.get(`/orders/${paramId.trim()}`);
          if (res.data.success) setOrder(res.data.data);
          else setSearchErr("Pesanan tidak ditemukan. Periksa kembali ID pesanan Anda.");
        } catch {
          setSearchErr("Pesanan tidak ditemukan. Periksa kembali ID pesanan Anda.");
        } finally {
          setSearching(false);
        }
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Handlers ─────────────────────────────────── */
  const handleSearch = async () => {
    if (!orderId.trim()) return;
    setSearching(true);
    setSearchErr("");
    setOrder(null);
    setUploadDone(false);
    try {
      const res = await api.get(`/orders/${orderId.trim()}`);
      if (res.data.success) setOrder(res.data.data);
      else
        setSearchErr(
          "Pesanan tidak ditemukan. Periksa kembali ID pesanan Anda.",
        );
    } catch {
      setSearchErr("Pesanan tidak ditemukan. Periksa kembali ID pesanan Anda.");
    } finally {
      setSearching(false);
    }
  };

  const handleUpload = async () => {
    if (!proofFile || !order) return;
    setUploading(true);
    setUploadErr("");
    try {
      const fd = new FormData();
      fd.append("image", proofFile);
      fd.append("orderId", order.orderId);
      const res = await api.post("/orders/upload-proof", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setUploadDone(true);
        setOrder(res.data.data);
      }
    } catch {
      setUploadErr("Gagal mengunggah. Silakan coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = async () => {
    if (!order) return;
    setConfirming(true);
    setConfirmErr("");
    try {
      const fd = new FormData();
      fd.append("orderId", order.orderId);
      if (rcptFile) fd.append("image", rcptFile);
      const res = await api.post("/orders/confirm-received", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setConfirmDone(true);
        setOrder(res.data.data);
      } else setConfirmErr("Gagal mengkonfirmasi. Silakan coba lagi.");
    } catch {
      setConfirmErr("Gagal mengkonfirmasi. Silakan coba lagi.");
    } finally {
      setConfirming(false);
    }
  };

  const alreadyPaid = !!(order?.paymentProof || uploadDone);
  const st = order
    ? (STATUS_MAP[order.status] ?? STATUS_MAP.menunggu_ongkir)
    : null;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 md:px-8 py-14">
        <div className="max-w-lg mx-auto">
          {/* ── Page header ── */}
          <div className="text-center mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Status Pesanan</h1>
            <p className="text-gray-400 text-sm mt-1.5">
              Masukkan ID pesanan untuk melihat status dan melakukan pembayaran
            </p>
          </div>

          {/* ── Search box ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5 shadow-sm">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">
              ID Pesanan
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: INV-2026-0001"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
              <button
                onClick={handleSearch}
                disabled={searching || !orderId.trim()}
                className="px-5 bg-gray-900 hover:bg-gray-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-40 transition-colors"
              >
                {searching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Cari
              </button>
            </div>
            {searchErr && (
              <p className="mt-3 text-sm text-red-500">⚠ {searchErr}</p>
            )}
          </div>

          {/* ── Order result ── */}
          {order && (
            <div className="space-y-3">
              {/* Download Invoice Button */}
              <button
                onClick={async () => {
                  setDownloading(true);
                  try {
                    await generateInvoicePDF(order);
                  } finally {
                    setDownloading(false);
                  }
                }}
                disabled={downloading}
                className="w-full h-12 bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm"
              >
                {downloading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Membuat PDF...</>
                ) : (
                  <><Receipt className="w-4 h-4" /> Unduh Invoice PDF</>
                )}
              </button>
              {/* Order summary card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">ID Pesanan</p>
                    <p className="text-lg font-bold text-gray-900">
                      #{order.orderId}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      a.n.{" "}
                      <span className="font-medium text-gray-700">
                        {order.customerName}
                      </span>
                    </p>
                  </div>
                  {st && (
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${st.badge}`}
                      >
                        {st.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="px-6 pt-4 pb-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" /> Item Pesanan
                  </p>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-start text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.qty} pcs × Rp{" "}
                            {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900 shrink-0 ml-4">
                          Rp {item.subtotal.toLocaleString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="mx-6 mb-4 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3.5 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal Produk</span>
                    <span>Rp {order.itemsTotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Ongkos Kirim</span>
                    <span>
                      {order.shippingCost > 0 ? (
                        `Rp ${order.shippingCost.toLocaleString("id-ID")}`
                      ) : (
                        <span className="text-amber-500 italic text-xs">
                          Menunggu konfirmasi
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200 text-base">
                    <span>Total Bayar</span>
                    <span className="text-[#D92D20]">
                      Rp {order.grandTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="px-6 pb-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Alamat Pengiriman
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                    {order.address}
                  </p>
                </div>
              </div>

              {/* ── STATUS-BASED CONTENT ── */}

              {/* 1. Menunggu ongkir */}
              {order.status === "menunggu_ongkir" && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Menunggu Konfirmasi Ongkir
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Admin sedang menghitung ongkos kirim ke alamat Anda.
                      Tagihan final akan dikirim via email.
                    </p>
                  </div>
                </div>
              )}

              {/* 2. Menunggu pembayaran — BANK + UPLOAD */}
              {order.status === "menunggu_pembayaran" && !alreadyPaid && (
                <>
                  {/* Bank account card */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Rekening Pembayaran
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Transfer senilai{" "}
                          <strong className="text-[#D92D20]">
                            Rp {order.grandTotal.toLocaleString("id-ID")}
                          </strong>{" "}
                          ke rekening berikut
                        </p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl px-6 py-5 text-white relative overflow-hidden">
                        {/* decorative circles */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
                        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full" />
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                          {BANK_NAME}
                        </p>
                        <p className="text-3xl font-bold tracking-[.25em] mb-2">
                          {BANK_NUMBER}
                        </p>
                        <p className="text-sm text-gray-300">
                          a.n.{" "}
                          <span className="font-semibold text-white">
                            {BANK_HOLDER}
                          </span>
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 text-center mt-3">
                        Pastikan nominal transfer <strong>sesuai total</strong>{" "}
                        agar mudah diverifikasi
                      </p>
                    </div>
                  </div>

                  {/* Upload proof */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        Upload Bukti Transfer
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Kirim screenshot / foto bukti transfer Anda
                      </p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div
                        onClick={() => proofRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center text-center overflow-hidden
                          ${proofPreview ? "border-gray-200 p-0" : "border-gray-200 hover:border-[#D92D20]/40 hover:bg-red-50/30 p-10"}`}
                      >
                        {proofPreview ? (
                          <>
                            <img
                              src={proofPreview}
                              alt="Preview"
                              className="w-full max-h-64 object-contain bg-gray-50"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setProofFile(null);
                                setProofPreview(null);
                              }}
                              className="absolute top-2 right-2 bg-white shadow rounded-full p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-3">
                              <ImageIcon className="w-5 h-5 text-gray-300" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">
                              Klik untuk memilih foto
                            </p>
                            <p className="text-xs text-gray-300 mt-1">
                              JPG, PNG, WebP
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        ref={proofRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          setProofFile(f);
                          setProofPreview(URL.createObjectURL(f));
                          setUploadErr("");
                        }}
                      />
                      {uploadErr && (
                        <p className="text-sm text-red-500">{uploadErr}</p>
                      )}
                      <button
                        onClick={handleUpload}
                        disabled={!proofFile || uploading}
                        className="w-full h-11 bg-gray-900 hover:bg-gray-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />{" "}
                            Mengunggah...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" /> Kirim Bukti
                            Pembayaran
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* 2b. Bukti sudah terkirim */}
              {alreadyPaid && order.status === "menunggu_pembayaran" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Bukti Pembayaran Terkirim ✓
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Admin akan memverifikasi dalam waktu dekat.
                    </p>
                  </div>
                </div>
              )}

              {/* 3. Diproses */}
              {order.status === "diproses" && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <BadgeCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Pembayaran Diverifikasi
                    </p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      Pesanan Anda sedang dikemas dan disiapkan untuk
                      pengiriman.
                    </p>
                  </div>
                </div>
              )}

              {/* 4. Dikirim — info pengiriman + konfirmasi */}
              {order.status === "dikirim" &&
                !confirmDone &&
                order.courierType && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-violet-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Informasi Pengiriman
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Paket Anda sedang dalam perjalanan
                        </p>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Ekspedisi</span>
                        <span className="font-semibold text-gray-900">
                          {order.courierType}
                        </span>
                      </div>
                      {order.trackingNumber ? (
                        <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-center">
                          <p className="text-xs text-gray-400 mb-1">
                            Nomor Resi
                          </p>
                          <p className="font-bold text-gray-900 text-xl tracking-widest">
                            {order.trackingNumber}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Lacak di website{" "}
                            <strong>{order.courierType}</strong>
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          Diantarkan langsung oleh tim kami — tidak ada nomor
                          resi.
                        </p>
                      )}
                    </div>
                  </div>
                )}

              {order.status === "dikirim" && !confirmDone && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      Sudah Terima Barang?
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Konfirmasi agar pesanan ditandai selesai
                    </p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div
                      onClick={() => rcptRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center text-center overflow-hidden
                        ${rcptPreview ? "border-gray-200 p-0" : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30 p-8"}`}
                    >
                      {rcptPreview ? (
                        <>
                          <img
                            src={rcptPreview}
                            alt="Preview"
                            className="w-full max-h-48 object-contain bg-gray-50"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRcptFile(null);
                              setRcptPreview(null);
                            }}
                            className="absolute top-2 right-2 bg-white shadow rounded-full p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-7 h-7 text-gray-200 mb-2" />
                          <p className="text-sm text-gray-400">
                            Lampirkan foto barang{" "}
                            <span className="text-gray-300">(opsional)</span>
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      ref={rcptRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setRcptFile(f);
                        setRcptPreview(URL.createObjectURL(f));
                        setConfirmErr("");
                      }}
                    />
                    {confirmErr && (
                      <p className="text-sm text-red-500">{confirmErr}</p>
                    )}
                    <button
                      onClick={handleConfirm}
                      disabled={confirming}
                      className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
                    >
                      {confirming ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />{" "}
                          Memproses...
                        </>
                      ) : (
                        <>
                          <PackageCheck className="w-4 h-4" /> Barang Sudah
                          Diterima
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* 5. Selesai */}
              {(order.status === "selesai" || confirmDone) && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">
                      Pesanan Selesai 🎉
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Terima kasih telah berbelanja di BIZPART24!
                    </p>
                  </div>
                </div>
              )}

              {/* 6. Batal */}
              {order.status === "batal" && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <X className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-900">
                      Pesanan Dibatalkan
                    </p>
                    <p className="text-xs text-red-700 mt-0.5">
                      Pesanan ini telah dibatalkan. Hubungi kami jika ada
                      pertanyaan.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={null}>
      <PaymentContent />
    </Suspense>
  );
}
