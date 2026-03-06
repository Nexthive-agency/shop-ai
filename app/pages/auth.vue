<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0f0f17] via-[#13111f] to-[#0f0f17] flex items-center justify-center p-4">
    
    <!-- Card -->
    <div class="w-full max-w-md">
      <!-- Logo / Brand -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg mb-4">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white">
          {{ isLogin ? 'Selamat Datang' : 'Buat Akun Baru' }}
        </h1>
        <p class="text-zinc-500 text-sm mt-1">
          {{ isLogin ? 'Masuk ke AI Shop Assistant' : 'Daftar untuk mulai berbelanja' }}
        </p>
      </div>

      <!-- Form Card -->
      <div class="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 shadow-2xl">

        <!-- Error Alert -->
        <div v-if="errorMsg" class="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <span>❌</span> {{ errorMsg }}
        </div>

        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
          <!-- Name (register only) -->
          <div v-if="!isLogin">
            <label class="block text-xs font-medium text-zinc-400 mb-1.5">Nama Lengkap</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Masukkan nama lengkap"
              class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-violet-500/60 focus:bg-white/[0.07] transition"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="email@contoh.com"
              class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-violet-500/60 focus:bg-white/[0.07] transition"
              required
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Minimal 6 karakter"
              class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-violet-500/60 focus:bg-white/[0.07] transition"
              required
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {{ isLoading ? (isLogin ? 'Masuk...' : 'Mendaftar...') : (isLogin ? 'Masuk' : 'Daftar Sekarang') }}
          </button>
        </form>

        <!-- Toggle Login/Register -->
        <p class="text-center text-sm text-zinc-500 mt-4">
          {{ isLogin ? 'Belum punya akun?' : 'Sudah punya akun?' }}
          <button class="text-violet-400 hover:text-violet-300 font-medium transition ml-1" @click="toggleMode">
            {{ isLogin ? 'Daftar' : 'Masuk' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const router = useRouter()
const { loggedIn, fetch: fetchSession } = useUserSession()

// Redirect ke chat kalau sudah login
if (loggedIn.value) {
  router.replace('/chat')
}

const isLogin = ref(true)
const isLoading = ref(false)
const errorMsg = ref('')
const form = ref({ name: '', email: '', password: '' })

function toggleMode() {
  isLogin.value = !isLogin.value
  errorMsg.value = ''
  form.value = { name: '', email: '', password: '' }
}

async function handleSubmit() {
  isLoading.value = true
  errorMsg.value = ''
  try {
    const endpoint = isLogin.value ? '/api/auth/login' : '/api/auth/register'
    const body = isLogin.value
      ? { email: form.value.email, password: form.value.password }
      : form.value

    // Pakai $fetch bukan useFetch (komponen sudah mounted)
    await $fetch(endpoint, { method: 'POST', body })

    // Setelah register, pindah ke mode login
    if (!isLogin.value) {
      toggleMode()
      return
    }

    // Setelah login, refresh session lalu redirect ke chat
    await fetchSession()
    await router.push('/chat')
  } catch (e) {
    errorMsg.value = e.data?.statusMessage || e.message || 'Terjadi kesalahan'
  } finally {
    isLoading.value = false
  }
}
</script>
