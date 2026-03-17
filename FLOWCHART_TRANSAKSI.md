# Flowchart Kegiatan Transaksi BIZPART24

## Diagram Alur Transaksi Lengkap

```mermaid
flowchart TD
    A[Customer Browse Produk] --> B[Customer Pilih Produk]
    B --> C[Tambah ke Keranjang]
    C --> D[Checkout - Isi Data Pengiriman]
    D --> E[Submit Pesanan]
    E --> F[Sistem Buat Invoice<br/>Status: Menunggu Ongkir]

    F --> G[Email ke Admin:<br/>Notifikasi Pesanan Baru]
    F --> H[Email ke Customer:<br/>Invoice Awal tanpa Ongkir]

    G --> I[Admin Login ke Panel]
    I --> J[Admin Lihat Detail Pesanan]
    J --> K[Admin Hitung Ongkos Kirim]
    K --> L[Admin Input Ongkir ke Sistem]
    L --> M[Status: Menunggu Pembayaran]

    M --> N[Email ke Customer:<br/>Tagihan Final + Rekening Bank]
    M --> O[Generate Link WhatsApp<br/>untuk Admin]

    N --> P[Customer Terima Email Tagihan]
    P --> Q[Customer Transfer Pembayaran]
    Q --> R[Customer Upload Bukti Bayar]
    R --> S[Email ke Admin:<br/>Notifikasi Bukti Bayar]

    S --> T[Admin Cek Bukti Transfer]
    T --> U{Pembayaran Valid?}

    U -->|Ya| V[Admin Update Status:<br/>Diproses]
    U -->|Tidak| W[Admin Hubungi Customer<br/>via WhatsApp]
    W --> Q

    V --> X[Admin Siapkan Barang]
    X --> Y[Admin Kemas Produk]
    Y --> Z[Admin Kirim via Ekspedisi<br/>atau Antar Langsung]
    Z --> AA[Admin Input Info Pengiriman:<br/>Jenis Ekspedisi + Nomor Resi]
    AA --> BB[Status: Dikirim]

    BB --> CC[Email ke Customer:<br/>Info Tracking Pengiriman]
    CC --> DD[Customer Terima Barang]
    DD --> EE[Customer Konfirmasi Penerimaan<br/>di Website opsional]
    EE --> FF[Status: Selesai]

    FF --> GG[Email ke Admin:<br/>Konfirmasi Transaksi Selesai]
    GG --> HH[End: Transaksi Berhasil]

    %% Styling
    classDef customerAction fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef adminAction fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef systemAction fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef emailAction fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef decision fill:#ffebee,stroke:#c62828,stroke-width:2px

    class A,B,C,D,E,P,Q,R,DD,EE customerAction
    class I,J,K,L,T,V,W,X,Y,Z,AA adminAction
    class F,M,BB,FF systemAction
    class G,H,N,S,CC,GG emailAction
    class U decision
```

## Penjelasan Status Pesanan

```mermaid
stateDiagram-v2
    [*] --> MenungguOngkir : Customer Submit Pesanan
    MenungguOngkir --> MenungguPembayaran : Admin Input Ongkir
    MenungguPembayaran --> Diproses : Admin Verifikasi Pembayaran
    MenungguPembayaran --> Batal : Pembayaran Tidak Valid/Timeout
    Diproses --> Dikirim : Admin Kirim Barang
    Dikirim --> Selesai : Customer Terima Barang

    note right of MenungguOngkir
        Status Awal
        Warna: Abu-abu
        Tugas: Admin hitung ongkir
    end note

    note right of MenungguPembayaran
        Warna: Kuning
        Tugas: Customer bayar
    end note

    note right of Diproses
        Warna: Biru
        Tugas: Admin siapkan barang
    end note

    note right of Dikirim
        Warna: Ungu
        Tugas: Pantau pengiriman
    end note

    note right of Selesai
        Warna: Hijau
        Status: Transaksi selesai
    end note

    note right of Batal
        Warna: Merah
        Status: Dibatalkan
    end note
```

## Timeline Email Notifications

```mermaid
sequenceDiagram
    participant C as Customer
    participant S as Sistem
    participant A as Admin

    Note over C,A: Tahap 1: Pembuatan Pesanan
    C->>S: Submit Pesanan
    S->>C: Email: Invoice Awal (tanpa ongkir)
    S->>A: Email: Notifikasi Pesanan Baru

    Note over C,A: Tahap 2: Input Ongkir
    A->>S: Input Ongkos Kirim
    S->>C: Email: Tagihan Final + Rekening Bank

    Note over C,A: Tahap 3: Pembayaran
    C->>S: Upload Bukti Bayar
    S->>A: Email: Notifikasi Bukti Bayar

    Note over C,A: Tahap 4: Pengiriman
    A->>S: Update Status Dikirim + Resi
    S->>C: Email: Info Tracking Pengiriman

    Note over C,A: Tahap 5: Selesai
    C->>S: Konfirmasi Penerimaan (Opsional)
    S->>A: Email: Konfirmasi Transaksi Selesai
```

## Flowchart Tugas Admin per Status

```mermaid
flowchart LR
    A[Login Admin Panel] --> B[Cek Menu Pesanan]
    B --> C{Ada Pesanan Baru?}

    C -->|Ya| D[Status: Menunggu Ongkir]
    C -->|Tidak| E[Cek Status Lain]

    D --> F[Lihat Alamat Customer]
    F --> G[Hitung Ongkir Ekspedisi]
    G --> H[Input Ongkir ke Sistem]
    H --> I[Kirim Link WhatsApp ke Customer]

    E --> J{Ada Bukti Bayar?}
    J -->|Ya| K[Status: Menunggu Pembayaran]
    J -->|Tidak| L{Ada yang Diproses?}

    K --> M[Cek Bukti Transfer]
    M --> N[Verifikasi di Bank]
    N --> O[Update Status: Diproses]

    L -->|Ya| P[Status: Diproses]
    L -->|Tidak| Q[Selesai untuk Hari Ini]

    P --> R[Siapkan Barang]
    R --> S[Kemas Produk]
    S --> T[Kirim via Ekspedisi]
    T --> U[Input Nomor Resi]
    U --> V[Update Status: Dikirim]

    I --> B
    O --> B
    V --> B
    Q --> W[Logout]

    %% Styling
    classDef startEnd fill:#4caf50,stroke:#2e7d32,stroke-width:3px,color:#fff
    classDef process fill:#2196f3,stroke:#1565c0,stroke-width:2px,color:#fff
    classDef decision fill:#ff9800,stroke:#ef6c00,stroke-width:2px,color:#fff
    classDef status fill:#9c27b0,stroke:#6a1b9a,stroke-width:2px,color:#fff

    class A,W startEnd
    class F,G,H,I,M,N,O,R,S,T,U,V process
    class C,J,L decision
    class D,K,P status
```

## Checklist Harian Admin

```mermaid
flowchart TD
    A[Mulai Hari Kerja] --> B[Login Admin Panel]
    B --> C[Cek Email Notifikasi]
    C --> D[Buka Menu Pesanan]

    D --> E{Ada Status<br/>Menunggu Ongkir?}
    E -->|Ya| F[✓ Proses Input Ongkir]
    E -->|Tidak| G{Ada Bukti Bayar<br/>Baru?}

    F --> H[✓ Kirim Info ke Customer]
    H --> G

    G -->|Ya| I[✓ Verifikasi Pembayaran]
    G -->|Tidak| J{Ada Status<br/>Diproses?}

    I --> K[✓ Update Status]
    K --> J

    J -->|Ya| L[✓ Siapkan & Kirim Barang]
    J -->|Tidak| M{Ada Pertanyaan<br/>Customer?}

    L --> N[✓ Input Info Pengiriman]
    N --> M

    M -->|Ya| O[✓ Balas via WhatsApp]
    M -->|Tidak| P[✓ Selesai untuk Hari Ini]

    O --> P
    P --> Q[Logout Admin Panel]

    %% Styling
    classDef task fill:#4caf50,stroke:#2e7d32,stroke-width:2px,color:#fff
    classDef check fill:#ff9800,stroke:#ef6c00,stroke-width:2px,color:#fff
    classDef end fill:#f44336,stroke:#c62828,stroke-width:2px,color:#fff

    class F,H,I,K,L,N,O task
    class E,G,J,M check
    class A,Q end
```

## Keterangan Warna Status

| Status                  | Warna      | Keterangan               | Tugas Admin        |
| ----------------------- | ---------- | ------------------------ | ------------------ |
| **Menunggu Ongkir**     | 🔘 Abu-abu | Pesanan baru masuk       | Input ongkos kirim |
| **Menunggu Pembayaran** | 🟡 Kuning  | Ongkir sudah diinput     | Tunggu bukti bayar |
| **Diproses**            | 🔵 Biru    | Pembayaran terverifikasi | Siapkan barang     |
| **Dikirim**             | 🟣 Ungu    | Barang sudah dikirim     | Pantau pengiriman  |
| **Selesai**             | 🟢 Hijau   | Customer terima barang   | Arsip pesanan      |
| **Batal**               | 🔴 Merah   | Pesanan dibatalkan       | Tidak ada tindakan |

## Tips Efisiensi Workflow

### Prioritas Harian:

1. **Pagi**: Proses semua "Menunggu Ongkir"
2. **Siang**: Verifikasi "Menunggu Pembayaran"
3. **Sore**: Siapkan barang "Diproses"
4. **Malam**: Kirim barang dan update "Dikirim"

### Tools Pendukung:

- **Kalkulator Ongkir**: JNE, JNT, SiCepat
- **Template WhatsApp**: Pesan standar untuk customer
- **Checklist Harian**: Pastikan tidak ada yang terlewat
- **Backup Resi**: Simpan foto resi untuk dokumentasi

---

**© 2024 BIZPART24 - Flowchart Sistem Transaksi**
