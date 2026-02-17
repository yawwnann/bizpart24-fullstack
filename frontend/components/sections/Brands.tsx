import { brands } from "@/mock/data";

export function Brands() {
  return (
    <section className="py-12 bg-white border-t border-gray-100 overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900">Mitra Resmi & Brand Terpercaya</h2>
        <p className="text-gray-500 mt-2 text-sm">Bekerja sama dengan produsen otomotif terkemuka.</p>
      </div>
      
      <div className="relative w-full max-w-7xl mx-auto px-4">
        <div className="flex w-full overflow-hidden mask-fade select-none"> 
          {/* First Set */}
          <div className="flex flex-shrink-0 items-center gap-16 pr-16 animate-marquee py-4">
            {brands.map((brand, index) => (
              <div key={`brand-${index}`} className="w-24 h-16 relative flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 shrink-0 cursor-pointer">
                <img 
                   src={brand.logo} 
                   alt={brand.name} 
                   loading="lazy"
                   className="max-h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>

          {/* Second Set (Seamless Loop) */}
          <div className="flex flex-shrink-0 items-center gap-16 pr-16 animate-marquee py-4" aria-hidden="true">
            {brands.map((brand, index) => (
              <div key={`brand-dup-${index}`} className="w-24 h-16 relative flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 shrink-0 cursor-pointer">
                <img 
                   src={brand.logo} 
                   alt={brand.name} 
                   loading="lazy"
                   className="max-h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
