"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Save,
  ShoppingBag,
  User,
} from "lucide-react";
import api from "@/lib/api";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [shippingCost, setShippingCost] = useState("");
  const [isUpdatingShipping, setIsUpdatingShipping] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierType, setCourierType] = useState("");
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get(`/orders/admin/${params.id}`, config);
      if (response.data.success) {
        setOrder(response.data.data);
        setShippingCost(response.data.data.shippingCost.toString());
        setTrackingNumber(response.data.data.trackingNumber || "");
        setCourierType(response.data.data.courierType || "");
      }
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const handleUpdateShipping = async () => {
    if (!shippingCost) return;
    setIsUpdatingShipping(true);
    try {
      const token = localStorage.getItem("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.put(
        `/orders/admin/${params.id}/ongkir`,
        { shippingCost },
        config,
      );
      if (response.data.success) {
        setOrder(response.data.data);
        if (response.data.whatsappLink)
          window.open(response.data.whatsappLink, "_blank");
      }
    } catch (error) {
      console.error("Failed to update shipping", error);
    } finally {
      setIsUpdatingShipping(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const token = localStorage.getItem("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.put(
        `/orders/admin/${params.id}/status`,
        { status: newStatus },
        config,
      );
      if (response.data.success) setOrder(response.data.data);
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!courierType) return;
    setIsUpdatingTracking(true);
    try {
      const token = localStorage.getItem("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.put(
        `/orders/admin/${params.id}/resi`,
        { trackingNumber, courierType },
        config,
      );
      if (response.data.success) {
        setOrder(response.data.data);

        // Generate WhatsApp message
        const updatedOrder = response.data.data;
        const phone = updatedOrder.phone?.startsWith("0")
          ? "62" + updatedOrder.phone.slice(1)
          : updatedOrder.phone;

        let message = `Halo ${updatedOrder.customerName},\n\n`;
        message += `Pesanan Anda *${updatedOrder.orderId}* telah dikirim! 📦\n\n`;
        message += `*Detail Pengiriman:*\n`;
        message += `Ekspedisi: ${courierType}\n`;

        if (trackingNumber) {
          message += `No. Resi: ${trackingNumber}\n\n`;
          message += `Anda dapat melacak paket Anda menggunakan nomor resi di atas.\n\n`;
        } else {
          message += `\n`;
        }

        message += `Terima kasih telah berbelanja di BIZPART24! 🙏`;

        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        // Redirect to WhatsApp
        window.open(whatsappUrl, "_blank");
      }
    } catch (error) {
      console.error("Failed to update tracking", error);
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-gray-300" />
      </div>
    );

  if (!order)
    return (
      <div className="p-8 text-center text-gray-400 text-sm">
        Order tidak ditemukan.
      </div>
    );

  const statusMap: Record<string, { label: string; cls: string }> = {
    menunggu_ongkir: {
      label: "Menunggu Ongkir",
      cls: "bg-gray-100 text-gray-600 border-gray-200",
    },
    menunggu_pembayaran: {
      label: "Menunggu Pembayaran",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    diproses: {
      label: "Diproses",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
    },
    dikirim: {
      label: "Dikirim",
      cls: "bg-violet-50 text-violet-700 border-violet-200",
    },
    selesai: {
      label: "Selesai",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    batal: { label: "Batal", cls: "bg-red-50 text-red-700 border-red-200" },
  };
  const status = statusMap[order.status] ?? {
    label: order.status ?? "Pending",
    cls: "bg-gray-50 text-gray-600 border-gray-200",
  };

  const statusButtons = [
    { value: "diproses", label: "Diproses" },
    { value: "dikirim", label: "Dikirim" },
    { value: "selesai", label: "Selesai" },
    { value: "batal", label: "Batalkan Order", danger: true },
  ];

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Page header */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <span className="text-gray-200 select-none">|</span>
        <h1 className="text-base font-semibold text-gray-900">
          #{order.orderId}
        </h1>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.cls}`}
        >
          {status.label}
        </span>
        <button
          onClick={fetchOrder}
          className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
        >
          <Loader2 className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />{" "}
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Item Pesanan */}
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900">
                Item Pesanan
              </p>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-center px-5 py-3.5"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.qty} pcs × Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    Rp {item.subtotal.toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal Barang</span>
                <span>Rp {order.itemsTotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Ongkos Kirim</span>
                <span>Rp {order.shippingCost.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 pt-1.5 border-t border-gray-200">
                <span>Grand Total</span>
                <span className="text-[#D92D20]">
                  Rp {order.grandTotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Data Pelanggan */}
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900">
                Data Pelanggan
              </p>
            </div>
            <div className="px-5 py-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-1">Nama</p>
                <p className="font-medium text-gray-900">
                  {order.customerName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <p className="font-medium text-gray-900">
                  {order.email || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">No. Telepon</p>
                <a
                  href={`https://wa.me/${order.phone?.startsWith("0") ? "62" + order.phone.slice(1) : order.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {order.phone}
                </a>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400 mb-1">Alamat Pengiriman</p>
                <p className="text-gray-800 bg-gray-50 rounded-lg px-3 py-2.5 text-sm leading-relaxed border border-gray-100">
                  {order.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column: Step-based Actions ── */}
        <div className="space-y-4">
          {/* STEP 1 — menunggu_ongkir */}
          {order.status === "menunggu_ongkir" && (
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <p className="text-sm font-semibold text-gray-900">
                    Konfirmasi Ongkos Kirim
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 ml-7">
                  Simpan untuk kirim tagihan ke pelanggan
                </p>
              </div>
              <div className="p-5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      className="bg-gray-50 border-gray-200 text-gray-900 text-sm"
                      placeholder="0"
                      value={formatCurrency(Number(shippingCost || 0))}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        setShippingCost(raw);
                      }}
                    />
                  </div>
                  <button
                    onClick={handleUpdateShipping}
                    disabled={isUpdatingShipping}
                    className="px-4 bg-gray-900 hover:bg-gray-700 text-white rounded-md text-sm font-medium flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                  >
                    {isUpdatingShipping ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — menunggu_pembayaran */}
          {order.status === "menunggu_pembayaran" && (
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <p className="text-sm font-semibold text-gray-900">
                    Verifikasi Bukti Pembayaran
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 ml-7">
                  Periksa bukti transfer yang dikirim pelanggan
                </p>
              </div>
              <div className="p-5">
                {order.paymentProof ? (
                  <div className="space-y-3">
                    <div className="rounded-lg overflow-hidden border border-gray-100 relative group cursor-pointer">
                      <img
                        src={order.paymentProof}
                        alt="Bukti Pembayaran"
                        className="w-full object-contain max-h-56 bg-gray-50"
                      />
                      <a
                        href={order.paymentProof}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium gap-1 transition-opacity"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Lihat Penuh
                      </a>
                    </div>
                    <button
                      className="w-full h-9 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      onClick={() => handleUpdateStatus("diproses")}
                      disabled={isUpdatingStatus}
                    >
                      {isUpdatingStatus
                        ? "Memproses..."
                        : "✓ Verifikasi & Tandai Diproses"}
                    </button>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-300 text-xs border border-dashed border-gray-200 rounded-lg">
                    Menunggu pelanggan upload bukti pembayaran…
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 — diproses */}
          {order.status === "diproses" && (
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <p className="text-sm font-semibold text-gray-900">
                    Input Ekspedisi & Resi
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 ml-7">
                  Otomatis ubah status ke "Dikirim" & email ke pelanggan
                </p>
              </div>
              <div className="p-5">
                {order.courierType ? (
                  <div className="space-y-3">
                    <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Ekspedisi</span>
                        <span className="font-semibold text-gray-900">
                          {order.courierType}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">No. Resi</span>
                        {order.trackingNumber ? (
                          <span className="font-bold text-gray-900 tracking-wider">
                            {order.trackingNumber}
                          </span>
                        ) : (
                          <span className="text-gray-300 italic text-xs">
                            Antar Sendiri / tidak ada
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setOrder((o: any) => ({
                          ...o,
                          courierType: null,
                          trackingNumber: null,
                        }))
                      }
                      className="w-full h-8 text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors"
                    >
                      Ubah Info Pengiriman
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1.5 block">
                        Jenis Ekspedisi <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={courierType}
                        onChange={(e) => setCourierType(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300"
                      >
                        <option value="">Pilih ekspedisi...</option>
                        <optgroup label="Ekspedisi Umum">
                          <option value="JNE">JNE</option>
                          <option value="J&T Express">J&T Express</option>
                          <option value="SiCepat">SiCepat</option>
                          <option value="Anteraja">Anteraja</option>
                          <option value="Pos Indonesia">Pos Indonesia</option>
                          <option value="TIKI">TIKI</option>
                          <option value="Lion Parcel">Lion Parcel</option>
                          <option value="Ninja Xpress">Ninja Xpress</option>
                          <option value="Cargo">Cargo</option>
                        </optgroup>
                        <optgroup label="Lainnya">
                          <option value="Antar Sendiri">
                            Antar Sendiri (tanpa resi)
                          </option>
                          <option value="Lainnya">Lainnya</option>
                        </optgroup>
                      </select>
                    </div>
                    {courierType && courierType !== "Antar Sendiri" && (
                      <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">
                          Nomor Resi{" "}
                          <span className="text-gray-300">(opsional)</span>
                        </label>
                        <Input
                          placeholder="Kosongkan jika tidak ada resi"
                          className="bg-gray-50 border-gray-200 text-gray-900 text-sm"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                        />
                      </div>
                    )}
                    <button
                      onClick={handleUpdateTracking}
                      disabled={isUpdatingTracking || !courierType}
                      className="w-full h-9 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
                    >
                      {isUpdatingTracking ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      Simpan & Tandai Dikirim
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4 — dikirim */}
          {order.status === "dikirim" && (
            <>
              {order.courierType && (
                <div className="bg-white rounded-xl border border-gray-100">
                  <div className="px-5 py-3.5 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      Info Pengiriman
                    </p>
                  </div>
                  <div className="px-5 py-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ekspedisi</span>
                      <span className="font-semibold text-gray-900">
                        {order.courierType}
                      </span>
                    </div>
                    {order.trackingNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">No. Resi</span>
                        <span className="font-bold text-gray-900 tracking-wider">
                          {order.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="bg-white rounded-xl border border-emerald-100">
                <div className="px-5 py-3.5 border-b border-emerald-100">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center">
                      4
                    </span>
                    <p className="text-sm font-semibold text-gray-900">
                      Tandai Pesanan Selesai
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 ml-7">
                    Konfirmasi manual jika barang sudah diterima pelanggan
                  </p>
                </div>
                <div className="p-5">
                  <button
                    onClick={() => handleUpdateStatus("selesai")}
                    disabled={isUpdatingStatus}
                    className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isUpdatingStatus ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                        Memproses...
                      </>
                    ) : (
                      "✓ Tandai Selesai"
                    )}
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    atau tunggu pelanggan konfirmasi sendiri di /payment
                  </p>
                </div>
              </div>
            </>
          )}

          {/* STEP 5 — selesai */}
          {order.status === "selesai" && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <p className="text-sm font-semibold text-emerald-900">
                ✓ Pesanan Selesai
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                Pesanan ini telah selesai.
              </p>
            </div>
          )}

          {/* Bukti pembayaran — tampil sebagai referensi jika sudah lewat step verifikasi */}
          {order.paymentProof && order.status !== "menunggu_pembayaran" && (
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  Bukti Pembayaran
                </p>
              </div>
              <div className="p-5">
                <div className="rounded-lg overflow-hidden border border-gray-100 relative group cursor-pointer">
                  <img
                    src={order.paymentProof}
                    alt="Bukti Pembayaran"
                    className="w-full object-contain max-h-40 bg-gray-50"
                  />
                  <a
                    href={order.paymentProof}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium gap-1 transition-opacity"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Lihat Penuh
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Ganti Status Manual (override / batal) */}
          {order.status !== "selesai" && (
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  Ganti Status Manual
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Override untuk koreksi atau pembatalan
                </p>
              </div>
              <div className="p-5 space-y-2">
                {statusButtons.map((btn) => {
                  const isActive = order.status === btn.value;
                  return (
                    <button
                      key={btn.value}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors disabled:opacity-40 flex items-center justify-between
                        ${
                          isActive
                            ? btn.danger
                              ? "bg-red-50 border-red-200 text-red-700"
                              : "bg-gray-900 border-gray-900 text-white"
                            : btn.danger
                              ? "border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200"
                              : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      disabled={isActive || isUpdatingStatus}
                      onClick={() => handleUpdateStatus(btn.value)}
                    >
                      <span>{btn.label}</span>
                      {isActive && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${btn.danger ? "bg-red-500" : "bg-white"}`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
