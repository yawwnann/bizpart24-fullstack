"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Eye, Loader2, Search } from "lucide-react"
import api from "@/lib/api"
import Link from "next/link"
import { Input } from "@/components/ui/Input"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    if (!search) {
        setFilteredOrders(orders)
    } else {
        const lowerSearch = search.toLowerCase()
        setFilteredOrders(orders.filter((order: any) => 
            order.orderId.toLowerCase().includes(lowerSearch) ||
            order.customerName.toLowerCase().includes(lowerSearch)
        ))
    }
  }, [search, orders])

  const fetchOrders = async () => {
    try {
        const token = localStorage.getItem("adminToken")
        const config = { headers: { Authorization: `Bearer ${token}` } }
        const response = await api.get('/orders/admin/list', config)
        if (response.data.success) {
            setOrders(response.data.data)
            setFilteredOrders(response.data.data)
        }
    } catch (error) {
        console.error("Failed to fetch orders", error)
    } finally {
        setLoading(false)
    }
  }

  if (loading) {
      return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
  }

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Pesanan</h1>
                <p className="text-gray-500">Lihat dan kelola pesanan pelanggan.</p>
            </div>
            
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                    placeholder="Cari ID Pesanan atau Nama..." 
                    className="pl-9 bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#D92D20] placeholder:text-gray-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        <Card className="bg-white border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">ID Pesanan</th>
                            <th className="px-6 py-4">Pelanggan</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Pembayaran</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Tanggal</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order: any) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{order.orderId}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{order.customerName}</div>
                                        <div className="text-xs text-gray-500">{order.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium">Rp {order.grandTotal.toLocaleString("id-ID")}</div>
                                        {order.shippingCost > 0 && <div className="text-xs text-gray-500">+Ongkir Rp {order.shippingCost.toLocaleString("id-ID")}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.paymentProof ? (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Terupload</span>
                                        ) : (
                                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Menunggu</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            order.status === 'selesai' ? 'bg-green-100 text-green-800' :
                                            order.status === 'diproses' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'dikirim' ? 'bg-indigo-100 text-indigo-800' :
                                            order.status === 'batal' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/orders/${order._id}`}>
                                                <Eye className="w-4 h-4 text-gray-500" />
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Tidak ada pesanan ditemukan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
  )
}
