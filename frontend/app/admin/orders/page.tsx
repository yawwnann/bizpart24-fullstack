"use client"

import { useEffect, useState } from "react"
import { Eye, Loader2, Search, Package } from "lucide-react"
import api from "@/lib/api"
import Link from "next/link"
import { Input } from "@/components/ui/Input"

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  menunggu_ongkir:    { label: "Menunggu Ongkir",    cls: "bg-gray-100 text-gray-600" },
  menunggu_pembayaran:{ label: "Menunggu Bayar",     cls: "bg-amber-50 text-amber-700" },
  diproses:           { label: "Diproses",            cls: "bg-blue-50 text-blue-700"  },
  dikirim:            { label: "Dikirim",             cls: "bg-violet-50 text-violet-700" },
  selesai:            { label: "Selesai",             cls: "bg-emerald-50 text-emerald-700" },
  batal:              { label: "Batal",               cls: "bg-red-50 text-red-600"    },
}

export default function AdminOrdersPage() {
  const [orders, setOrders]                 = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [loading, setLoading]               = useState(true)
  const [search, setSearch]                 = useState("")

  useEffect(() => { fetchOrders() }, [])
  useEffect(() => {
    if (!search) return setFilteredOrders(orders)
    const q = search.toLowerCase()
    setFilteredOrders(orders.filter((o: any) =>
      o.orderId.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)
    ))
  }, [search, orders])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await api.get('/orders/admin/list', { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.success) { setOrders(res.data.data); setFilteredOrders(res.data.data) }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="w-7 h-7 animate-spin text-gray-300" />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pesanan</h1>
          <p className="text-sm text-gray-400 mt-0.5">{orders.length} total pesanan</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari ID atau nama..."
            className="pl-9 bg-gray-50 border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">ID Pesanan</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Pelanggan</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Total</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Bukti Bayar</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Tanggal</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? filteredOrders.map((order: any) => {
                const s = STATUS_MAP[order.status] ?? { label: order.status, cls: "bg-gray-100 text-gray-600" }
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-gray-900">{order.orderId}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.phone}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">Rp {order.grandTotal.toLocaleString("id-ID")}</p>
                      {order.shippingCost > 0 && <p className="text-xs text-gray-400">+Ongkir Rp {order.shippingCost.toLocaleString("id-ID")}</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      {order.paymentProof
                        ? <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">Terupload</span>
                        : <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">Belum ada</span>
                      }
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.cls}`}>{s.label}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("id-ID")}</td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors inline-flex"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <Package className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Tidak ada pesanan ditemukan.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
