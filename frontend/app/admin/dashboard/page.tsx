"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Package, ShoppingCart, DollarSign, TrendingUp, Users } from "lucide-react"
import api from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    recentOrders: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch Products Count
            const productsRes = await api.get('/products')
            const productsCount = productsRes.data.success ? productsRes.data.count || productsRes.data.data.length : 0

            // Fetch Orders (Using admin list endpoint if available, but for now we might need to rely on what we have)
            // Note: We need an admin endpoint to get ALL orders. The public one might be restricted or return 404 if no ID.
            // Let's assume we use the endpoint I saw in order.controller: getAll
            // But wait, user might not be logged in to backend session, we send token header.
            const token = localStorage.getItem("adminToken")
            const config = { headers: { Authorization: `Bearer ${token}` } }
            
            // We need to implement the secure fetches
            const ordersRes = await api.get('/orders/admin/list', config)
            const orders = ordersRes.data.success ? ordersRes.data.data : []
            
            const revenue = orders.reduce((acc: number, order: any) => acc + (order.grandTotal || 0), 0)

            setStats({
                products: productsCount,
                orders: orders.length,
                revenue,
                recentOrders: orders.slice(0, 5)
            })
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error)
        } finally {
            setLoading(false)
        }
    }

    fetchData()
  }, [])

  if (loading) {
      return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
  }

  const statCards = [
      { label: "Total Pendapatan", value: `Rp ${stats.revenue.toLocaleString("id-ID")}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
      { label: "Total Pesanan", value: stats.orders, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Total Produk", value: stats.products, icon: Package, color: "text-[#D92D20]", bg: "bg-red-50" },
  ]

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Ringkasan Dashboard</h1>
            <p className="text-gray-500">Selamat datang kembali, Admin.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statCards.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <Card key={index} className="p-6 flex items-start justify-between bg-white border-gray-100 shadow-sm">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                            <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </Card>
                )
            })}
        </div>

        {/* Recent Orders Table */}
        <Card className="bg-white border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Pesanan Terbaru</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">ID Pesanan</th>
                            <th className="px-6 py-4">Pelanggan</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {stats.recentOrders.length > 0 ? (
                            stats.recentOrders.map((order: any) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{order.orderId}</td>
                                    <td className="px-6 py-4">{order.customerName}</td>
                                    <td className="px-6 py-4">Rp {order.grandTotal?.toLocaleString("id-ID")}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            order.status === 'selesai' ? 'bg-green-100 text-green-800' :
                                            order.status === 'diproses' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Tidak ada pesanan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
  )
}
