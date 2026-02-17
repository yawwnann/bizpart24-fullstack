"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Edit, Loader2, Plus, Search, Trash2, Upload } from "lucide-react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  
  // Add/Edit Modal (Simplified as inline form for now or basic modal state)
  const [isAdding, setIsAdding] = useState(false)
  const [newByName, setNewByName] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
        const response = await api.get('/categories')
        if (response.data.success) {
            setCategories(response.data.data)
        }
    } catch (error) {
        console.error("Failed to fetch categories", error)
    } finally {
        setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return

    try {
        const token = localStorage.getItem("adminToken")
        const config = { headers: { Authorization: `Bearer ${token}` } }
        await api.delete(`/categories/${id}`, config)
        fetchCategories()
    } catch (error) {
        console.error("Failed to delete category", error)
        alert("Gagal menghapus kategori")
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newByName) {
          alert("Mohon isi nama kategori")
          return
      }

      setSubmitting(true)
      try {
        const token = localStorage.getItem("adminToken")
        const payload = { name: newByName }

        const response = await api.post('/categories', payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (response.data.success) {
            setIsAdding(false)
            setNewByName("")
            fetchCategories()
        }
      } catch (error) {
          console.error("Failed to create category", error)
          alert("Gagal membuat kategori")
      } finally {
          setSubmitting(false)
      }
  }

  const filteredCategories = categories.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Kategori</h1>
                <p className="text-gray-500">Kelola kategori produk.</p>
            </div>
            
            <div className="flex gap-4">
                 <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Cari..." 
                        className="pl-9 bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#D92D20] placeholder:text-gray-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button onClick={() => setIsAdding(!isAdding)} className="bg-gray-900 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Baru
                </Button>
            </div>
        </div>

        {/* Add Form */}
        {isAdding && (
            <Card className="p-6 bg-white border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-4">
                <form onSubmit={handleCreate} className="space-y-4">
                    <h3 className="font-bold text-gray-900">Tambah Kategori Baru</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Nama Kategori</label>
                            <Input 
                                placeholder="e.g. Oli Mesin" 
                                value={newByName}
                                onChange={e => setNewByName(e.target.value)}
                                className="bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#D92D20] placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                        <Button type="submit" disabled={submitting} className="bg-[#D92D20] text-white">
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Category"}
                        </Button>
                    </div>
                </form>
            </Card>
        )}

        {/* List Table */}
        <Card className="bg-white border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Nama</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                                <tr key={category._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{category.slug}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleDelete(category._id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Tidak ada kategori ditemukan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
  )
}
