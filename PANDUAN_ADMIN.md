# Panduan Admin BIZPART24

## Sistem E-Commerce Suku Cadang Mobil

---

## Daftar Isi

1. [Cara Login Admin](#cara-login-admin)
2. [Dashboard](#dashboard)
3. [Manajemen Produk](#manajemen-produk)
4. [Manajemen Kategori](#manajemen-kategori)
5. [Upload Gambar](#upload-gambar)
6. [Manajemen Pesanan](#manajemen-pesanan)
7. [Alur Transaksi Lengkap](#alur-transaksi-lengkap)

---

## Cara Login Admin

### Langkah-langkah Login:

1. **Buka Halaman Admin**
   - Ketik alamat website: `https://www.bizpart24.com/admin`
   - Tekan Enter pada keyboard
   - Halaman login admin akan terbuka

2. **Masukkan Data Login**
   - **Username/Email**: Masukkan email admin yang telah diberikan
   - **Password**: Masukkan password admin yang telah diberikan
   - Pastikan data yang dimasukkan benar dan tidak ada spasi berlebih

3. **Klik Tombol Login**
   - Klik tombol "Login" berwarna merah
   - Tunggu beberapa detik hingga sistem memproses

4. **Akses Dashboard**
   - Jika login berhasil, Anda akan diarahkan ke halaman dashboard
   - Jika gagal, periksa kembali username dan password

### Tips Login:

- Pastikan koneksi internet stabil
- Gunakan browser terbaru (Chrome, Firefox, Safari)
- Jika lupa password, hubungi administrator sistem

---

## Dashboard

Dashboard adalah halaman utama setelah login yang menampilkan ringkasan informasi penting tentang sistem.

### Informasi yang Ditampilkan:

1. **Statistik Utama**
   - **Total Produk**: Jumlah keseluruhan produk dalam sistem
   - **Total Kategori**: Jumlah kategori produk yang tersedia
   - **Total Pesanan**: Jumlah pesanan yang masuk
   - **Revenue 30 Hari**: Total pendapatan dalam 30 hari terakhir
   - **Pesanan Bulan Ini**: Jumlah pesanan bulan berjalan

2. **Menu Navigasi**
   - **Dashboard**: Halaman utama (sedang aktif)
   - **Produk**: Mengelola daftar produk
   - **Kategori**: Mengelola kategori produk
   - **Pesanan**: Mengelola pesanan customer

3. **Informasi Sistem**
   - Grafik penjualan harian
   - Daftar produk stok menipis
   - Pesanan terbaru yang perlu diproses
   - Status sistem aktif

### Cara Navigasi:

- Klik menu di sidebar kiri untuk berpindah halaman
- Gunakan tombol "Logout" di pojok kanan atas untuk keluar sistem

---

## Manajemen Produk

### Melihat Daftar Produk

1. **Akses Halaman Produk**
   - Dari dashboard, klik menu "Produk" di sidebar kiri
   - Daftar semua produk akan ditampilkan dalam bentuk tabel

2. **Informasi yang Ditampilkan**
   - Gambar produk (thumbnail)
   - Nama produk
   - Kategori
   - Harga
   - Stok tersedia
   - Aksi (Edit/Hapus)

3. **Fitur Pencarian dan Filter**
   - Gunakan kotak pencarian untuk mencari produk tertentu
   - Filter berdasarkan kategori, merek, atau model

### Menambahkan Produk Baru

1. **Klik Tombol "Tambah Produk"**
   - Di halaman daftar produk, klik tombol "Tambah Produk" (biasanya berwarna biru)

2. **Isi Informasi Dasar**
   - **Nama Produk**: Masukkan nama lengkap produk (contoh: "Kampas Rem Depan Toyota Avanza")
   - **Harga**: Masukkan harga dalam Rupiah (tanpa titik atau koma)
   - **Stok**: Masukkan jumlah stok yang tersedia
   - **Deskripsi**: Tulis deskripsi detail produk

3. **Pilih Kompatibilitas**
   - **Merek**: Pilih merek kendaraan (Toyota, Honda, dll.)
     - Jika merek belum ada, klik "+ Tambah Merek" untuk menambah baru
     - **Untuk produk universal**: Pilih "Universal" jika produk cocok untuk semua merek
   - **Model**: Pilih model kendaraan (Avanza, Jazz, dll.)
     - Jika model belum ada, klik "+ Tambah Model" untuk menambah baru
     - **Untuk produk generic**: Pilih "Generic" jika produk cocok untuk banyak model
   - **Tahun**: Masukkan tahun kendaraan (contoh: 2020)
     - **Untuk produk universal/generic**: Bisa kosongkan atau isi "0" jika berlaku untuk semua tahun

   **Catatan Penting tentang Produk Universal dan Generic:**

   **Produk Universal:**
   - Produk yang bisa digunakan di semua merek kendaraan
   - Contoh: Oli mesin SAE 10W-40, Air Radiator Coolant, Pembersih Injector
   - Pilih Merek: "Universal", Model: "All Models" atau "Generic"

   **Produk Generic:**
   - Produk yang cocok untuk beberapa model dalam satu merek
   - Contoh: Filter Oli Toyota (cocok untuk Avanza, Innova, Fortuner)
   - Pilih Merek: "Toyota", Model: "Generic" atau "Multi Model"

   **Produk Spesifik:**
   - Produk yang hanya cocok untuk model dan tahun tertentu
   - Contoh: Kampas Rem Depan Toyota Avanza 2012-2015
   - Pilih Merek: "Toyota", Model: "Avanza", Tahun: "2012-2015"

4. **Pilih Kategori**
   - Pilih kategori produk dari dropdown
   - Jika kategori belum ada, klik "+ Tambah Kategori" untuk menambah baru

5. **Upload Gambar**
   - **Gambar Profil**: Upload 1 gambar utama untuk katalog
   - **Gambar Detail**: Upload gambar tambahan (maksimal 10 gambar)
   - Lihat bagian [Upload Gambar](#upload-gambar) untuk detail lengkap

6. **Simpan Produk**
   - Klik tombol "Simpan Produk" berwarna biru
   - Tunggu hingga proses selesai
   - Produk baru akan muncul di daftar

### Mengedit Produk

1. **Pilih Produk yang Akan Diedit**
   - Di daftar produk, klik tombol "Edit" (ikon pensil) pada produk yang ingin diubah

2. **Ubah Informasi**
   - Semua field dapat diubah sesuai kebutuhan
   - Gambar lama akan tetap tampil, bisa diganti dengan yang baru

3. **Simpan Perubahan**
   - Klik tombol "Simpan Produk"
   - Perubahan akan tersimpan otomatis

### Menghapus Produk

#### Menghapus Produk Satu per Satu

1. **Pilih Produk yang Akan Dihapus**
   - Di daftar produk, klik tombol "Hapus" (ikon tempat sampah) pada produk yang ingin dihapus

2. **Konfirmasi Penghapusan**
   - Sistem akan menampilkan pesan konfirmasi
   - Klik "Ya" atau "Hapus" untuk mengkonfirmasi
   - Klik "Batal" jika ingin membatalkan

3. **Produk Terhapus**
   - Produk akan hilang dari daftar
   - **Perhatian**: Penghapusan tidak dapat dibatalkan

#### Menghapus Banyak Produk Sekaligus (Bulk Delete)

1. **Pilih Produk yang Akan Dihapus**
   - Klik kotak centang di sebelah kiri nama produk untuk memilih
   - Untuk memilih semua produk di halaman, klik kotak centang di header tabel
   - Produk yang dipilih akan ditandai dengan background biru

2. **Lihat Jumlah Produk Terpilih**
   - Di bagian atas halaman akan muncul informasi "X produk dipilih"
   - Tombol "Hapus X Produk" akan muncul di sebelah tombol "Tambah Produk"

3. **Hapus Produk Terpilih**
   - Klik tombol "Hapus X Produk" berwarna merah
   - Sistem akan menampilkan konfirmasi "Yakin ingin menghapus X produk yang dipilih?"
   - Klik "OK" untuk melanjutkan atau "Batal" untuk membatalkan

4. **Proses Penghapusan**
   - Sistem akan menghapus semua produk yang dipilih secara bersamaan
   - Tombol akan menampilkan loading spinner selama proses
   - Setelah selesai, akan muncul pesan "X produk berhasil dihapus"

**Tips Menggunakan Bulk Delete:**

- Gunakan filter dan pencarian untuk mempermudah seleksi produk
- Periksa kembali produk yang dipilih sebelum menghapus
- Bulk delete lebih efisien untuk menghapus banyak produk sekaligus
- **Perhatian**: Penghapusan massal tidak dapat dibatalkan

### Mengelola Produk Universal dan Generic

#### Kapan Menggunakan Produk Universal

**Gunakan "Universal" untuk produk yang:**

- Bisa dipakai di semua merek kendaraan
- Tidak tergantung pada spesifikasi khusus kendaraan
- Memiliki standar industri yang sama

**Contoh Produk Universal:**

- Oli mesin (SAE 5W-30, 10W-40, 15W-40)
- Air radiator coolant
- Pembersih injector
- Cairan rem (DOT 3, DOT 4)
- Aki mobil (berdasarkan ukuran standar)
- Lampu bohlam (H4, H7, H11)

**Cara Input Produk Universal:**

1. Merek: Pilih atau buat "Universal"
2. Model: Pilih atau buat "All Models"
3. Tahun: Kosongkan atau isi "0"
4. Deskripsi: Jelaskan spesifikasi teknis (contoh: "SAE 10W-40, API SN/CF")

#### Kapan Menggunakan Produk Generic

**Gunakan "Generic" untuk produk yang:**

- Cocok untuk beberapa model dalam satu merek
- Memiliki part number yang sama untuk beberapa model
- Sharing komponen antar model

**Contoh Produk Generic:**

- Filter oli Toyota (Avanza, Rush, Terios menggunakan part number sama)
- Kampas rem Honda (Jazz, City, Brio part number sama)
- Busi Mitsubishi (L300, Kuda, Pajero menggunakan tipe sama)

**Cara Input Produk Generic:**

1. Merek: Pilih merek spesifik (Toyota, Honda, dll.)
2. Model: Pilih atau buat "Generic" atau "Multi Model"
3. Tahun: Isi range tahun yang berlaku (contoh: "2010-2020")
4. Deskripsi: Sebutkan model-model yang kompatibel

#### Tips Penamaan Produk

**Untuk Produk Universal:**

- "Oli Mesin Universal SAE 10W-40 API SN/CF 1 Liter"
- "Air Radiator Coolant Universal Green 1 Liter"
- "Pembersih Injector Universal 300ml"

**Untuk Produk Generic:**

- "Filter Oli Toyota Generic (Avanza/Rush/Terios) 15601-87703"
- "Kampas Rem Depan Honda Generic (Jazz/City/Brio) 45022-SAA-006"
- "Busi Mitsubishi Generic (L300/Kuda/Pajero) NGK BPR6ES"

**Untuk Produk Spesifik:**

- "Kampas Rem Depan Toyota Avanza 2012-2015 Original"
- "Filter Udara Honda Jazz RS 2014-2019 Genuine Part"

#### Keuntungan Sistem Universal/Generic

**Untuk Admin:**

- Mengurangi duplikasi produk
- Lebih mudah mengelola stok
- Pencarian customer lebih efisien

**Untuk Customer:**

- Mudah menemukan produk yang cocok
- Tidak bingung dengan banyak pilihan serupa
- Informasi kompatibilitas lebih jelas

---

## Manajemen Kategori

### Melihat Daftar Kategori

1. **Akses Halaman Kategori**
   - Dari dashboard, klik menu "Kategori" di sidebar kiri
   - Daftar semua kategori akan ditampilkan

2. **Informasi yang Ditampilkan**
   - Nama kategori
   - Jumlah produk dalam kategori
   - Tanggal dibuat
   - Aksi (Edit/Hapus)

### Menambahkan Kategori Baru

1. **Klik Tombol "Tambah Kategori"**
   - Di halaman daftar kategori, klik tombol "Tambah Kategori"

2. **Isi Informasi Kategori**
   - **Nama Kategori**: Masukkan nama kategori (contoh: "Kampas Rem", "Filter Oli")
   - **Deskripsi**: (Opsional) Tambahkan deskripsi kategori

3. **Simpan Kategori**
   - Klik tombol "Simpan"
   - Kategori baru akan muncul di daftar

### Mengedit Kategori

1. **Pilih Kategori yang Akan Diedit**
   - Di daftar kategori, klik tombol "Edit" (ikon pensil) pada kategori yang ingin diubah
   - Nama kategori akan berubah menjadi input field yang bisa diedit

2. **Ubah Informasi**
   - Ketik nama kategori yang baru di input field
   - Pastikan nama kategori tidak sama dengan yang sudah ada

3. **Simpan Perubahan**
   - Klik tombol "Simpan" (ikon centang hijau) untuk menyimpan perubahan
   - Atau klik tombol "Batal" (ikon X) untuk membatalkan edit
   - Perubahan akan tersimpan dan slug otomatis diperbarui

**Tips Edit Kategori:**

- Edit dilakukan secara inline (langsung di tabel)
- Slug akan otomatis diperbarui berdasarkan nama baru
- Saat sedang edit, tombol hapus akan dinonaktifkan untuk keamanan

### Menghapus Kategori

1. **Pilih Kategori yang Akan Dihapus**
   - Klik tombol "Hapus" pada kategori yang ingin dihapus

2. **Periksa Produk Terkait**
   - Sistem akan memberitahu jika ada produk yang menggunakan kategori ini
   - Pindahkan produk ke kategori lain terlebih dahulu jika diperlukan

3. **Konfirmasi Penghapusan**
   - Klik "Ya" untuk mengkonfirmasi penghapusan
   - **Perhatian**: Kategori yang sudah digunakan produk tidak bisa dihapus

---

## Upload Gambar

### Format Gambar yang Didukung

- **JPG/JPEG** (Direkomendasikan)
- **PNG** (Untuk gambar dengan background transparan)
- **GIF** (Untuk gambar animasi, jarang digunakan)
- **WEBP** (Format modern, ukuran file kecil)

### Batasan Ukuran File

- **Maksimal ukuran per file**: 1 MB (1.024 KB)
- **Jumlah maksimal gambar detail**: 10 gambar per produk
- **Gambar profil**: 1 gambar wajib untuk setiap produk

### Rekomendasi Ukuran Gambar

- **Gambar Profil (Katalog)**: 800 x 800 pixel (rasio 1:1)
- **Gambar Detail**: 1200 x 800 pixel (rasio 3:2)
- **Resolusi minimum**: 400 x 400 pixel
- **Kualitas**: Sedang hingga tinggi (untuk kejelasan detail produk)

### Langkah-langkah Upload Gambar

#### Upload Gambar Profil:

1. **Klik Area Upload**
   - Di bagian "Gambar Profil Katalog", klik area kotak bergaris putus-putus
   - Atau klik teks "Klik untuk Upload Gambar Profil"

2. **Pilih File**
   - Jendela file explorer akan terbuka
   - Pilih gambar yang ingin diupload
   - Klik "Open" atau "Buka"

3. **Preview Gambar**
   - Gambar akan langsung tampil sebagai preview
   - Jika ingin mengganti, klik gambar dan pilih file baru

#### Upload Gambar Detail:

1. **Klik Area Upload Detail**
   - Di bagian "Gambar Detail Produk", klik area "Tambah Gambar Detail"

2. **Pilih Multiple File**
   - Anda bisa memilih beberapa gambar sekaligus
   - Tahan tombol Ctrl (Windows) atau Cmd (Mac) sambil klik file
   - Atau pilih satu per satu

3. **Preview dan Kelola**
   - Semua gambar akan tampil sebagai thumbnail
   - Klik tombol "X" merah untuk menghapus gambar yang tidak diinginkan
   - Gambar baru akan diberi label "Baru" berwarna biru

### Tips Upload Gambar yang Baik

1. **Kualitas Gambar**
   - Gunakan pencahayaan yang cukup
   - Pastikan produk terlihat jelas dan fokus
   - Hindari gambar blur atau gelap

2. **Komposisi Gambar**
   - Tempatkan produk di tengah frame
   - Gunakan background putih atau netral
   - Tunjukkan produk dari berbagai sudut

3. **Optimasi Ukuran File**
   - Kompres gambar jika ukuran terlalu besar
   - Gunakan tools online seperti TinyPNG untuk kompres
   - Pastikan kualitas tetap baik setelah kompres

4. **Penamaan File**
   - Beri nama file yang deskriptif
   - Contoh: "kampas-rem-avanza-depan.jpg"
   - Hindari spasi, gunakan tanda hubung (-)

### Mengatasi Error Upload

#### Error "File terlalu besar":

- Kompres gambar hingga di bawah 1 MB
- Gunakan format JPG dengan kualitas 80-90%
- Resize gambar jika resolusi terlalu tinggi

#### Error "Format tidak didukung":

- Pastikan file berformat JPG, PNG, GIF, atau WEBP
- Convert file ke format yang didukung jika perlu

#### Error "Upload gagal":

- Periksa koneksi internet
- Refresh halaman dan coba lagi
- Pastikan browser mendukung upload file

---

## Manajemen Pesanan

### Melihat Daftar Pesanan

1. **Akses Halaman Pesanan**
   - Dari dashboard, klik menu "Pesanan" di sidebar kiri
   - Daftar semua pesanan akan ditampilkan dalam bentuk tabel

2. **Informasi yang Ditampilkan**
   - ID Pesanan (format: INV-2026-0001)
   - Nama pelanggan dan nomor telepon
   - Total tagihan
   - Status bukti pembayaran
   - Status pesanan
   - Tanggal pesanan dibuat

3. **Fitur Pencarian**
   - Gunakan kotak pencarian untuk mencari berdasarkan ID pesanan atau nama pelanggan
   - Filter otomatis saat mengetik

### Status Pesanan

Sistem memiliki 6 status pesanan yang harus dikelola:

1. **Menunggu Ongkir** (Abu-abu)
   - Pesanan baru masuk, belum ada ongkos kirim
   - **Tugas Admin**: Input ongkos kirim

2. **Menunggu Pembayaran** (Kuning)
   - Ongkir sudah diinput, menunggu customer bayar
   - **Tugas Admin**: Tunggu bukti pembayaran

3. **Diproses** (Biru)
   - Pembayaran sudah diverifikasi
   - **Tugas Admin**: Siapkan barang untuk dikirim

4. **Dikirim** (Ungu)
   - Barang sudah dikirim ke customer
   - **Tugas Admin**: Input nomor resi (jika ada)

5. **Selesai** (Hijau)
   - Customer sudah terima barang
   - **Status**: Transaksi selesai

6. **Batal** (Merah)
   - Pesanan dibatalkan
   - **Status**: Tidak ada tindakan lanjutan

### Mengelola Pesanan Baru

#### Langkah 1: Input Ongkos Kirim

1. **Buka Detail Pesanan**
   - Klik tombol "Lihat" (ikon mata) pada pesanan dengan status "Menunggu Ongkir"

2. **Lihat Alamat Pengiriman**
   - Periksa alamat lengkap customer
   - Catat provinsi, kabupaten, dan kecamatan

3. **Hitung Ongkos Kirim**
   - Gunakan kalkulator ongkir ekspedisi (JNE, JNT, SiCepat, dll.)
   - Atau tentukan tarif antar sendiri

4. **Input Ongkir**
   - Masukkan nominal ongkos kirim dalam Rupiah
   - Klik tombol "Update Ongkir"
   - Status otomatis berubah ke "Menunggu Pembayaran"

5. **Email Otomatis Terkirim**
   - Sistem otomatis kirim email tagihan final ke customer
   - Email berisi total tagihan dan rekening bank

#### Langkah 2: Verifikasi Pembayaran

1. **Notifikasi Bukti Bayar**
   - Admin akan terima email saat customer upload bukti bayar
   - Email berisi foto bukti transfer

2. **Cek Bukti Pembayaran**
   - Buka detail pesanan
   - Lihat foto bukti transfer yang diupload customer
   - Cocokkan nominal dengan total tagihan

3. **Verifikasi Pembayaran**
   - Jika pembayaran valid, ubah status ke "Diproses"
   - Jika ada masalah, hubungi customer via WhatsApp

#### Langkah 3: Proses Pengiriman

1. **Siapkan Barang**
   - Kemas barang sesuai pesanan
   - Pastikan semua item sudah lengkap

2. **Pilih Ekspedisi**
   - Tentukan jenis pengiriman (JNE, JNT, SiCepat, Antar Sendiri)
   - Kirim barang ke ekspedisi atau antar langsung

3. **Input Info Pengiriman**
   - Buka detail pesanan
   - Pilih jenis ekspedisi
   - Masukkan nomor resi (jika ada)
   - Klik "Update Pengiriman"
   - Status otomatis berubah ke "Dikirim"

4. **Email Tracking Terkirim**
   - Sistem otomatis kirim email info pengiriman ke customer
   - Email berisi jenis ekspedisi dan nomor resi

### Fitur Tambahan

#### Link WhatsApp Otomatis

- Setelah input ongkir, sistem generate link WhatsApp
- Link berisi detail pesanan dan info pembayaran
- Bisa langsung dikirim ke customer

#### Analytics Pesanan

- Dashboard menampilkan statistik pesanan
- Revenue 30 hari terakhir
- Jumlah pesanan per status
- Produk terlaris
- Trend penjualan harian

---

## Alur Transaksi Lengkap

### Gambaran Umum Proses

Berikut adalah alur lengkap dari customer pesan hingga barang diterima:

### Tahap 1: Customer Membuat Pesanan

**Yang Terjadi:**

- Customer pilih produk dan masukkan ke keranjang
- Isi data pengiriman (nama, email, telepon, alamat lengkap)
- Sistem buat pesanan dengan ID unik (INV-YYYY-XXXX)
- Status awal: "Menunggu Ongkir"

**Email yang Dikirim:**

- **Ke Customer**: Invoice awal (belum ada ongkir)
- **Ke Admin**: Notifikasi pesanan baru masuk

**Tugas Admin:**

- Cek email notifikasi pesanan baru
- Siap-siap hitung ongkos kirim

### Tahap 2: Admin Input Ongkos Kirim

**Yang Harus Dilakukan Admin:**

1. **Buka Halaman Pesanan**
   - Login ke admin panel
   - Klik menu "Pesanan"
   - Cari pesanan dengan status "Menunggu Ongkir"

2. **Hitung Ongkir**
   - Lihat alamat customer
   - Cek tarif ekspedisi ke daerah tersebut
   - Tentukan ongkos kirim yang sesuai

3. **Input ke Sistem**
   - Klik "Lihat" pada pesanan
   - Masukkan nominal ongkir
   - Klik "Update Ongkir"

**Yang Terjadi Otomatis:**

- Status berubah ke "Menunggu Pembayaran"
- Total tagihan = harga produk + ongkir
- Email tagihan final dikirim ke customer
- Link WhatsApp tersedia untuk dikirim ke customer

### Tahap 3: Customer Melakukan Pembayaran

**Yang Terjadi:**

- Customer terima email dengan detail rekening bank
- Customer transfer sesuai total tagihan
- Customer upload bukti transfer di website
- Admin terima email notifikasi bukti bayar

**Tugas Admin:**

- Cek email notifikasi bukti bayar
- Verifikasi pembayaran di rekening bank
- Update status pesanan

### Tahap 4: Admin Verifikasi Pembayaran

**Yang Harus Dilakukan Admin:**

1. **Cek Bukti Bayar**
   - Buka email notifikasi atau detail pesanan
   - Lihat foto bukti transfer
   - Cocokkan nominal dan waktu transfer

2. **Verifikasi di Bank**
   - Cek mutasi rekening bank
   - Pastikan uang sudah masuk

3. **Update Status**
   - Jika pembayaran valid, ubah status ke "Diproses"
   - Jika ada masalah, hubungi customer

### Tahap 5: Admin Proses Pengiriman

**Yang Harus Dilakukan Admin:**

1. **Siapkan Barang**
   - Ambil produk sesuai pesanan
   - Kemas dengan baik dan aman
   - Beri label alamat pengiriman

2. **Kirim Barang**
   - Antar ke kantor ekspedisi (JNE, JNT, dll.)
   - Atau antar langsung jika dalam kota
   - Simpan nomor resi dari ekspedisi

3. **Update Sistem**
   - Input jenis ekspedisi
   - Input nomor resi (jika ada)
   - Ubah status ke "Dikirim"

**Yang Terjadi Otomatis:**

- Email tracking dikirim ke customer
- Link WhatsApp tracking tersedia

### Tahap 6: Customer Terima Barang

**Yang Terjadi:**

- Customer terima barang dari ekspedisi
- Customer bisa konfirmasi penerimaan di website
- Status berubah ke "Selesai"
- Admin terima email konfirmasi

### Ringkasan Tugas Admin Per Status

| Status Pesanan          | Tugas Admin            | Email yang Diterima     |
| ----------------------- | ---------------------- | ----------------------- |
| **Menunggu Ongkir**     | Input ongkos kirim     | Notifikasi pesanan baru |
| **Menunggu Pembayaran** | Tunggu bukti bayar     | -                       |
| **Diproses**            | Siapkan & kirim barang | Notifikasi bukti bayar  |
| **Dikirim**             | Pantau pengiriman      | -                       |
| **Selesai**             | Arsip pesanan          | Konfirmasi penerimaan   |

### Tips Mengelola Pesanan

#### Untuk Efisiensi:

- Cek email notifikasi secara rutin
- Proses pesanan berdasarkan urutan waktu
- Siapkan daftar tarif ongkir per daerah
- Gunakan template pesan WhatsApp

#### Untuk Akurasi:

- Selalu cocokkan bukti bayar dengan total tagihan
- Double check alamat sebelum kirim barang
- Simpan nomor resi dengan benar
- Foto barang sebelum dikemas (untuk dokumentasi)

#### Untuk Customer Service:

- Balas pertanyaan customer dengan cepat
- Berikan update status secara proaktif
- Gunakan bahasa yang sopan dan jelas
- Sediakan nomor WhatsApp untuk komunikasi

---

## Tips Umum Penggunaan Sistem

### Keamanan

- Selalu logout setelah selesai menggunakan sistem
- Jangan bagikan username dan password kepada orang lain
- Gunakan password yang kuat dan unik
- Jangan biarkan halaman admin terbuka tanpa pengawasan

### Backup Data

- Sistem otomatis menyimpan semua data pesanan dan produk
- Disarankan untuk menyimpan gambar produk di komputer sebagai backup
- Export data pesanan secara berkala untuk laporan

### Performa Optimal

- Gunakan browser terbaru (Chrome, Firefox, Safari)
- Pastikan koneksi internet stabil
- Tutup tab browser lain yang tidak perlu saat upload gambar
- Refresh halaman jika sistem terasa lambat

### Manajemen Pesanan Harian

- Cek email notifikasi pesanan baru setiap pagi
- Proses pesanan "Menunggu Ongkir" terlebih dahulu
- Verifikasi pembayaran maksimal 1x24 jam
- Update status pengiriman segera setelah barang dikirim
- Siapkan template pesan WhatsApp untuk komunikasi customer

### Bantuan Teknis

Jika mengalami kesulitan atau error:

1. Coba refresh halaman (F5)
2. Clear cache browser
3. Coba menggunakan browser lain
4. Periksa koneksi internet
5. Hubungi tim teknis untuk bantuan lebih lanjut

### Kontak Darurat

- **Email Teknis**: [email support]
- **WhatsApp Admin**: [nomor WhatsApp]
- **Jam Operasional**: Senin-Sabtu, 08:00-17:00 WIB

---

**© 2024 BIZPART24 - Panduan Admin Sistem Katalog Produk**
