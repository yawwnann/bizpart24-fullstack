"use client"

import { useEffect, useState } from "react"
import { Package, ShoppingCart, DollarSign, Loader2, ArrowRight } from "lucide-react"
import api from "@/lib/api"
import Link from "next/link"

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  menunggu_ongkir:    { label: "Menunggu Ongkir",    cls: "bg-gray-100 text-gray-600" },
  menunggu_pembayaran:{ label: "Menunggu Bayar",     cls: "bg-amber-50 text-amber-700" },
  diproses:           { label: "Diproses",            cls: "bg-blue-50 text-blue-700"  },
  dikirim:            { label: "Dikirim",             cls: "bg-violet-50 text-violet-700" },
  selesai:            { label: "Selesai",             cls: "bg-emerald-50 text-emerald-700" },
  batal:              { label: "Batal",               cls: "bg-red-50 text-red-600"    },
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, recentOrders: [] as any[] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken")
        const config = { headers: { Authorization: `Bearer ${token}` } }
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders/admin/list', config)
        ])
        const products = productsRes.data.success ? productsRes.data.count || productsRes.data.data.length : 0
        const orders   = ordersRes.data.success   ? ordersRes.data.data : []
        const revenue  = orders.reduce((acc: number, o: any) => acc + (o.grandTotal || 0), 0)
        setStats({ products, orders: orders.length, revenue, recentOrders: orders.slice(0, 5) })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="w-7 h-7 animate-spin text-gray-300" />
    </div>
  )

  const statCards = [
    { label: "Total Pendapatan", value: `Rp ${stats.revenue.toLocaleString("id-ID")}`, icon: DollarSign, iconCls: "text-emerald-600", iconBg: "bg-emerald-50" },
    { label: "Total Pesanan",   value: stats.orders,   icon: ShoppingCart, iconCls: "text-blue-600",    iconBg: "bg-blue-50"    },
    { label: "Total Produk",    value: stats.products, icon: Package,      iconCls: "text-[#D92D20]",   iconBg: "bg-red-50"     },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Selamat datang kembali, Admin.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                <Icon className={`w-5 h-5 ${s.iconCls}`} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">Pesanan Terbaru</p>
          <Link href="/admin/orders" className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
            Lihat semua <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">ID Pesanan</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Pelanggan</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Total</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentOrders.length > 0 ? stats.recentOrders.map((order: any) => {
                const s = STATUS_MAP[order.status] ?? { label: order.status, cls: "bg-gray-100 text-gray-600" }
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-gray-900">{order.orderId}</td>
                    <td className="px-5 py-3.5 text-gray-700">{order.customerName}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-900">Rp {order.grandTotal?.toLocaleString("id-ID")}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.cls}`}>{s.label}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString("id-ID")}</td>
                  </tr>
                )
              }) : (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-300 text-sm">Belum ada pesanan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
