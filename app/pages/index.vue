<template>
  <div class="min-h-screen bg-[#0a0a12] text-white font-sans overflow-x-hidden">

    <!-- Animated background blobs -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse" />
      <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
    </div>

    <!-- Navbar -->
    <nav class="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <span class="font-bold text-lg bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">AI Shop</span>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink v-if="loggedIn" to="/chat" class="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold hover:opacity-90 transition">
          Buka Chat →
        </NuxtLink>
        <template v-else>
          <NuxtLink to="/auth" class="text-sm text-zinc-400 hover:text-white transition">Masuk</NuxtLink>
          <NuxtLink to="/auth" class="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold hover:opacity-90 transition">
            Mulai Gratis
          </NuxtLink>
        </template>
      </div>
    </nav>

    <!-- Hero -->
    <section class="relative z-10 text-center px-6 pt-20 pb-24 max-w-4xl mx-auto">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
        AI-Powered Shopping Assistant
      </div>
      <h1 class="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
        Belanja Cerdas dengan
        <span class="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"> Kecerdasan AI</span>
      </h1>
      <p class="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
        Tanya, tawar harga, dan beli produk langsung lewat chat. AI kami memahami kebutuhanmu dan membantu mendapatkan harga terbaik.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <NuxtLink
          :to="loggedIn ? '/chat' : '/auth'"
          class="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-base hover:opacity-90 active:scale-95 transition shadow-lg shadow-violet-500/30"
        >
          {{ loggedIn ? 'Lanjutkan ke Chat →' : 'Mulai Sekarang — Gratis' }}
        </NuxtLink>
        <a href="#features" class="px-8 py-3.5 rounded-2xl border border-white/10 text-zinc-300 font-semibold text-base hover:bg-white/[0.04] transition">
          Lihat Fitur
        </a>
      </div>

      <!-- Hero Chat Preview -->
      <div class="mt-16 bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 text-left max-w-lg mx-auto shadow-2xl">
        <div class="flex flex-col gap-3">
          <div class="flex gap-2.5">
            <div class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-zinc-400 flex-shrink-0">AI</div>
            <div class="bg-white/[0.06] border border-white/[0.07] rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-zinc-300">
              Halo! Saya bisa bantu kamu cari produk, jawab pertanyaan, dan bahkan <strong class="text-white">nego harga</strong>! 🛍️
            </div>
          </div>
          <div class="flex gap-2.5 flex-row-reverse">
            <div class="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-[10px] text-white flex-shrink-0">U</div>
            <div class="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl rounded-tr-sm px-3 py-2 text-xs text-white">
              Harga MacBook Pro M3 bisa lebih murah gak?
            </div>
          </div>
          <div class="flex gap-2.5">
            <div class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-zinc-400 flex-shrink-0">AI</div>
            <div class="bg-white/[0.06] border border-white/[0.07] rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-zinc-300">
              Hmm, normalnya Rp 28.999.000... kalau mau, bisa saya kasih <strong class="text-violet-400">Rp 26.500.000</strong> khusus hari ini! Deal? 🤝
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="relative z-10 px-6 py-20 max-w-6xl mx-auto">
      <div class="text-center mb-14">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Semua yang Kamu Butuhkan</h2>
        <p class="text-zinc-500 text-lg max-w-xl mx-auto">Bukan sekedar chatbot — ini asisten belanja yang benar-benar mengerti kamu.</p>
      </div>
      <div class="grid md:grid-cols-3 gap-6">
        <div v-for="f in features" :key="f.title" class="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-violet-500/30 hover:bg-violet-500/[0.04] transition group">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
            {{ f.icon }}
          </div>
          <h3 class="font-bold text-base mb-2 text-white">{{ f.title }}</h3>
          <p class="text-zinc-500 text-sm leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- How to Use -->
    <section class="relative z-10 px-6 py-20 bg-white/[0.02] border-y border-white/[0.05]">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Cara Penggunaan</h2>
          <p class="text-zinc-500 text-lg">Mulai belanja cerdas dalam 3 langkah mudah.</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(step, i) in steps" :key="i" class="text-center">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xl font-black mx-auto mb-4 shadow-lg shadow-violet-500/20">
              {{ i + 1 }}
            </div>
            <h3 class="font-bold text-base mb-2 text-white">{{ step.title }}</h3>
            <p class="text-zinc-500 text-sm leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative z-10 px-6 py-24 text-center max-w-3xl mx-auto">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Siap Belanja Lebih Cerdas?</h2>
      <p class="text-zinc-500 text-lg mb-8">Daftar gratis sekarang dan rasakan pengalaman belanja yang berbeda.</p>
      <NuxtLink
        :to="loggedIn ? '/chat' : '/auth'"
        class="inline-flex px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-base font-semibold hover:opacity-90 active:scale-95 transition shadow-xl shadow-violet-500/30"
      >
        {{ loggedIn ? 'Buka Chat Sekarang →' : 'Buat Akun Gratis →' }}
      </NuxtLink>
    </section>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-white/[0.05] px-6 py-8 text-center text-zinc-600 text-sm">
      <p>© 2025 AI Shop. Ditenagai oleh OpenRouter AI & Midtrans.</p>
    </footer>
  </div>
</template>

<script setup>
useHead({ title: 'AI Shop — Belanja Cerdas dengan AI' })

const { loggedIn } = useUserSession()

// Redirect jika sudah login ke /chat
if (loggedIn.value) {
  // Biarkan landing page tampil, cukup ubah CTA button
}

const features = [
  {
    icon: '🤖',
    title: 'Chat AI Pintar',
    desc: 'Tanya produk apa saja dalam bahasa Indonesia sehari-hari. AI kami memahami konteks dan memberikan jawaban akurat dari database toko.'
  },
  {
    icon: '🤝',
    title: 'Tawar-Menawar',
    desc: 'Negosiasikan harga langsung dengan AI! Dia akan mempertimbangkan tawaranmu dan memberi harga terbaik sesuai batas yang ditentukan.'
  },
  {
    icon: '⚡',
    title: 'Beli Langsung',
    desc: 'Setelah deal, langsung bayar via Midtrans tanpa keluar dari chat. Proses checkout yang mulus dalam satu alur percakapan.'
  },
  {
    icon: '🛡️',
    title: 'Aman & Terverifikasi',
    desc: 'Pembayaran diproses oleh Midtrans yang terpercaya. Session terenkripsi dan data kamu selalu aman.'
  },
  {
    icon: '📦',
    title: 'Stok Real-time',
    desc: 'Stok produk selalu update secara otomatis setiap transaksi berhasil. Tidak ada overselling.'
  },
  {
    icon: '👑',
    title: 'Panel Admin AI',
    desc: 'Admin bisa tambah produk baru langsung lewat chat! Cukup deskripsikan produknya, AI akan memprosesnya ke database.'
  }
]

const steps = [
  {
    title: 'Daftar & Masuk',
    desc: 'Buat akun gratis dalam hitungan detik. Cukup nama, email, dan password.'
  },
  {
    title: 'Mulai Chat',
    desc: 'Tanya produk, minta rekomendasi, atau langsung tawar harga ke AI asisten kami.'
  },
  {
    title: 'Bayar & Selesai',
    desc: 'Konfirmasi pesanan dan bayar via Midtrans tanpa meninggalkan halaman chat.'
  }
]
</script>

<style scoped>
html { scroll-behavior: smooth; }
</style>
