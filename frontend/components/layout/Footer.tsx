import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-gray-400 py-16 font-sans">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-tighter">
                BIZPART<span className="text-[#D92D20]">24</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Platform e-commerce otomotif No. 1 di Indonesia. Belanja aman,
              mudah, dan terpercaya untuk semua kebutuhan mobil Anda.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#D92D20] hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#D92D20] hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#D92D20] hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#D92D20] hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Belanja Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Belanja</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/products"
                  className="hover:text-[#D92D20] transition-colors"
                >
                  Katalog Produk
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-[#D92D20] transition-colors"
                >
                  Keranjang
                </Link>
              </li>
              <li>
                <Link
                  href="/checkout"
                  className="hover:text-[#D92D20] transition-colors"
                >
                  Checkout
                </Link>
              </li>
              <li>
                <Link
                  href="/payment"
                  className="hover:text-[#D92D20] transition-colors"
                >
                  Pembayaran
                </Link>
              </li>
            </ul>
          </div>

          {/* Informasi Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Informasi</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#D92D20] transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/tutorial"
                  className="hover:text-[#D92D20] transition-colors"
                >
                  Tutorial Pembelian
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/6282140130066"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D92D20] transition-colors"
                >
                  Hubungi Kami (WhatsApp)
                </a>
              </li>
            </ul>
          </div>

          {/* Alamat Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Alamat</h3>
            <div className="space-y-6 text-sm">
              <div>
                <p className="text-white font-semibold mb-2">Jakarta</p>
                <p className="leading-relaxed">
                  Mall MGK
                  <br />
                  Jl. Angkasa Raya No. B6
                  <br />
                  Gunung Sahari Selatan, Kemayoran
                  <br />
                  Jakarta Pusat, DKI Jakarta 10610
                </p>
              </div>

              <div>
                <p className="text-white font-semibold mb-2">Pati</p>
                <p className="leading-relaxed">
                  Jalan Raya Pati-Gunungwungkal KM 4
                  <br />
                  Desa Sumberrejo RT 3/6
                  <br />
                  Kec. Gunungwungkal, Pati
                  <br />
                  Jawa Tengah
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
          <p>&copy; 2026 BIZPART24. Hak Cipta Dilindungi.</p>
          <div className="flex gap-6">
            <Link
              href="/tutorial"
              className="hover:text-white transition-colors"
            >
              Cara Pembelian
            </Link>
            <Link
              href="/products"
              className="hover:text-white transition-colors"
            >
              Katalog
            </Link>
            <Link href="/" className="hover:text-white transition-colors">
              Beranda
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
