# 🤖 AI Shop Assistant - Nuxt 4 & OpenRouter

Sebuah aplikasi toko AI cerdas yang memungkinkan pengguna untuk mencari produk, melakukan tawar-menawar harga secara real-time, dan melakukan pembayaran instan melalui chat.

![Status: Development](https://img.shields.io/badge/Status-Development-orange)
![Tech: Nuxt 4](https://img.shields.io/badge/Tech-Nuxt_4-00DC82)
![AI: OpenRouter](https://img.shields.io/badge/AI-OpenRouter-7c3aed)
![Payment: Midtrans](https://img.shields.io/badge/Payment-Midtrans-002E5D)

---

## ✨ Fitur Utama

- **🛒 Smart AI Chatbot**: Bertanya tentang produk menggunakan bahasa natural (Indonesian). AI terhubung langsung ke database stok.
- **🗂️ Persistent History & Context Memory**: Riwayat obrolan setiap user disimpan ke database. AI memiliki "Short-term Memory" (Sliding Window) yang presisi sehingga tetap ingat konteks meski user membalas pendek (misal: "Boleh deh yang itu").
- **🤝 Live Bargaining (Nego)**: Pengguna bisa menawar harga produk. AI akan memutuskan deal berdasarkan batas `minPrice` yang ditentukan admin.
- **💳 Midtrans Integration**: Checkout langsung di dalam chat. Setelah harga deal, AI akan menampilkan form order dan link pembayaran Snap Midtrans.
- **🔐 Authentication & Roles**: Sistem login aman dan terenkripsi menggunakan argon2id.
  - **Admin**: 
    - Bisa menambah produk tunggal melalui chat.
    - **[NEW] Bulk Excel/CSV Import**: Mengunggah file `.xlsx` atau `.csv` di kolom chat. Sistem pintar membaca variasi header kolom seperti *"Harga (IDR)"*, *"Nama Produk"*, atau *"Stok"*.
    - **[NEW] Category Management**: Memerintahkan AI untuk membuat kategori produk baru secara dinamis.
  - **User**: Bisa mencari, menawar, membeli produk, dan melanjutkan histori pesan pesanan.
- **🏠 Premium Landing Page**: Antarmuka modern dengan akses langsung ke fitur chat setelah login.
- **🌙 Dark Mode Design**: Tampilan premium dengan nuansa gelap dan efek *glassmorphism*.
- **📦 Docker Ready**: Aplikasi siap dideploy ke server menggunakan Docker & Docker Compose.

---

## 🛠️ Tech Stack

- **Frontend & Backend**: [Nuxt 4](https://nuxt.com/)
- **Database**: [MySQL](https://www.mysql.com/) + [Prisma ORM](https://www.prisma.io/)
- **AI Engine**: [OpenRouter API](https://openrouter.ai/) (Misal: openai/gpt-4o-mini, stepfun/step-3.5-flash)
- **Payment Gateway**: [Midtrans (Snap)](https://midtrans.com/)
- **Auth**: [nuxt-auth-utils](https://github.com/Atinux/nuxt-auth-utils)
- **File Parsing**: [ExcelJS](https://github.com/exceljs/exceljs) (untuk impor produk bulk)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)


---

## 🚀 Cara Instalasi (Lokal)

### 1. Clone & Install
```bash
git clone <repository-url>
cd project-ai
npm install
```

### 2. Konfigurasi Environment
Buat file `.env` dan isi variabel berikut:
```env
# Database (MySQL)
DATABASE_URL="mysql://user:pass@localhost:3306/ai_shop"

# AI Key (OpenRouter)
OPENROUTER_API_KEY="your_api_key_here"

# Midtrans (Sandbox)
MIDTRANS_SERVER_KEY="your_server_key"
MIDTRANS_CLIENT_KEY="your_client_key"
MIDTRANS_IS_PRODUCTION=false

# Session (Minimal 32 karakter)
NUXT_SESSION_PASSWORD="isi_dengan_32_karakter_acak_bebas"
```

### 3. Setup Database
```bash
npx prisma db push
npx prisma db seed
```

### 4. Jalankan Aplikasi
```bash
npm run dev
```

---

## 🐳 Deployment (Docker)

Jika ingin menjalankan aplikasi menggunakan Docker Compose:

1. Pastikan `.env` sudah dikonfigurasi.
2. Jalankan perintah:
```bash
docker-compose up --build -d
```
Aplikasi akan berjalan di port `3000`.

---

## 👤 Akun Demo Default (Dari Seeder)
- **Admin**: `admin@toko.com` | Password: `password`
- **User**: `user@toko.com` | Password: `password`
