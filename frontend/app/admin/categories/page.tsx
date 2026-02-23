"use client"

import { useEffect, useState } from "react"
import { Loader2, Plus, Search, Trash2, Tag, X, Check } from "lucide-react"
import api from "@/lib/api"
import { Input } from "@/components/ui/Input"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState("")
  const [isAdding, setIsAdding]     = useState(false)
  const [newName, setNewName]       = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      if (res.data.success) setCategories(res.data.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return
    try {
      const token = localStorage.getItem("adminToken")
      await api.delete(`/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      fetchCategories()
    } catch { alert("Gagal menghapus kategori") }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setSubmitting(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await api.post('/categories', { name: newName }, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.success) { setIsAdding(false); setNewName(""); fetchCategories() }
    } catch { alert("Gagal membuat kategori") }
    finally { setSubmitting(false) }
  }

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

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
          <h1 className="text-xl font-bold text-gray-900">Kategori</h1>
          <p className="text-sm text-gray-400 mt-0.5">{categories.length} kategori tersedia</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full md:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari kategori..."
              className="pl-9 bg-gray-50 border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-gray-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => { setIsAdding(!isAdding); setNewName("") }}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Tambah Baru
          </button>
        </div>
      </div>

      {/* Inline Add Form */}
      {isAdding && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm font-semibold text-gray-900 mb-3">Tambah Kategori Baru</p>
          <form onSubmit={handleCreate} className="flex gap-2">
            <Input
              placeholder="Nama kategori, contoh: Oli Mesin"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 bg-gray-50 border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-gray-300"
              autoFocus
            />
            <button
              type="submit"
              disabled={submitting || !newName.trim()}
              className="px-4 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 border border-gray-200 text-gray-500 hover:text-gray-700 rounded-lg text-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Nama</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Slug</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Tag className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <span className="font-medium text-gray-900">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">{cat.slug}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-5 py-14 text-center">
                    <Tag className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Tidak ada kategori ditemukan.</p>
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
