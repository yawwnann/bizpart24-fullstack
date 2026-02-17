
import { Droplets, CircleDot, Zap, Settings, Thermometer, Sun } from "lucide-react";

export const categories = [
  {
    id: 1,
    name: "Oli & Pelumas",
    icon: Droplets,
  },
  {
    id: 2,
    name: "Sistem Rem",
    icon: CircleDot,
  },
  {
    id: 3,
    name: "Kelistrikan",
    icon: Zap,
  },
  {
    id: 4,
    name: "Mesin",
    icon: Settings,
  },
  {
    id: 5,
    name: "Pendinginan",
    icon: Thermometer,
  },
  {
    id: 6,
    name: "Eksterior",
    icon: Sun,
  },
];

export const products = [
  {
    id: 1,
    name: "Shell Helix HX8 5W-30 Synthetic (4 Liter)",
    category: "OLI MESIN",
    price: 345000,
    originalPrice: 400000,
    rating: 5,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1635766293922-1d5d28b8a5d3?q=80&w=800&auto=format&fit=crop", 
    discount: "-15%",
  },
  {
    id: 2,
    name: "Kampas Rem Depan Brembo Ceramic - Honda Jazz",
    category: "REM & KAMPAS",
    price: 850000,
    originalPrice: null,
    rating: 4.5,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop", // Placeholder
    discount: null,
  },
  {
    id: 3,
    name: "Shockbreaker Kayaba Excel-G Belakang (Set)",
    category: "SUSPENSI",
    price: 1200000,
    originalPrice: null,
    rating: 5,
    reviews: 69,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop", // Placeholder
    discount: null,
  },
  {
    id: 4,
    name: "Filter Udara Ferrox Stainless Steel - Innova Reborn",
    category: "FILTER UDARA",
    price: 950000,
    originalPrice: null,
    rating: 4.8,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop", // Placeholder
    discount: "BARU",
    isNew: true
  },
];

export const features = [
  {
    id: 1,
    title: "Jaminan Original",
    description: "Produk 100% asli garansi resmi.",
    icon: "ShieldCheck" // We'll handle this string mapping or import icon directly in component
  },
  {
    id: 2,
    title: "Pengiriman Cepat",
    description: "Dikirim di hari yang sama.",
    icon: "Truck"
  },
  {
    id: 3,
    title: "Konsultasi Ahli",
    description: "Mekanik siap membantu Anda.",
    icon: "MessageCircle"
  },
  {
    id: 4,
    title: "Pembayaran Aman",
    description: "Transaksi terenkripsi 100%.",
    icon: "CreditCard"
  }
];

export const brands = [
  { name: "Toyota", logo: "https://images.seeklogo.com/logo-png/14/1/toyota-logo-png_seeklogo-141406.png" },
  { name: "Honda", logo: "https://cdn.worldvectorlogo.com/logos/honda-logo-4.svg" },
  { name: "Suzuki", logo: "https://cdn.worldvectorlogo.com/logos/suzuki.svg" },
  { name: "Mitsubishi", logo: "https://cdn.worldvectorlogo.com/logos/mitsubishi-motors-1.svg" },
  { name: "Daihatsu", logo: "https://images.seeklogo.com/logo-png/3/1/daihatsu-logo-png_seeklogo-38135.png" },
  { name: "Nissan", logo: "https://cdn.worldvectorlogo.com/logos/nissan-6.svg" },
  { name: "Mazda", logo: "https://cdn.worldvectorlogo.com/logos/mazda-2.svg" },
  { name: "Hyundai", logo: "https://images.seeklogo.com/logo-png/6/1/hyundai-logo-png_seeklogo-69051.png" },
];

export const getProductById = (id: number) => products.find(p => p.id === id);
