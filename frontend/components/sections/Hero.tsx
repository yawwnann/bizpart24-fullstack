import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Select } from "@/components/ui/Select"
import { ArrowRight, MessageCircle } from "lucide-react"

export function Hero() {
  return (
    <section className="relative w-full bg-[#0a1020] text-white overflow-hidden">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Placeholder for engine parts background. Using a dark gradient for now to match the "dark blue" vibe */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1020] via-[#0a1020]/90 to-transparent z-10" />
        <div 
            className="w-full h-full opacity-40 bg-[url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center"
            aria-hidden="true"
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 pt-16 pb-32">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#D92D20] text-white px-3 py-1 rounded-full text-xs font-bold mb-6">
            GARANSI 100% ORIGINAL
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Solusi Terbaik untuk <br />
            Performa Mobil Anda
          </h1>

          {/* Subtext */}
          <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-lg">
            Temukan ribuan suku cadang asli dengan harga terbaik. 
            Pengiriman cepat ke seluruh Indonesia dengan garansi 
            uang kembali.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="rounded-full px-8 text-base">
              Belanja Sekarang <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 text-base border-gray-600 text-white hover:bg-white hover:text-black">
              Hubungi CS <MessageCircle className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
{/* Search Widget - Floating at bottom */}
      <div className="container mx-auto px-4 md:px-8 relative z-20 -mt-16 mb-16">
        <Card className="bg-white shadow-lg rounded-2xl border-0">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase">Tahun</label>
                <Select 
                  className="w-full h-11 rounded-lg border text-black border-gray-300 bg-white px-4 text-sm"
                  placeholder="Pilih Tahun Mobil" 
                  options={[
                    { label: "2024", value: "2024" },
                    { label: "2023", value: "2023" },
                    { label: "2022", value: "2022" },
                  ]} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase">Merek</label>
                <Select 
                  className="w-full h-11 rounded-lg border text-black border-gray-300 bg-white px-4 text-sm"
                  placeholder="Pilih Merek Mobil" 
                  options={[
                    { label: "Toyota", value: "toyota" },
                    { label: "Honda", value: "honda" },
                    { label: "Suzuki", value: "suzuki" },
                  ]} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase">Model</label>
                <Select 
                  className="w-full h-11 rounded-lg border text-black border-gray-300 bg-white px-4 text-sm"
                  placeholder="Pilih Model Mobil" 
                  options={[
                    { label: "Avanza", value: "avanza" },
                    { label: "Jazz", value: "jazz" },
                    { label: "Civic", value: "civic" },
                  ]} 
                />
              </div>

              <div className="flex items-end">
                <Button className="w-full h-11 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors text-sm">
                  Cari Sparepart
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
