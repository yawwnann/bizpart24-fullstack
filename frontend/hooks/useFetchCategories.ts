import { useEffect, useState } from "react"
import api from "@/lib/api"

interface Category {
  id: string
  name: string
  slug: string
  image?: string
}

export function useFetchCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories')
        if (response.data.success) {
          setCategories(response.data.data)
        }
      } catch (err) {
        console.error("Failed to fetch categories", err)
        setError("Gagal memuat kategori")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}
