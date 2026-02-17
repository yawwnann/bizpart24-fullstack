"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ArrowLeft, ExternalLink, Loader2, Save, ShoppingBag, Truck, User } from "lucide-react"
import api from "@/lib/api"
import Link from "next/link"

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Actions
  const [shippingCost, setShippingCost] = useState("")
  const [isUpdatingShipping, setIsUpdatingShipping] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [])

  const fetchOrder = async () => {
    try {
        const token = localStorage.getItem("adminToken")
        const config = { headers: { Authorization: `Bearer ${token}` } }
        const response = await api.get(`/orders/admin/${params.id}`, config)
        if (response.data.success) {
            setOrder(response.data.data)
            setShippingCost(response.data.data.shippingCost.toString())
        }
    } catch (error) {
        console.error("Failed to fetch order", error)
    } finally {
        setLoading(false)
    }
  }

  const handleUpdateShipping = async () => {
      if (!shippingCost) return
      setIsUpdatingShipping(true)
      try {
        const token = localStorage.getItem("adminToken")
        const config = { headers: { Authorization: `Bearer ${token}` } }
        const response = await api.put(`/orders/admin/${params.id}/ongkir`, { shippingCost }, config)
        
        if (response.data.success) {
            setOrder(response.data.data)
            // Optional: Show success toast
            if (response.data.whatsappLink) {
                 window.open(response.data.whatsappLink, '_blank')
            }
        }
      } catch (error) {
          console.error("Failed to update shipping", error)
      } finally {
          setIsUpdatingShipping(false)
      }
  }

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdatingStatus(true)
    try {
      const token = localStorage.getItem("adminToken")
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await api.put(`/orders/admin/${params.id}/status`, { status: newStatus }, config)
      
      if (response.data.success) {
          setOrder(response.data.data)
      }
    } catch (error) {
        console.error("Failed to update status", error)
    } finally {
        setIsUpdatingStatus(false)
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
  if (!order) return <div className="p-8 text-center text-gray-500">Order not found</div>

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderId}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                 order.status === 'selesai' ? 'bg-green-100 text-green-800' :
                 order.status === 'diproses' ? 'bg-blue-100 text-blue-800' :
                 order.status === 'dikirim' ? 'bg-purple-100 text-purple-800' :
                 'bg-yellow-100 text-yellow-800'
            }`}>
                {order.status || 'Pending'}
            </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Order Items & Customer Info */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Items */}
                <Card className="p-6 bg-white border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-gray-400" /> Order Items
                    </h3>
                    <div className="space-y-4">
                        {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                <div>
                                    <div className="font-medium text-gray-900">{item.name}</div>
                                    <div className="text-sm text-gray-500">Qty: {item.qty} x Rp {item.price.toLocaleString("id-ID")}</div>
                                </div>
                                <div className="font-bold text-gray-900">
                                    Rp {item.subtotal.toLocaleString("id-ID")}
                                </div>
                            </div>
                        ))}
                        <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-bold">Rp {order.itemsTotal.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Ongkir</span>
                            <span className="font-bold">Rp {order.shippingCost.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg text-[#D92D20]">
                            <span className="font-bold">Grand Total</span>
                            <span className="font-bold">Rp {order.grandTotal.toLocaleString("id-ID")}</span>
                        </div>
                    </div>
                </Card>

                {/* Customer Info */}
                <Card className="p-6 bg-white border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-400" /> Customer Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <span className="text-gray-500">Name</span>
                            <div className="font-medium text-gray-900">{order.customerName}</div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-gray-500">Email</span>
                            <div className="font-medium text-gray-900">{order.email}</div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-gray-500">Phone</span>
                            <div className="font-medium text-gray-900">{order.phone}</div>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <span className="text-gray-500">Address</span>
                            <div className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                {order.address}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Right Column: Actions & Payment Proof */}
            <div className="space-y-6">
                
                {/* 1. Input Ongkir */}
                <Card className="p-6 bg-white border-gray-200 shadow-sm border-l-4 border-l-blue-500">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-blue-500" /> Step 1: Input Ongkir
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">Input ongkir untuk mengirim tagihan total ke WA user.</p>
                    
                    <div className="flex gap-2 mb-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                            <Input 
                                type="number" 
                                className="pl-9 bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#D92D20] placeholder:text-gray-400" 
                                placeholder="0"
                                value={shippingCost}
                                onChange={(e) => setShippingCost(e.target.value)}
                            />
                        </div>
                        <Button 
                            onClick={handleUpdateShipping} 
                            disabled={isUpdatingShipping}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isUpdatingShipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        </Button>
                    </div>
                    {order.whatsappLink && (
                         <a href={order.whatsappLink} target="_blank" className="text-xs text-green-600 hover:underline flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> Chat Customer on WA
                         </a>
                    )}
                </Card>

                 {/* 2. Verify Payment */}
                 <Card className="p-6 bg-white border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-2">Step 2: Payment Proof</h3>
                    {order.paymentProof ? (
                        <div className="space-y-4">
                            <div className="aspect-[3/4] rounded-lg overflow-hidden border border-gray-200 relative group cursor-pointer bg-gray-50">
                                <img src={order.paymentProof} alt="Proof" className="w-full h-full object-contain" />
                                <a href={order.paymentProof} target="_blank" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-medium">
                                    View Full Image
                                </a>
                            </div>
                            {order.status !== 'diproses' && order.status !== 'dikirim' && order.status !== 'selesai' && (
                                <Button 
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    onClick={() => handleUpdateStatus('diproses')}
                                    disabled={isUpdatingStatus}
                                >
                                    Verify & Process Order
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-500 text-sm border-2 border-dashed border-gray-200">
                            No payment proof uploaded yet.
                        </div>
                    )}
                </Card>

                {/* 3. Update Status */}
                <Card className="p-6 bg-white border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Step 3: Update Status</h3>
                    <div className="space-y-2">
                        <Button 
                            variant="outline" 
                            className="w-full justify-between" 
                            disabled={order.status === 'diproses' || isUpdatingStatus}
                            onClick={() => handleUpdateStatus('diproses')}
                        >
                            <span>Processing</span>
                            {order.status === 'diproses' && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full justify-between" 
                            disabled={order.status === 'dikirim' || isUpdatingStatus}
                            onClick={() => handleUpdateStatus('dikirim')}
                        >
                            <span>Shipped</span>
                            {order.status === 'dikirim' && <div className="w-2 h-2 bg-purple-500 rounded-full" />}
                        </Button>
                         <Button 
                            variant="outline" 
                            className="w-full justify-between" 
                            disabled={order.status === 'selesai' || isUpdatingStatus}
                            onClick={() => handleUpdateStatus('selesai')}
                        >
                            <span>Completed</span>
                            {order.status === 'selesai' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                        </Button>
                         <Button 
                            variant="outline" 
                            className="w-full justify-between text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100" 
                            disabled={order.status === 'batal' || isUpdatingStatus}
                            onClick={() => handleUpdateStatus('batal')}
                        >
                            <span>Cancel Order</span>
                            {order.status === 'batal' && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                        </Button>
                    </div>
                </Card>

            </div>
        </div>
    </div>
  )
}
