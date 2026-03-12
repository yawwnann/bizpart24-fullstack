"use client";

import { Button } from "@/components/ui/Button";
import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

export function Hero() {
  // const [makes, setMakes] = useState<SelectOption[]>([]);
  // const [models, setModels] = useState<SelectOption[]>([]);
  // const [years, setYears] = useState<SelectOption[]>([]);

  // const [selectedYear, setSelectedYear] = useState("");
  // const [selectedMake, setSelectedMake] = useState("");
  // const [selectedModel, setSelectedModel] = useState("");

  // useEffect(() => {
  //   api
  //     .get("/makes")
  //     .then((res) => {
  //       if (res.data.success) {
  //         setMakes(
  //           res.data.data.map((m: { name: string }) => ({
  //             label: m.name,
  //             value: m.name,
  //           })),
  //         );
  //       }
  //     })
  //     .catch(() => {});

  //   api
  //     .get("/models")
  //     .then((res) => {
  //       if (res.data.success) {
  //         setModels(
  //           res.data.data.map((m: { name: string }) => ({
  //             label: m.name,
  //             value: m.name,
  //           })),
  //         );
  //       }
  //     })
  //     .catch(() => {});

  //   api
  //     .get("/products", { params: { limit: "all" } })
  //     .then((res) => {
  //       if (res.data.success) {
  //         const uniqueYears = [
  //           ...new Set(res.data.data.map((p: { year: number }) => p.year)),
  //         ]
  //           .sort((a, b) => (b as number) - (a as number))
  //           .map((y) => ({ label: String(y), value: String(y) }));
  //         setYears(uniqueYears as SelectOption[]);
  //       }
  //     })
  //     .catch(() => {});
  // }, []);

  // const handleSearch = () => {
  //   const params = new URLSearchParams();
  //   if (selectedYear) params.set("year", selectedYear);
  //   if (selectedMake) params.set("make", selectedMake);
  //   if (selectedModel) params.set("model", selectedModel);

  //   const query = params.toString();
  //   router.push(`/products${query ? `?${query}` : ""}`);
  // };

  return (
    <section className="relative w-full bg-[#0a1020] text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-r from-[#0a1020] via-[#0a1020]/90 to-transparent z-10" />
        <div
          className="w-full h-full opacity-40 bg-[url('https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDdtNHNoanZtbnJ5eWpqZ3l1NmwyejN4aTFqcHVjbXYyMHBveDBwYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xvUMqz0tf00iFuvwfB/giphy.gif')] bg-cover bg-center"
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
            Temukan ribuan suku cadang asli dengan harga terbaik. Pengiriman
            cepat ke seluruh Indonesia dengan garansi uang kembali.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="rounded-full px-8 text-base" asChild>
              <Link href="/products">
                Belanja Sekarang <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 text-base border-gray-600 text-white hover:bg-white hover:text-black"
              asChild
            >
              <a
                href="https://wa.me/6282140130066"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hubungi CS <MessageCircle className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      {/* Search Widget - Floating at bottom
      <div className="container mx-auto px-4 md:px-8 relative z-20 -mt-16 mb-16">
        <Card className="bg-white shadow-lg rounded-2xl border-0">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase">
                  Tahun
                </label>
                <Select
                  className="w-full h-11 rounded-lg border text-black border-gray-300 bg-white px-4 text-sm"
                  placeholder="Pilih Tahun Mobil"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  options={years}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase">
                  Merek
                </label>
                <Select
                  className="w-full h-11 rounded-lg border text-black border-gray-300 bg-white px-4 text-sm"
                  placeholder="Pilih Merek Mobil"
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  options={makes}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase">
                  Model
                </label>
                <Select
                  className="w-full h-11 rounded-lg border text-black border-gray-300 bg-white px-4 text-sm"
                  placeholder="Pilih Model Mobil"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  options={models}
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full h-11 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  Cari Sparepart
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div> */}
    </section>
  );
}
