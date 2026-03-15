import type { MetadataRoute } from "next";

const SITE_URL = "https://www.bizpart24.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://bizpart24-backend.vercel.app/api";

interface ProductItem {
  id: string;
}

async function getProductEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await fetch(`${API_URL}/products?limit=all`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as {
      success?: boolean;
      data?: ProductItem[];
    };

    if (!payload.success || !Array.isArray(payload.data)) {
      return [];
    }

    return payload.data.map((product) => ({
      url: `${SITE_URL}/products/${product.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tutorial`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/payment`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/checkout`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.3,
    },
  ];

  const productPages = await getProductEntries();

  return [...staticPages, ...productPages];
}