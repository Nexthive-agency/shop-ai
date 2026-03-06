<template>
  <div class="rounded-2xl rounded-tl-sm border border-violet-200 dark:border-violet-500/20 bg-white dark:bg-white/[0.04] shadow-md overflow-hidden w-full max-w-sm">
    
    <!-- Header -->
    <div class="px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center gap-2">
      <svg class="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <span class="text-sm font-semibold text-white">Konfirmasi Pesanan</span>
    </div>

    <!-- Product Summary -->
    <div class="px-4 py-3 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-slate-800 dark:text-zinc-200">{{ product.name }}</p>
        <p class="text-xs text-slate-500 dark:text-zinc-500">
          Rp{{ product.price.toLocaleString('id-ID') }} × {{ quantity }} pcs
        </p>
      </div>
      <div class="text-right">
        <p class="text-xs text-slate-400 dark:text-zinc-500">Total</p>
        <p class="text-base font-bold text-violet-600 dark:text-violet-400">
          Rp{{ (product.price * quantity).toLocaleString('id-ID') }}
        </p>
      </div>
    </div>

    <!-- Form -->
    <form class="px-4 py-3 flex flex-col gap-3" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-xs font-medium text-slate-500 dark:text-zinc-500 mb-1">Nama Lengkap</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Masukkan nama lengkap"
          class="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-600 outline-none focus:border-violet-400 dark:focus:border-violet-500/60 transition"
          required
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-500 dark:text-zinc-500 mb-1">Nomor HP</label>
        <input
          v-model="form.phone"
          type="tel"
          placeholder="08xxxxxxxxxx"
          class="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-600 outline-none focus:border-violet-400 dark:focus:border-violet-500/60 transition"
          required
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-500 dark:text-zinc-500 mb-1">Email</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="email@contoh.com"
          class="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-600 outline-none focus:border-violet-400 dark:focus:border-violet-500/60 transition"
          required
        />
      </div>
      <p v-if="errorMsg" class="text-xs text-red-500">{{ errorMsg }}</p>
      <div class="flex gap-2 pt-1">
        <button
          type="button"
          class="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/[0.09] text-sm text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition"
          :disabled="isLoading"
          @click="$emit('cancel')"
        >
          Batal
        </button>
        <button
          type="submit"
          :disabled="isLoading"
          class="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Memproses...' : 'Lanjutkan →' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: true },
  quantity: { type: Number, default: 1 }
})

const emit = defineEmits(['cancel', 'success'])

const form = ref({ name: '', phone: '', email: '' })
const isLoading = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  isLoading.value = true
  errorMsg.value = ''

  try {
    const data = await $fetch('/api/order/create', {
      method: 'POST',
      body: {
        productId: props.product.id,
        price: props.product.price,
        quantity: props.quantity,
        customerName: form.value.name,
        customerPhone: form.value.phone,
        customerEmail: form.value.email
      }
    })

    emit('success', data)
  } catch (e) {
    errorMsg.value = e.data?.statusMessage || e.message || 'Gagal membuat pesanan'
  } finally {
    isLoading.value = false
  }
}
</script>
