# Flow Visual AI Shop Marketplace

Dokumen ini menjelaskan **alur utama platform AI Shop Marketplace** secara visual menggunakan diagram Mermaid.  
Fokus dokumen ini adalah **flow bisnis dan pengalaman pengguna**, bukan coding, database, atau teknis pemrograman.

Platform yang direncanakan bukan hanya untuk jual-beli barang, tetapi juga untuk:

1. Jualan produk.
2. Freelance atau jasa.
3. Sewa/rental barang atau layanan.
4. Pembayaran melalui platform.
5. Dana ditahan sementara sampai transaksi aman.
6. Saldo masuk ke penjual/freelancer/pemilik sewa.
7. Withdraw atau pencairan uang.
8. Bantuan AI untuk mencari, memilih, membuat pesanan, dan membantu transaksi.

---

## 1. Gambaran Besar Platform

Flow besar platform ini dapat dipahami seperti ini:

```mermaid
flowchart TD
    A[Pengguna Masuk ke Platform] --> B{Pengguna Ingin Apa?}

    B --> C[Beli Produk]
    B --> D[Pesan Jasa/Freelance]
    B --> E[Sewa Barang atau Layanan]
    B --> F[Jual Produk]
    B --> G[Tawarkan Jasa]
    B --> H[Sewakan Barang]

    C --> I[Transaksi Produk]
    D --> J[Transaksi Jasa]
    E --> K[Transaksi Sewa]

    F --> L[Dashboard Penjual]
    G --> M[Dashboard Freelancer]
    H --> N[Dashboard Pemilik Sewa]

    I --> O[Pembayaran]
    J --> O
    K --> O

    O --> P[Dana Ditahan Sementara / Escrow]
    P --> Q{Transaksi Selesai?}

    Q -->|Ya| R[Dana Masuk ke Saldo Penjual/Freelancer/Pemilik Sewa]
    Q -->|Ada Masalah| S[Komplain / Dispute]

    S --> T[Admin Meninjau Masalah]
    T --> U{Keputusan Admin}
    U -->|Lanjutkan| R
    U -->|Refund| V[Dana Dikembalikan ke Pembeli]

    R --> W[Pengguna Ajukan Withdraw]
    W --> X[Admin Verifikasi Withdraw]
    X --> Y[Uang Ditransfer ke Rekening]
```

### Penjelasan Sederhana

Platform ini bekerja seperti pusat transaksi. Pembeli bisa membeli produk, memesan jasa, atau menyewa barang. Setelah pembeli membayar, uang tidak langsung diberikan ke penjual. Uang ditahan dulu oleh sistem sampai transaksi selesai dengan aman. Setelah transaksi selesai, dana masuk ke saldo pihak penyedia. Setelah itu, penyedia bisa mengajukan withdraw.

---

## 2. Role Pengguna dalam Platform

Di dalam platform ini ada beberapa jenis pengguna.

```mermaid
flowchart TD
    A[User / Pengguna] --> B[Buyer / Pembeli]
    A --> C[Seller / Penjual Produk]
    A --> D[Freelancer / Penyedia Jasa]
    A --> E[Rental Owner / Pemilik Barang Sewa]
    A --> F[Admin Platform]

    B --> B1[Mencari produk, jasa, atau sewa]
    B --> B2[Membayar transaksi]
    B --> B3[Memberi rating dan ulasan]

    C --> C1[Upload produk]
    C --> C2[Menerima pesanan]
    C --> C3[Mendapat saldo setelah transaksi selesai]

    D --> D1[Upload layanan jasa]
    D --> D2[Mengerjakan pesanan]
    D --> D3[Mengirim hasil kerja]

    E --> E1[Upload barang sewa]
    E --> E2[Mengelola jadwal sewa]
    E --> E3[Menerima pengembalian barang]

    F --> F1[Memantau pengguna]
    F --> F2[Memantau transaksi]
    F --> F3[Menyelesaikan komplain]
    F --> F4[Menyetujui withdraw]
```

### Penjelasan Sederhana

Satu akun pengguna bisa memiliki beberapa fungsi. Misalnya, seseorang bisa menjadi pembeli sekaligus penjual. Namun, untuk keamanan, fitur menjual, menawarkan jasa, menyewakan barang, dan withdraw sebaiknya membutuhkan verifikasi tambahan.

---

## 3. Flow Utama untuk Pembeli

Pembeli adalah pengguna yang ingin membeli produk, memesan jasa, atau menyewa barang.

```mermaid
flowchart TD
    A[Pembeli Buka Platform] --> B{Mencari Apa?}

    B --> C[Produk]
    B --> D[Jasa / Freelance]
    B --> E[Sewa / Rental]

    C --> F[Lihat Detail Produk]
    D --> G[Lihat Detail Jasa]
    E --> H[Lihat Detail Barang Sewa]

    F --> I{Cocok?}
    G --> I
    H --> I

    I -->|Tidak| J[Cari Lagi atau Tanya AI]
    J --> B

    I -->|Ya| K[Buat Pesanan]
    K --> L[Isi Detail Pesanan]
    L --> M[Bayar]
    M --> N[Dana Ditahan Sistem]
    N --> O[Penyedia Mengerjakan/Mengirim/Menyiapkan]
    O --> P[Pembeli Konfirmasi Selesai]
    P --> Q[Dana Dilepas ke Penyedia]
    Q --> R[Pembeli Memberi Rating]
```

### Penjelasan Sederhana

Pembeli tidak harus bingung memilih. Jika belum tahu produk, jasa, atau sewa yang cocok, pembeli bisa bertanya kepada AI. AI membantu memberikan rekomendasi, membandingkan pilihan, dan mengarahkan pembeli ke transaksi yang sesuai.

---

## 4. Flow Jual-Beli Produk

Flow ini digunakan ketika pengguna membeli barang fisik atau produk digital.

```mermaid
flowchart TD
    A[Pembeli Pilih Produk] --> B[Lihat Harga, Stok, Deskripsi, dan Rating]
    B --> C{Ingin Beli?}

    C -->|Tidak| D[Kembali Cari Produk]
    C -->|Ya| E[Masukkan ke Keranjang / Order Langsung]

    E --> F[Isi Alamat atau Detail Pengiriman]
    F --> G[Pilih Metode Pembayaran]
    G --> H[Pembeli Membayar]
    H --> I[Sistem Menahan Dana]
    I --> J[Penjual Mendapat Notifikasi Pesanan]
    J --> K[Penjual Menyiapkan Produk]
    K --> L[Penjual Mengirim Produk]
    L --> M[Pembeli Menerima Produk]
    M --> N{Produk Sesuai?}

    N -->|Ya| O[Pembeli Konfirmasi Selesai]
    O --> P[Dana Masuk ke Saldo Penjual]
    P --> Q[Pembeli Beri Rating]

    N -->|Tidak| R[Pembeli Ajukan Komplain]
    R --> S[Admin Meninjau]
    S --> T{Keputusan}
    T -->|Refund| U[Dana Kembali ke Pembeli]
    T -->|Lanjutkan ke Penjual| P
```

### Contoh Kasus

Pembeli membeli headset seharga Rp150.000. Setelah pembayaran berhasil, dana belum langsung masuk ke penjual. Penjual mengirim barang. Setelah pembeli menerima barang dan menekan tombol selesai, dana baru masuk ke saldo penjual.

---

## 5. Flow Freelance / Jasa

Flow ini digunakan untuk layanan seperti desain logo, edit video, pembuatan website, penulisan artikel, admin sosial media, dan jasa lainnya.

```mermaid
flowchart TD
    A[Pembeli Cari Jasa] --> B[AI atau Search Membantu Menemukan Freelancer]
    B --> C[Pembeli Lihat Paket Jasa]
    C --> D[Lihat Harga, Deadline, Revisi, dan Portofolio]
    D --> E{Cocok?}

    E -->|Tidak| F[Cari Freelancer Lain]
    F --> B

    E -->|Ya| G[Pembeli Buat Pesanan Jasa]
    G --> H[Isi Brief / Kebutuhan]
    H --> I[Pembeli Membayar]
    I --> J[Dana Ditahan Sistem]
    J --> K[Freelancer Menerima Pesanan]
    K --> L[Freelancer Mengerjakan]
    L --> M[Freelancer Mengirim Hasil]
    M --> N[Pembeli Review Hasil]

    N --> O{Hasil Sesuai?}
    O -->|Revisi| P[Pembeli Minta Revisi]
    P --> L

    O -->|Ya| Q[Pembeli Konfirmasi Selesai]
    Q --> R[Dana Masuk ke Saldo Freelancer]
    R --> S[Pembeli Memberi Rating]

    O -->|Tidak Ada Kesepakatan| T[Komplain / Dispute]
    T --> U[Admin Menilai Bukti]
    U --> V{Keputusan Admin}
    V -->|Dana ke Freelancer| R
    V -->|Refund ke Pembeli| W[Dana Dikembalikan]
```

### Penjelasan Sederhana

Freelance berbeda dengan jual produk karena yang dikirim bukan barang, tetapi hasil kerja. Karena itu, perlu ada brief, deadline, revisi, file hasil kerja, dan persetujuan pembeli sebelum dana dilepas.

---

## 6. Flow Sewa / Rental

Flow ini digunakan untuk penyewaan barang, tempat, alat, kendaraan, kamera, laptop, ruangan, atau layanan berbasis waktu.

```mermaid
flowchart TD
    A[Penyewa Cari Barang Sewa] --> B[Lihat Detail Barang]
    B --> C[Lihat Harga Sewa dan Deposit]
    C --> D[Pilih Tanggal Mulai dan Selesai]
    D --> E[Sistem Mengecek Ketersediaan]

    E --> F{Tersedia?}
    F -->|Tidak| G[Pilih Tanggal Lain]
    G --> D

    F -->|Ya| H[Penyewa Membuat Booking]
    H --> I[Penyewa Membayar Biaya Sewa dan Deposit]
    I --> J[Dana Ditahan Sistem]
    J --> K[Pemilik Sewa Menyiapkan Barang]
    K --> L[Barang Diserahkan atau Dikirim]
    L --> M[Masa Sewa Berjalan]
    M --> N[Penyewa Mengembalikan Barang]
    N --> O[Pemilik Mengecek Kondisi Barang]

    O --> P{Barang Aman?}
    P -->|Ya| Q[Transaksi Selesai]
    Q --> R[Biaya Sewa Masuk ke Saldo Pemilik]
    R --> S[Deposit Dikembalikan ke Penyewa]

    P -->|Rusak / Terlambat| T[Potongan Deposit atau Komplain]
    T --> U[Admin Meninjau Bukti]
    U --> V{Keputusan Admin}
    V -->|Potong Deposit| W[Deposit Dipotong Sesuai Ketentuan]
    V -->|Deposit Dikembalikan| S
```

### Penjelasan Sederhana

Sewa membutuhkan kalender ketersediaan, tanggal mulai, tanggal selesai, deposit, bukti kondisi barang, dan aturan jika barang rusak atau terlambat dikembalikan.

---

## 7. Flow AI Assistant

AI Assistant menjadi pembeda utama platform ini. AI tidak hanya menjawab pertanyaan, tetapi membantu pengguna sampai menemukan pilihan yang tepat.

```mermaid
flowchart TD
    A[Pengguna Bertanya ke AI] --> B{Jenis Pertanyaan}

    B --> C[Mencari Produk]
    B --> D[Mencari Jasa]
    B --> E[Mencari Barang Sewa]
    B --> F[Membandingkan Pilihan]
    B --> G[Membantu Membuat Pesanan]
    B --> H[Membantu Penjual Membuat Deskripsi]

    C --> I[AI Menampilkan Rekomendasi Produk]
    D --> J[AI Menampilkan Freelancer/Jasa]
    E --> K[AI Menampilkan Barang Sewa]
    F --> L[AI Membandingkan Harga, Rating, dan Kebutuhan]
    G --> M[AI Membantu Mengisi Detail Order]
    H --> N[AI Membuat Judul, Deskripsi, dan Saran Harga]

    I --> O[Pengguna Pilih]
    J --> O
    K --> O
    L --> O
    M --> P[Pesanan Dibuat]
    N --> Q[Listing Siap Dipublikasikan]

    O --> R{Lanjut Transaksi?}
    R -->|Ya| P
    R -->|Tidak| S[Pengguna Bertanya Lagi]
    S --> A
```

### Contoh Pertanyaan ke AI

- “Aku butuh desain logo untuk usaha kopi, budget 200 ribu.”
- “Cari laptop bekas untuk desain ringan.”
- “Aku mau sewa kamera untuk 3 hari.”
- “Bandingkan jasa edit video yang murah tapi rating bagus.”
- “Bantu buat deskripsi produk kaos polos.”

---

## 8. Flow Pembayaran dan Escrow

Escrow adalah sistem penahanan dana sementara. Tujuannya agar pembeli dan penyedia sama-sama aman.

```mermaid
flowchart TD
    A[Pembeli Membuat Pesanan] --> B[Pembeli Melakukan Pembayaran]
    B --> C{Pembayaran Berhasil?}

    C -->|Tidak| D[Pesanan Belum Diproses]
    D --> E[Pembeli Bisa Coba Bayar Lagi]

    C -->|Ya| F[Dana Masuk ke Sistem]
    F --> G[Dana Ditahan Sementara]
    G --> H[Penyedia Mulai Memproses Pesanan]
    H --> I{Pesanan Selesai?}

    I -->|Belum| J[Dana Tetap Ditahan]
    J --> H

    I -->|Ya| K[Pembeli Konfirmasi Selesai]
    K --> L[Sistem Menghitung Komisi Platform]
    L --> M[Dana Bersih Masuk ke Saldo Penyedia]

    I -->|Bermasalah| N[Komplain / Dispute]
    N --> O[Admin Menentukan Dana ke Siapa]
```

### Penjelasan Sederhana

Pembayaran berhasil tidak berarti uang langsung diberikan ke penjual. Uang ditahan dulu agar jika ada masalah, sistem masih bisa mengatur pengembalian dana atau penyelesaian komplain.

---

## 9. Flow Saldo / Wallet

Saldo adalah tempat uang milik penjual, freelancer, atau pemilik sewa setelah transaksi selesai.

```mermaid
flowchart TD
    A[Transaksi Selesai] --> B[Sistem Menghitung Dana Bersih]
    B --> C[Potong Komisi Platform]
    C --> D[Saldo Masuk ke Wallet Penyedia]
    D --> E{Saldo Mau Diambil?}

    E -->|Tidak| F[Saldo Tetap di Wallet]
    F --> G[Bisa Digunakan untuk Transaksi Lain atau Disimpan]

    E -->|Ya| H[Ajukan Withdraw]
    H --> I[Isi Data Rekening / E-Wallet]
    I --> J[Menunggu Verifikasi Admin]
    J --> K{Disetujui?}

    K -->|Ya| L[Admin Transfer Dana]
    L --> M[Status Withdraw Berhasil]

    K -->|Tidak| N[Withdraw Ditolak]
    N --> O[Saldo Dikembalikan ke Wallet]
```

### Penjelasan Sederhana

Saldo tidak boleh hanya berupa angka biasa. Setiap uang masuk dan keluar harus punya riwayat. Ini penting supaya pengguna percaya dan admin bisa mengecek jika terjadi masalah.

---

## 10. Flow Withdraw

Withdraw adalah proses pencairan saldo dari platform ke rekening pengguna.

```mermaid
flowchart TD
    A[Penyedia Membuka Menu Wallet] --> B[Lihat Saldo Tersedia]
    B --> C{Saldo Cukup?}

    C -->|Tidak| D[Tidak Bisa Withdraw]
    D --> E[Menunggu Saldo Bertambah]

    C -->|Ya| F[Klik Ajukan Withdraw]
    F --> G[Masukkan Nominal]
    G --> H[Pilih Rekening / E-Wallet Tujuan]
    H --> I[Kirim Permintaan]
    I --> J[Status: Pending]
    J --> K[Admin Mengecek Data]
    K --> L{Valid?}

    L -->|Tidak| M[Withdraw Ditolak]
    M --> N[Saldo Dikembalikan]

    L -->|Ya| O[Admin Transfer Dana]
    O --> P[Upload / Catat Bukti Transfer]
    P --> Q[Status: Berhasil]
    Q --> R[Pengguna Menerima Uang]
```

### Hal yang Perlu Diperhatikan

Withdraw harus aman karena berhubungan langsung dengan uang pengguna. Minimal harus ada status pending, approved, rejected, dan paid/berhasil.

---

## 11. Flow Komplain / Dispute

Komplain terjadi ketika pembeli merasa produk, jasa, atau sewa tidak sesuai.

```mermaid
flowchart TD
    A[Pembeli Mengalami Masalah] --> B[Buka Menu Komplain]
    B --> C[Pilih Transaksi yang Bermasalah]
    C --> D[Tulis Alasan Komplain]
    D --> E[Upload Bukti Foto / File / Chat]
    E --> F[Komplain Masuk ke Admin]

    F --> G[Admin Mengecek Bukti Pembeli]
    G --> H[Admin Mengecek Bukti Penyedia]
    H --> I{Keputusan Admin}

    I -->|Pembeli Benar| J[Refund ke Pembeli]
    I -->|Penyedia Benar| K[Dana Dilepas ke Penyedia]
    I -->|Butuh Kesepakatan| L[Admin Memediasi]

    L --> M{Hasil Mediasi}
    M -->|Sepakat Refund Sebagian| N[Dana Dibagi]
    M -->|Sepakat Lanjut| K
    M -->|Batal Transaksi| J
```

### Penjelasan Sederhana

Dispute adalah fitur penting agar platform terlihat profesional. Tanpa dispute, pembeli takut membayar dan penyedia juga takut tidak dibayar.

---

## 12. Flow Admin Platform

Admin bertugas menjaga keamanan dan kelancaran transaksi.

```mermaid
flowchart TD
    A[Admin Login] --> B[Dashboard Admin]

    B --> C[Kelola Pengguna]
    B --> D[Kelola Listing]
    B --> E[Kelola Transaksi]
    B --> F[Kelola Komplain]
    B --> G[Kelola Withdraw]
    B --> H[Kelola Kategori]
    B --> I[Kelola Laporan]

    C --> C1[Verifikasi Penjual/Freelancer/Pemilik Sewa]
    C --> C2[Blokir Akun Bermasalah]

    D --> D1[Review Produk/Jasa/Sewa]
    D --> D2[Hapus Listing Melanggar Aturan]

    E --> E1[Pantau Status Order]
    E --> E2[Cek Pembayaran]

    F --> F1[Review Bukti Komplain]
    F --> F2[Putuskan Refund atau Release Dana]

    G --> G1[Cek Permintaan Withdraw]
    G --> G2[Setujui atau Tolak Withdraw]

    H --> H1[Tambah Kategori]
    H --> H2[Rapikan Kategori]

    I --> I1[Laporan Transaksi]
    I --> I2[Laporan Pendapatan Platform]
    I --> I3[Laporan Pengguna Bermasalah]
```

### Penjelasan Sederhana

Admin bukan hanya mengatur produk. Admin juga menjaga agar transaksi tidak kacau, withdraw aman, dan komplain dapat diselesaikan dengan adil.

---

## 13. Flow Penjual Produk

```mermaid
flowchart TD
    A[Penjual Daftar / Login] --> B[Lengkapi Profil Penjual]
    B --> C[Ajukan Verifikasi Jika Diperlukan]
    C --> D{Disetujui?}

    D -->|Tidak| E[Perbaiki Data]
    E --> C

    D -->|Ya| F[Buka Dashboard Penjual]
    F --> G[Tambah Produk]
    G --> H[Isi Nama, Harga, Stok, Foto, Deskripsi]
    H --> I[Publikasikan Produk]
    I --> J[Produk Tampil di Marketplace]
    J --> K[Menerima Pesanan]
    K --> L[Proses dan Kirim Produk]
    L --> M[Transaksi Selesai]
    M --> N[Saldo Masuk]
    N --> O[Bisa Ajukan Withdraw]
```

---

## 14. Flow Freelancer

```mermaid
flowchart TD
    A[Freelancer Daftar / Login] --> B[Lengkapi Profil dan Portofolio]
    B --> C[Buat Paket Jasa]
    C --> D[Isi Harga, Waktu Pengerjaan, Revisi, dan Contoh Karya]
    D --> E[Publikasikan Jasa]
    E --> F[Jasa Tampil di Marketplace]
    F --> G[Menerima Pesanan]
    G --> H[Membaca Brief dari Pembeli]
    H --> I[Mengerjakan Pesanan]
    I --> J[Mengirim Hasil]
    J --> K{Pembeli Setuju?}

    K -->|Minta Revisi| L[Freelancer Revisi]
    L --> J

    K -->|Setuju| M[Transaksi Selesai]
    M --> N[Saldo Masuk]
    N --> O[Bisa Ajukan Withdraw]
```

---

## 15. Flow Pemilik Barang Sewa

```mermaid
flowchart TD
    A[Pemilik Sewa Daftar / Login] --> B[Isi Profil]
    B --> C[Tambah Barang Sewa]
    C --> D[Isi Foto, Harga Sewa, Deposit, Lokasi, dan Aturan]
    D --> E[Atur Ketersediaan Tanggal]
    E --> F[Publikasikan Barang Sewa]
    F --> G[Barang Tampil di Marketplace]
    G --> H[Menerima Booking]
    H --> I[Menyiapkan Barang]
    I --> J[Serah Terima Barang]
    J --> K[Masa Sewa Berjalan]
    K --> L[Barang Dikembalikan]
    L --> M[Cek Kondisi Barang]
    M --> N{Aman?}

    N -->|Ya| O[Transaksi Selesai]
    O --> P[Saldo Sewa Masuk]
    P --> Q[Deposit Penyewa Dikembalikan]

    N -->|Tidak| R[Ajukan Potongan Deposit / Komplain]
    R --> S[Admin Meninjau]
```

---

## 16. Urutan Pengembangan yang Disarankan

Agar tidak bingung, pengembangan platform sebaiknya tidak langsung dibuat semuanya sekaligus. Urutannya bisa seperti ini:

```mermaid
flowchart LR
    A[Tahap 1: Rapikan AI Shop Produk] --> B[Tahap 2: Multi-Seller]
    B --> C[Tahap 3: Pembayaran Aman dan Escrow]
    C --> D[Tahap 4: Wallet dan Saldo]
    D --> E[Tahap 5: Withdraw]
    E --> F[Tahap 6: Freelance / Jasa]
    F --> G[Tahap 7: Rental / Sewa]
    G --> H[Tahap 8: Dispute, Rating, dan AI Lanjutan]
```

### Penjelasan Prioritas

Tahap pertama jangan langsung mengejar semua fitur. Mulailah dari produk dan multi-seller. Setelah transaksi produk stabil, baru tambah wallet dan withdraw. Setelah sistem uang aman, barulah masuk ke freelance dan rental.

---

## 17. Flow MVP Paling Awal

MVP adalah versi awal yang paling sederhana tetapi sudah bisa digunakan.

```mermaid
flowchart TD
    A[User Daftar] --> B[Pilih Role: Pembeli atau Penjual]
    B --> C[Penjual Upload Produk]
    C --> D[Produk Tampil]
    D --> E[Pembeli Bertanya ke AI]
    E --> F[AI Merekomendasikan Produk]
    F --> G[Pembeli Membuat Order]
    G --> H[Pembeli Membayar]
    H --> I[Penjual Memproses Pesanan]
    I --> J[Pembeli Konfirmasi Selesai]
    J --> K[Saldo Masuk ke Penjual]
    K --> L[Penjual Ajukan Withdraw Manual]
    L --> M[Admin Transfer Manual]
```

### MVP yang Masuk Akal

Untuk versi awal, fitur yang paling penting adalah:

1. User bisa daftar dan login.
2. Penjual bisa upload produk.
3. Pembeli bisa mencari produk lewat AI.
4. Pembeli bisa membuat pesanan.
5. Pembeli bisa membayar.
6. Dana masuk ke sistem dulu.
7. Penjual menerima saldo setelah transaksi selesai.
8. Withdraw bisa diajukan dan diproses admin secara manual.

---

## 18. Flow Versi Lengkap Setelah Dikembangkan

```mermaid
flowchart TD
    A[AI Shop Marketplace] --> B[Produk]
    A --> C[Jasa / Freelance]
    A --> D[Sewa / Rental]
    A --> E[AI Assistant]
    A --> F[Wallet dan Withdraw]
    A --> G[Admin Control]

    B --> B1[Beli Produk]
    B --> B2[Jual Produk]
    B --> B3[Pengiriman]
    B --> B4[Rating Produk]

    C --> C1[Pesan Jasa]
    C --> C2[Tawarkan Jasa]
    C --> C3[Brief dan Revisi]
    C --> C4[Delivery File]

    D --> D1[Sewa Barang]
    D --> D2[Sewakan Barang]
    D --> D3[Kalender Sewa]
    D --> D4[Deposit dan Pengembalian]

    E --> E1[Rekomendasi Produk]
    E --> E2[Rekomendasi Jasa]
    E --> E3[Rekomendasi Sewa]
    E --> E4[Bantu Buat Listing]
    E --> E5[Bantu Buat Order]

    F --> F1[Saldo Pending]
    F --> F2[Saldo Tersedia]
    F --> F3[Withdraw]
    F --> F4[Riwayat Mutasi]

    G --> G1[Verifikasi User]
    G --> G2[Moderasi Listing]
    G --> G3[Kelola Transaksi]
    G --> G4[Kelola Komplain]
    G --> G5[Setujui Withdraw]
```

---

## 19. Contoh Alur Lengkap dari Awal sampai Withdraw

Contoh: seseorang membeli jasa desain logo.

```mermaid
sequenceDiagram
    participant Pembeli
    participant AI
    participant Platform
    participant Freelancer
    participant Admin

    Pembeli->>AI: Saya butuh desain logo budget 200 ribu
    AI->>Platform: Cari jasa desain logo yang cocok
    Platform->>Pembeli: Tampilkan rekomendasi freelancer
    Pembeli->>Platform: Pilih freelancer dan buat order
    Pembeli->>Platform: Bayar Rp200.000
    Platform->>Platform: Dana ditahan sementara
    Platform->>Freelancer: Notifikasi pesanan baru
    Freelancer->>Pembeli: Minta detail brief
    Pembeli->>Freelancer: Kirim brief logo
    Freelancer->>Platform: Upload hasil desain
    Platform->>Pembeli: Hasil dikirim untuk dicek
    Pembeli->>Platform: Konfirmasi selesai
    Platform->>Platform: Potong komisi platform
    Platform->>Freelancer: Saldo masuk
    Freelancer->>Platform: Ajukan withdraw
    Platform->>Admin: Permintaan withdraw masuk
    Admin->>Freelancer: Transfer dana dan ubah status berhasil
```

---

## 20. Kesimpulan Flow

Platform ini sebaiknya dibangun dengan prinsip berikut:

1. Pengguna mudah mencari produk, jasa, atau sewa dengan bantuan AI.
2. Pembeli membayar melalui platform agar transaksi aman.
3. Dana ditahan dulu sampai transaksi selesai.
4. Penyedia menerima saldo setelah transaksi dinyatakan selesai.
5. Withdraw dilakukan setelah saldo tersedia.
6. Admin menjadi penjaga keamanan transaksi, komplain, dan pencairan dana.
7. AI menjadi asisten utama, bukan hanya chatbot biasa.

Dengan flow ini, platform tidak hanya menjadi toko online, tetapi berkembang menjadi **AI Marketplace Multi-Layanan** yang bisa melayani jual-beli, freelance, sewa, dan sistem pencairan uang.
