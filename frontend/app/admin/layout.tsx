"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, FolderTree, LogOut, Menu, X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (pathname === "/admin/login") {
        setAuthorized(true)
        return
    }

    // Check for token
    const token = localStorage.getItem("adminToken")
    if (!token) {
        router.push("/admin/login")
    } else {
        setAuthorized(true)
    }
  }, [router, pathname])

  if (!authorized) return null

  // If on login page, just render children without sidebar
  if (pathname === "/admin/login") {
      return <>{children}</>
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    router.push("/admin/login")
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="BIZSPAREPART24" className="h-8 w-auto object-contain brightness-0 invert" />
                </div>
                <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                isActive 
                                    ? "bg-[#D92D20] text-white shadow-lg shadow-red-900/20" 
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <Button 
                    variant="ghost" 
                    className="w-full text-gray-400 hover:text-white hover:bg-white/5 justify-start gap-3"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </Button>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 md:hidden p-4 flex items-center justify-between">
            <div className="font-bold text-gray-900">Admin Panel</div>
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
            </Button>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
        </main>
      </div>
    </div>
  )
}
