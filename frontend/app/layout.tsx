import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const SITE_URL = "https://www.bizpart24.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/logo/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo/favicon.ico", sizes: "any" },
      { url: "/logo/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/logo/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: ["/favicon.ico", "/logo/favicon.ico"],
    apple: [
      {
        url: "/logo/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  alternates: {
    canonical: SITE_URL,
  },
  title: {
    default:
      "BIZPART24 - Toko Suku Cadang Mobil Online Terpercaya di Indonesia",
    template: "%s | BIZPART24",
  },
  description:
    "Toko suku cadang mobil online terpercaya di Indonesia. Temukan ribuan spare part original dengan harga terbaik dan pengiriman cepat.",
  keywords: [
    "suku cadang mobil",
    "spare part mobil",
    "onderdil mobil",
    "kampas rem",
    "filter oli",
    "busi mobil",
    "suku cadang original",
    "toko otomotif online",
    "bizpart24",
    "suku cadang online",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "BIZPART24",
    url: SITE_URL,
    title: "BIZPART24 - Toko Suku Cadang Mobil Online Terpercaya di Indonesia",
    description:
      "Toko suku cadang mobil online terpercaya di Indonesia. Temukan ribuan spare part original dengan harga terbaik dan pengiriman cepat.",
    images: [
      {
        url: "/logo/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "BIZPART24 Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BIZPART24 - Toko Suku Cadang Mobil Online Terpercaya di Indonesia",
    description:
      "Toko suku cadang mobil online terpercaya di Indonesia. Temukan ribuan spare part original dengan harga terbaik dan pengiriman cepat.",
    images: ["/logo/android-chrome-512x512.png"],
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
