import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BIZPART24 - Toko Suku Cadang Mobil Online Terpercaya",
    template: "%s | BIZPART24",
  },
  description:
    "Toko suku cadang mobil online terpercaya di Indonesia. Temukan ribuan spare part original dengan harga terbaik, pengiriman cepat ke seluruh Indonesia.",
  keywords: [
    "suku cadang mobil",
    "spare part mobil",
    "onderdil mobil",
    "kampas rem",
    "filter oli",
    "busi mobil",
    "suku cadang original",
    "toko otomotif online",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "BIZPART24",
    title: "BIZPART24 - Toko Suku Cadang Mobil Online Terpercaya",
    description:
      "Toko suku cadang mobil online terpercaya di Indonesia. Spare part original, harga terbaik, pengiriman cepat.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
