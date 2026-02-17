import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-gray-400 py-16 font-sans">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
                 <img src="/logo.png" alt="Logo" className="h-8 w-auto brightness-0 invert" />
                 <span className="text-xl font-bold text-white tracking-tighter">BIZSPAREPART<span className="text-[#D92D20]">24</span></span>
            </div>
            <p className="text-sm leading-relaxed">
              Platform e-commerce otomotif No. 1 di Indonesia. Belanja aman, mudah, dan terpercaya untuk semua kebutuhan mobil Anda.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#D92D20] hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#D92D20] hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#D92D20] hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
               <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#D92D20] hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Layanan Pelanggan</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-[#D92D20] transition-colors">Pusat Bantuan</Link></li>
              <li><Link href="#" className="hover:text-[#D92D20] transition-colors">Cara Pembelian</Link></li>
              <li><Link href="#" className="hover:text-[#D92D20] transition-colors">Pengiriman & Logistik</Link></li>
              <li><Link href="#" className="hover:text-[#D92D20] transition-colors">Pengembalian Barang</Link></li>
              <li><Link href="#" className="hover:text-[#D92D20] transition-colors">Garansi Produk</Link></li>
            </ul>
          </div>

           {/* Links Column 2 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Perusahaan</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-[#D92D20] transition-colors">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:text-[#D92D20] transition-colors">Karir</Link></li>
              <li><Link href="#" className="hover:text-[#D92D20] transition-colors">Blog Otomotif</Link></li>
              <li><Link href="#" className="hover:text-[#D92D20] transition-colors">Hubungi Kami</Link></li>
              <li><Link href="#" className="hover:text-[#D92D20] transition-colors">Kebijakan Privasi</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
             <h3 className="text-white font-bold text-lg mb-6">Berlangganan Newsletter</h3>
             <p className="text-sm mb-4">Dapatkan penawaran eksklusif dan tips perawatan mobil langsung ke inbox Anda.</p>
             <div className="space-y-3">
               <Input placeholder="Alamat Email Anda" className="bg-[#1f1f1f] border-none text-white h-12 rounded-lg focus:ring-1 focus:ring-[#D92D20] placeholder:text-gray-600" />
               <Button className="w-full h-12 bg-[#D92D20] hover:bg-[#b91c1c] text-white font-bold rounded-lg text-sm tracking-wide">
                 Daftar Sekarang
               </Button>
             </div>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
          <p>&copy; 2024 BIZSPAREPART24. Hak Cipta Dilindungi.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
            <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-white transition-colors">Peta Situs</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
