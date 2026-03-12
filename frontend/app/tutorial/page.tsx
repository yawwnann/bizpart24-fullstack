"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import {
  ShoppingCart,
  FileText,
  Truck,
  CreditCard,
  CheckCircle,
  MessageCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function TutorialPage() {
  const steps = [
    {
      number: 1,
      title: "Pilih Produk",
      icon: ShoppingCart,
      description:
        "Cari dan pilih suku cadang yang Anda butuhkan dari katalog kami. Baca detail spek untuk memastikan kesesuaian.",
      steps: [
        "Buka halaman Katalog",
        "Pilih Kategori atau Cari Produk",
        "Klik 'Tambah Keranjang'",
      ],
    },
    {
      number: 2,
      title: "Checkout Pesanan",
      icon: FileText,
      description:
        "Periksa kembali pesanan Anda di keranjang belanja sebelum melanjutkan ke proses pembayaran.",
      steps: [
        "Buka Keranjang Belanja",
        "Klik tombol 'Checkout'",
        "Lengkapi Data Pengiriman",
      ],
    },
    {
      number: 3,
      title: "Konfirmasi Ongkir",
      icon: Truck,
      description:
        "Tim kami akan menghitung ongkos kirim termurah ke lokasi Anda dan menginformasikan total tagihan.",
      steps: [
        "Tunggu Admin Menghubungi",
        "Admin Cek Ongkir Manual",
        "Terima Total Tagihan via WA",
      ],
    },
    {
      number: 4,
      title: "Lakukan Pembayaran",
      icon: CreditCard,
      description:
        "Transfer pembayaran sesuai total tagihan ke rekening resmi BIZSPAREPART24 yang tertera.",
      steps: [
        "Transfer sesuai nominal",
        "Simpan bukti transfer",
        "Jangan berikan bukti ke orang lain",
      ],
    },
    {
      number: 5,
      title: "Konfirmasi Bayar",
      icon: CheckCircle,
      description:
        "Segera konfirmasi pembayaran Anda agar pesanan dapat langsung kami proses untuk pengiriman.",
      steps: [
        "Buka halaman Konfirmasi",
        "Upload Bukti Transfer",
        "Atau kirim via WhatsApp Admin",
      ],
    },
    {
      number: 6,
      title: "Proses & Kirim",
      icon: MessageCircle,
      description:
        "Pesanan Anda akan dipacking dengan aman dan dikirim. Resi akan diinfokan melalui WhatsApp.",
      steps: [
        "Barang Diproses & Packing",
        "Resi Pengiriman Terbit",
        "Pantau status via WhatsApp",
      ],
    },
  ];

  const importantNotes = [
    "Ongkos kirim menyesuaikan lokasi dan berat barang.",
    "Pembayaran hanya ke rekening resmi atas nama PT BIZSPAREPART24.",
    "Pastikan nomor WhatsApp yang didaftarkan aktif untuk komunikasi.",
    "Simpan ID Pesanan Anda untuk pengecekan status.",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section - Matching Homepage Style */}
      <div className="relative w-full bg-[#0a1020] text-white overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-r from-[#0a1020] via-[#0a1020]/95 to-[#0a1020]/80 z-10" />
          <div className="w-full h-full opacity-30 bg-[url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-3xl">
          <span className="text-[#D92D20] font-bold tracking-wider text-sm uppercase mb-4 block">
            Panduan Pelanggan
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Cara Berbelanja di BIZSPAREPART24
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Ikuti panduan mudah berikut untuk memesan suku cadang asli dan
            berkualitas untuk kendaraan Anda.
          </p>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="container mx-auto px-4 md:px-8 py-16 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={index}
                className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden group"
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-red-50 text-[#D92D20] rounded-xl flex items-center justify-center group-hover:bg-[#D92D20] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-bold text-gray-100 group-hover:text-red-50 transition-colors select-none">
                      0{step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#D92D20] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                    {step.description}
                  </p>

                  <div className="border-t border-gray-100 pt-4 mt-auto">
                    <ul className="space-y-2">
                      {step.steps.map((s, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-xs text-gray-600 font-medium"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D92D20] shrink-0"></span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Important Notes & CTA */}
      <div className="container mx-auto px-4 md:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notes Section */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-white border border-gray-200 p-8 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <AlertCircle className="w-6 h-6 text-[#D92D20]" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Catatan Penting
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {importantNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg"
                    >
                      <span className="w-5 h-5 rounded-full bg-red-100 text-[#D92D20] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        !
                      </span>
                      <p className="text-sm text-gray-700">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Final CTA */}
          <div className="lg:col-span-1">
            <Card className="h-full bg-[#D92D20] text-white p-8 rounded-xl flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none"></div>
              <div className="relative z-10 w-full">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Mulai Belanja?</h3>
                <p className="text-white/80 text-sm mb-8">
                  Pilih suku cadang berkualitas untuk mobil kesayangan Anda
                  sekarang.
                </p>
                <Button
                  asChild
                  className="w-full bg-white text-[#D92D20] hover:bg-gray-100 hover:text-red-700 font-bold h-12 rounded-lg border-0"
                >
                  <Link href="/products">
                    Lihat Katalog <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full mt-3 text-white hover:bg-white/10 hover:text-white h-10"
                >
                  <a
                    href="https://wa.me/6282140130066?text=Halo%2C%20saya%20butuh%20bantuan"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Butuh Bantuan?
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
