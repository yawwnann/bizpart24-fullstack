# SEO Setup - BIZPART24

## ✅ Perubahan yang Telah Dilakukan

### 1. Homepage SEO Title & Description

- **Title**: "BIZPART24 - Toko Suku Cadang Mobil Online Terpercaya di Indonesia"
- **Description**: "Toko suku cadang mobil online terpercaya di Indonesia. Temukan ribuan spare part original dengan harga terbaik dan pengiriman cepat."
- **Canonical URL**: https://www.bizpart24.com

### 2. Struktur Homepage

- ✅ Homepage dipindahkan dari `/dashboard` ke `/` (root)
- ✅ File: `app/page.tsx` sekarang berisi konten homepage
- ✅ File: `app/dashboard/page.tsx` sekarang redirect ke `/`

### 3. Metadata & SEO Tags

**File: `app/layout.tsx`**

- ✅ Canonical URL: `https://www.bizpart24.com`
- ✅ Favicon: `/favicon.ico` dan `/logo/favicon.ico`
- ✅ Open Graph tags untuk social media
- ✅ Twitter Card tags
- ✅ Keywords untuk SEO
- ✅ Robots: index, follow

**File: `app/page.tsx`**

- ✅ Title spesifik untuk homepage
- ✅ Description spesifik untuk homepage
- ✅ Canonical URL untuk homepage
- ✅ Open Graph override untuk homepage

### 4. Domain Redirects (301 Permanent)

**File: `next.config.ts`**

Semua domain berikut akan redirect ke `https://www.bizpart24.com`:

- ✅ `http://bizpart24.com` → `https://www.bizpart24.com`
- ✅ `https://bizpart24.com` → `https://www.bizpart24.com`
- ✅ `http://www.bizpart24.com` → `https://www.bizpart24.com`

### 5. Favicon Setup

- ✅ `/public/favicon.ico` (root level)
- ✅ `/public/logo/favicon.ico`
- ✅ `/public/logo/favicon-16x16.png`
- ✅ `/public/logo/favicon-32x32.png`
- ✅ `/public/logo/apple-touch-icon.png`

### 6. Navigation Updates

- ✅ Navbar logo link: `/dashboard` → `/`
- ✅ Navbar "BERANDA" link: `/dashboard` → `/`
- ✅ Mobile menu "Beranda" link: `/dashboard` → `/`
- ✅ Active state detection untuk homepage

---

## 🚀 Langkah Deploy

### 1. Build Project

```bash
cd frontend
npm run build
```

### 2. Test Locally

```bash
npm run start
```

Buka browser dan test:

- http://localhost:3000 → harus menampilkan homepage
- http://localhost:3000/dashboard → harus redirect ke /

### 3. Deploy ke Production

```bash
# Jika menggunakan Vercel
vercel --prod

# Atau push ke Git (jika auto-deploy)
git add .
git commit -m "SEO: Update homepage title and domain redirects"
git push origin main
```

### 4. Verifikasi Setelah Deploy

Cek URL berikut:

- ✅ https://www.bizpart24.com → Title harus benar
- ✅ https://bizpart24.com → Harus redirect ke www
- ✅ http://bizpart24.com → Harus redirect ke https://www
- ✅ http://www.bizpart24.com → Harus redirect ke https://www

---

## 🔍 Verifikasi SEO

### 1. Cek Title di Browser

Buka https://www.bizpart24.com dan lihat tab browser:

```
BIZPART24 - Toko Suku Cadang Mobil Online Terpercaya di Indonesia
```

### 2. Cek Meta Tags

Buka Developer Tools → Elements → `<head>`:

```html
<title>BIZPART24 - Toko Suku Cadang Mobil Online Terpercaya di Indonesia</title>
<meta
  name="description"
  content="Toko suku cadang mobil online terpercaya di Indonesia. Temukan ribuan spare part original dengan harga terbaik dan pengiriman cepat."
/>
<link rel="canonical" href="https://www.bizpart24.com" />
```

### 3. Test dengan Tools

- **Google Search Console**: Submit sitemap dan request indexing
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Rich Results Test**: https://search.google.com/test/rich-results
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly

### 4. Cek Redirect

```bash
# Test redirect dengan curl
curl -I http://bizpart24.com
# Harus return: Location: https://www.bizpart24.com

curl -I https://bizpart24.com
# Harus return: Location: https://www.bizpart24.com
```

---

## 📊 Google Search Console

### 1. Submit Sitemap

URL: https://www.bizpart24.com/sitemap.xml

### 2. Request Indexing

- Buka Google Search Console
- URL Inspection → https://www.bizpart24.com
- Klik "Request Indexing"

### 3. Monitor Performance

- Tunggu 1-2 minggu untuk Google re-index
- Monitor di Search Console → Performance
- Cek impressions dan clicks untuk homepage

---

## 🎯 Expected Results

### Google Search Results

```
BIZPART24 - Toko Suku Cadang Mobil Online Terpercaya di Indonesia
https://www.bizpart24.com
Toko suku cadang mobil online terpercaya di Indonesia. Temukan ribuan spare part original dengan harga terbaik dan pengiriman cepat.
```

### Social Media Sharing

- **Facebook/LinkedIn**: Open Graph tags akan menampilkan title, description, dan image
- **Twitter**: Twitter Card akan menampilkan preview yang menarik
- **WhatsApp**: Preview link dengan title dan description

---

## 📝 Checklist Deploy

- [ ] Build project berhasil tanpa error
- [ ] Test locally di http://localhost:3000
- [ ] Deploy ke production
- [ ] Verifikasi title di https://www.bizpart24.com
- [ ] Test redirect dari http://bizpart24.com
- [ ] Test redirect dari https://bizpart24.com
- [ ] Cek favicon muncul di browser tab
- [ ] Submit sitemap ke Google Search Console
- [ ] Request indexing untuk homepage
- [ ] Test sharing link di social media
- [ ] Monitor Google Search Console setelah 1-2 minggu

---

## 🔧 Troubleshooting

### Title Tidak Berubah di Google

- Google butuh waktu 1-2 minggu untuk re-index
- Request indexing di Google Search Console
- Pastikan robots.txt tidak memblokir homepage

### Redirect Tidak Bekerja

- Pastikan deploy sudah selesai
- Clear browser cache (Ctrl+Shift+R)
- Test dengan incognito mode
- Cek di Vercel dashboard → Domains → Redirects

### Favicon Tidak Muncul

- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Pastikan file ada di `/public/favicon.ico`
- Cek di Developer Tools → Network → favicon.ico

---

## 📞 Support

Jika ada masalah, hubungi:

- WhatsApp: +62 821-4013-0066
- Email: support@bizpart24.com
