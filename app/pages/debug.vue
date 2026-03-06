<template>
  <div class="p-8 bg-slate-50 min-h-screen font-sans">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Database Debugger</h1>
          <p class="text-slate-500">Daftar produk yang saat ini ada di MySQL</p>
        </div>
        <NuxtLink to="/" class="text-sm text-violet-600 hover:underline"> Kembali ke Chat </NuxtLink>
      </div>

      <div v-if="pending" class="py-10 text-center text-slate-400"> Loading data... </div>
      
      <div v-else-if="error" class="bg-red-50 border border-red-200 p-4 rounded-xl text-red-600 mb-6 font-mono text-sm">
        <strong class="block mb-2 text-base font-sans">Database Error:</strong>
        <p>{{ error.statusMessage || error.message }}</p>
        <div v-if="error.data" class="mt-2 p-2 bg-red-100/50 rounded overflow-auto max-h-40">
          {{ error.data }}
        </div>
        <p class="mt-4 text-xs font-sans text-red-400 italic">Pastikan MySQL sudah jalan dan DATABASE_URL di .env sudah benar.</p>
      </div>

      <div v-else-if="products?.length === 0" class="bg-amber-50 border border-amber-200 p-6 rounded-xl text-amber-700 text-center">
        <p class="font-medium">Database Kosong!</p>
        <p class="text-sm mt-1">Jalankan <code>npx prisma db seed</code> di terminal untuk mengisi data dummy.</p>
      </div>

      <div v-else class="grid gap-4">
        <div v-for="p in products" :key="p.id" class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <h3 class="font-bold text-slate-800">{{ p.name }}</h3>
            <p class="text-xs text-slate-500">{{ p.category }} • Stok: {{ p.stock }}</p>
            <p class="text-sm text-slate-600 mt-1 lines-clamp-1">{{ p.description }}</p>
          </div>
          <div class="text-right">
            <span class="text-lg font-bold text-violet-600">Rp{{ p.price.toLocaleString('id-ID') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: products, pending, error } = await useFetch('/api/products')
</script>
