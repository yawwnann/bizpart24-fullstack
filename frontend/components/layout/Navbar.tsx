"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Search, ShoppingBag, CreditCard, BookOpen, Phone, Grid } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

import { MobileMenu } from "./MobileMenu"
import { useCart } from "@/context/CartContext"
import { useFetchCategories } from "@/hooks/useFetchCategories"

export function Navbar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { cartItems } = useCart()
  const { categories } = useFetchCategories()

  const isActive = (path: string, category?: string) => {
    if (pathname !== path) return false
    
    const currentCategory = searchParams.get("category")
    if (category) {
        return currentCategory === category
    }
    // If no category specified in isActive check, ensure no category in URL (for generic pages like Dashboard or main Catalog)
    return !currentCategory
  }

  const linkClass = (active: boolean) => 
    `h-full flex items-center px-1 border-b-2 transition-all ${
      active 
        ? "text-[#D92D20] border-[#D92D20] font-bold" 
        : "border-transparent text-gray-600 hover:text-[#D92D20] hover:border-[#D92D20]"
    }`

  const actionLinkClass = (active: boolean) => 
    `flex flex-col items-center gap-1 px-2 py-1 border-b-2 transition-all ${
      active 
        ? "text-[#D92D20] border-[#D92D20]" 
        : "border-transparent text-gray-600 hover:text-[#D92D20] hover:border-[#D92D20]"
    }`

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 font-sans border-b border-gray-100">
      
      {/* Top Row: Logo, Search, Actions */}
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-8">
        
        <div className="flex items-center gap-4">
             {/* Mobile Menu Trigger */}
            <MobileMenu />

            {/* Logo */}
            <Link href="/dashboard" className="shrink-0">
                <img src="/logo.png" alt="BIZSPAREPART24 Logo" className="h-10 w-auto object-contain" />
            </Link>
        </div>

        {/* Search Bar - Concentrated Center */}
        <div className="hidden md:flex flex-1 max-w-2xl relative">
            <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="w-4 h-4" />
                </span>
                <Input 
                    className="w-full pl-10 pr-4 h-10 text-sm bg-gray-50 border-gray-200 text-gray-900 rounded-full focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all placeholder:text-gray-400" 
                    placeholder="Cari suku cadang (e.g. Kampas Rem Innova)..." 
                />
            </div>
        </div>

        {/* User Actions - Minimalist */}
        <div className="flex items-center gap-6">
            <Link href="/products" className={actionLinkClass(pathname.startsWith('/products')) + " group"}>
              <div className="relative">
                <Grid className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase hidden md:block">Katalog</span>
            </Link>

            <Link href="/cart" className={actionLinkClass(isActive('/cart')) + " group"}>
              <div className="relative">
                <ShoppingBag className="w-6 h-6" />
                {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#D92D20] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase hidden md:block">Keranjang</span>
            </Link>

             <div className="hidden md:flex items-center gap-6">
                <Link href="/payment" className={actionLinkClass(isActive('/payment')) + " group"}>
                  <div className="relative">
                     <CreditCard className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase">Bayar</span>
                </Link>

                <Link href="/tutorial" className={actionLinkClass(isActive('/tutorial')) + " group"}>
                  <div className="relative">
                     <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase">Tutorial</span>
                </Link>

                <Link href="#" className={actionLinkClass(isActive('/contact')) + " group"}>
                  <div className="relative">
                     <Phone className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase">Kontak</span>
                </Link>
             </div>
        </div>
      </div>

      {/* Navigation Links - Simple & Clean */}
      <div className="w-full bg-white border-t border-gray-100 hidden md:block">
         <div className="container mx-auto px-4 md:px-8">
            <nav className="flex items-center gap-8 h-12 overflow-x-auto text-sm font-medium">
                <Link href="/dashboard" className={linkClass(isActive('/dashboard'))}>
                    BERANDA
                </Link>
                <Link href="/products" className={linkClass(isActive('/products'))}>
                    SEMUA KATEGORI
                </Link>
                {categories.map((cat) => (
                    <Link 
                        key={cat._id} 
                        href={`/products?category=${cat.name.toLowerCase()}`} 
                        className={linkClass(isActive('/products', cat.name.toLowerCase()))}
                    >
                        {cat.name.toUpperCase()}
                    </Link>
                ))}
            </nav>
         </div>
      </div>
      
       {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
           <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                 <Search className="w-4 h-4" />
              </span>
              <Input 
                className="w-full pl-9 pr-4 h-9 text-sm bg-gray-50 border-none rounded-lg focus:bg-white transition-all placeholder:text-gray-400" 
                placeholder="Cari suku cadang..." 
              />
            </div>
        </div>
    </header>
  )
}
