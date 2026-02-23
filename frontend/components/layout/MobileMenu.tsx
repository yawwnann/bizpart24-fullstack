"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X,  Home, Settings, Zap, Droplets, CircleDot, Phone, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useFetchCategories } from "@/hooks/useFetchCategories"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { categories } = useFetchCategories()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (  
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={toggleMenu} className="mr-2">
        <Menu className="w-6 h-6 text-gray-700" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] animate-in fade-in duration-200"
          onClick={closeMenu}
        />
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 left-0 w-[80%] max-w-xs bg-white shadow-xl z-[70] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
           <div className="font-bold text-lg text-gray-900">Menu</div>
           <Button variant="ghost" size="icon" onClick={closeMenu}>
             <X className="w-5 h-5 text-gray-500" />
           </Button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-64px)] p-4 space-y-6">
            {/* Main Navigation */}
            <nav className="space-y-1">
                <Link href="/dashboard" onClick={closeMenu} className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-[#D92D20] transition-colors font-medium">
                    <Home className="w-5 h-5" /> Beranda
                </Link>
                <Link href="/products" onClick={closeMenu} className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-[#D92D20] transition-colors font-medium">
                    <Settings className="w-5 h-5" /> Semua Kategori
                </Link>
                {categories.map((cat) => (
                    <Link 
                        key={cat.id} 
                        href={`/products?category=${cat.name.toLowerCase()}`} 
                        onClick={closeMenu} 
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-500 hover:bg-red-50 hover:text-[#D92D20] transition-colors font-medium ml-4 border-l border-gray-100"
                    >
                        {cat.name}
                    </Link>
                ))}
            </nav>

            <div className="border-t border-gray-100 pt-6">
                <Link href="#" className="block bg-yellow-400 text-black px-4 py-3 rounded-lg text-center font-bold uppercase tracking-wide hover:bg-yellow-300 transition-colors">
                    Fash Sale
                </Link>
            </div>

            {/* Other Links */}
             <div className="border-t border-gray-100 pt-6 space-y-1">
                 <Link href="/tutorial" onClick={closeMenu} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-[#D92D20]">
                    <BookOpen className="w-4 h-4" /> Tutorial Pembayaran
                </Link>
                 <Link href="#" onClick={closeMenu} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-[#D92D20]">
                    <Phone className="w-4 h-4" /> Hubungi Kami
                </Link>
             </div>
        </div>
      </div>
    </div>
  )
}
