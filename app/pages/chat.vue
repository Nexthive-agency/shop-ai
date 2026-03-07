<template>
  <div :class="isDark ? 'dark' : ''" class="h-screen overflow-hidden">
    <ToastNotification :toasts="toasts" @remove="removeToast" />
    <div class="flex h-full bg-slate-50 dark:bg-[#0f0f17] text-slate-800 dark:text-zinc-200 transition-colors duration-300 font-sans">

      <!-- ── Mobile Overlay ────────────────────────────────────────────── -->
      <transition
        enter-active-class="transition-opacity ease-linear duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity ease-linear duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="isMobile && isSidebarOpen" 
          @click="isSidebarOpen = false"
          class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-10 md:hidden"
        ></div>
      </transition>

      <!-- ── Sidebar History ───────────────────────────────────────────── -->
      <!-- Added absolute positioning and high z-index for mobile overlap -->
      <aside
        :class="[
          'flex-shrink-0 flex flex-col border-r border-slate-200 dark:border-white/[0.06] transition-all duration-300 overflow-hidden',
          'absolute md:relative z-20 h-full bg-slate-50 dark:bg-[#0f0f17] shadow-xl md:shadow-none',
          isSidebarOpen ? 'w-72 md:w-64' : 'w-0 border-r-0'
        ]"
      >
        <div class="flex flex-col h-full p-3 gap-2 w-72 md:w-64">
          <!-- New Chat Button -->
          <button
            @click="startNewChat"
            class="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium
              bg-gradient-to-r from-violet-600 to-indigo-600 text-white
              hover:opacity-90 active:scale-95 transition shadow-md shadow-violet-500/20"
          >
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Chat Baru
          </button>

          <!-- Session List -->
          <div class="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 mt-1">
            <div v-if="isLoadingHistory" class="text-xs text-center text-slate-400 dark:text-zinc-600 py-4">
              Memuat riwayat...
            </div>
            <div v-else-if="chatSessions.length === 0" class="text-xs text-center text-slate-400 dark:text-zinc-600 py-4">
              Belum ada riwayat chat
            </div>
            <div
              v-for="s in chatSessions"
              :key="s.id"
              class="group flex items-start gap-2 px-2.5 py-2 rounded-xl cursor-pointer transition"
              :class="s.id === activeSessionId
                ? 'bg-violet-500/10 border border-violet-500/20'
                : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] border border-transparent'"
              @click="loadSession(s.id)"
            >
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium truncate text-slate-700 dark:text-zinc-300">{{ s.title }}</p>
                <p class="text-[10px] text-slate-400 dark:text-zinc-600 truncate mt-0.5">{{ s.preview }}</p>
              </div>
              <!-- Delete Button -->
              <button
                @click.stop="deleteSession(s.id)"
                class="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 flex-shrink-0 p-0.5 rounded text-slate-400 dark:text-zinc-500 hover:text-red-400 transition mt-0.5"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- ── Main Chat Area ────────────────────────────────────────────── -->
      <div class="flex flex-col flex-1 overflow-hidden">

        <!-- Header -->
        <header class="flex-shrink-0 py-4 px-5 border-b border-slate-200 dark:border-white/[0.06] flex items-center gap-3">

          <!-- Sidebar Toggle -->
          <button
            @click="isSidebarOpen = !isSidebarOpen"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-zinc-500 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] hover:text-slate-600 dark:hover:text-zinc-300 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <NuxtLink to="/" class="flex-1">
            <h1 class="text-lg font-semibold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent leading-none">
              AI Shop
            </h1>
            <p class="text-[10px] tracking-widest uppercase text-slate-400 dark:text-zinc-500 mt-0.5">
              Smart Store Assistant
            </p>
          </NuxtLink>

          <!-- Auth + Theme -->
          <div class="flex items-center gap-2">
            <template v-if="loggedIn">
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <div class="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                  {{ session?.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                </div>
                <span class="text-xs text-zinc-300 hidden sm:block">{{ session?.user?.name }}</span>
                <span v-if="session?.user?.role === 'admin'" class="text-[9px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded-md">Admin</span>
              </div>
              <button
                @click="handleLogout"
                class="text-xs px-3 py-1.5 rounded-xl text-zinc-400 bg-white/[0.04] border border-white/[0.08] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition"
              >
                Keluar
              </button>
            </template>

            <!-- Theme Toggle -->
            <button
              @click="isDark = !isDark"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-zinc-500 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] hover:text-slate-600 dark:hover:text-zinc-300 transition"
            >
              <svg v-if="isDark" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3v1m0 16v1m8.66-9H21M3 12H2m15.36-6.36l-.7.7M7.34 17.66l-.7.7m0-11.32l.7.7M16.66 17.66l.7.7M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            </button>
          </div>
        </header>

        <!-- Chat Container -->
        <div class="flex flex-col flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 overflow-hidden">

          <!-- Messages -->
          <div ref="messagesRef" class="flex flex-col flex-1 gap-4 overflow-y-auto py-6 pr-1 md:pr-4 scroll-smooth custom-scrollbar">

            <!-- Empty state -->
            <div v-if="messages.length === 0" class="flex flex-col items-center justify-center flex-1 gap-3 text-slate-400 dark:text-zinc-600">
              <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] flex items-center justify-center">
                <svg class="w-7 h-7 text-violet-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p class="text-sm font-medium">Halo, {{ session?.user?.name }}! 👋</p>
              <p class="text-xs text-slate-300 dark:text-zinc-700">
                Tanya tentang produk, tawar harga, atau langsung beli!
              </p>
            </div>

            <!-- Message bubbles -->
            <div
              v-for="(msg, i) in messages"
              :key="i"
              :class="['flex gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row']"
            >
              <!-- Avatar -->
              <div :class="[
                'w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5',
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white'
                  : 'bg-slate-100 dark:bg-white/[0.07] text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-white/[0.08]'
              ]">
                {{ msg.role === 'user' ? (session?.user?.name?.charAt(0)?.toUpperCase() || 'U') : 'AI' }}
              </div>

              <!-- Order Form Bubble -->
              <OrderForm
                v-if="msg.type === 'order_form'"
                :product="msg.orderData.product"
                :quantity="msg.orderData.quantity"
                @cancel="cancelOrder(i)"
                @success="handlePaymentSuccess($event)"
              />

              <!-- Regular Text Bubble -->
              <div
                v-else
                :class="[
                  'max-w-[85%] md:max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed message-content',
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm shadow-md shadow-violet-500/20'
                    : 'bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.07] text-slate-700 dark:text-zinc-200 rounded-tl-sm shadow-sm'
                ]"
              >
                <div v-html="renderMarkdown(msg.content)" />
                <span
                  v-if="msg.role === 'assistant' && msg.fromDB"
                  class="inline-flex items-center gap-1 mt-2 text-[10px] text-emerald-500 dark:text-emerald-400 opacity-70"
                >
                  <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 7c0-1.657 3.582-3 8-3s8 1.343 8 3v10c0 1.657-3.582 3-8 3s-8-1.343-8-3V7z" />
                  </svg>
                  DB
                </span>
              </div>
            </div>

            <!-- Typing indicator -->
            <div v-if="isLoading" class="flex flex-row gap-2.5">
              <div class="w-7 h-7 flex-shrink-0 rounded-full bg-slate-100 dark:bg-white/[0.07] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-[10px] text-slate-500 dark:text-zinc-400 font-semibold mt-0.5">
                AI
              </div>
              <div class="bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.07] rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5 shadow-sm">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 animate-bounce [animation-delay:0ms]" />
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 animate-bounce [animation-delay:150ms]" />
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <form class="flex gap-2 pt-3 pb-4 border-t border-slate-200 dark:border-white/[0.06]" @submit.prevent="sendMessage">
            <div class="relative flex-1 flex items-center">
              <input
                v-model="input"
                type="text"
                placeholder="Tanya tentang produk, tawar harga, atau mau beli..."
                :disabled="isLoading"
                autocomplete="off"
                class="w-full bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-600 outline-none focus:border-violet-400 dark:focus:border-violet-500/60 focus:ring-1 focus:ring-violet-400/20 dark:focus:ring-violet-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm pr-12"
              />
              <button
                v-if="session?.user?.role === 'admin'"
                type="button"
                @click="triggerFileUpload"
                title="Upload Excel/CSV"
                class="absolute right-2 p-1.5 text-slate-400 hover:text-violet-500 transition-colors"
              >
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <input 
                type="file" 
                ref="fileInput" 
                class="hidden" 
                accept=".xlsx, .xls, .csv" 
                @change="handleFileUpload" 
              />
            </div>
            <button
              type="submit"
              :disabled="!input.trim() || isLoading"
              class="flex-shrink-0 w-11 h-[42px] rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center transition hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shadow-md shadow-violet-500/20"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'

definePageMeta({ middleware: 'auth' })

useHead({
  script: [{
    src: 'https://app.sandbox.midtrans.com/snap/snap.js',
    'data-client-key': useRuntimeConfig().public.midtransClientKey,
    defer: true
  }]
})

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
const { loggedIn, session, clear } = useUserSession()

async function handleLogout() {
  await clear()
  navigateTo('/auth')
}

// ── Core State ───────────────────────────────────────────────────────────────
const input = ref('')
const isLoading = ref(false)
const messages = ref([])
const messagesRef = ref(null)
const fileInput = ref(null)
const isDark = ref(true)
const useDatabase = ref(true)

// Sidebar logic
const isSidebarOpen = ref(true)
const isMobile = ref(false)

function checkScreenSize() {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    isSidebarOpen.value = false
  } else {
    isSidebarOpen.value = true
  }
}

// History state
const chatSessions = ref([])
const activeSessionId = ref(null)
const isLoadingHistory = ref(true)
// Toast system
const toasts = ref([])
let toastId = 0

function addToast(type, message, title = '') {
  const id = ++toastId
  toasts.value.push({ id, type, message, title })
  setTimeout(() => removeToast(id), 4000)
}

function removeToast(id) {
  const idx = toasts.value.findIndex(t => t.id === id)
  if (idx !== -1) toasts.value.splice(idx, 1)
}

// ── History Functions ────────────────────────────────────────────────────────

/** Ambil semua sesi milik user dari DB */
async function fetchSessions() {
  isLoadingHistory.value = true
  try {
    chatSessions.value = await $fetch('/api/history')
  } catch (e) {
    console.error('[HISTORY] Gagal memuat sesi:', e)
  } finally {
    isLoadingHistory.value = false
  }
}

/** Muat pesan dari sesi yang dipilih */
async function loadSession(sessionId) {
  if (isLoading.value) return
  try {
    const data = await $fetch(`/api/history/${sessionId}`)
    activeSessionId.value = data.id
    // Konversi format DB ke format tampilan, pertahankan type & orderData jika ada
    messages.value = data.messages.map(m => ({
      role: m.role,
      content: m.content,
      type: m.type || 'text',
      orderData: m.orderData,
      fromDB: m.role === 'assistant'
    }))
    await nextTick()
    scrollToBottom()
  } catch (e) {
    addToast('error', 'Gagal memuat sesi chat.', 'History')
  }
}

/** Hapus sesi tertentu */
async function deleteSession(sessionId) {
  try {
    await $fetch(`/api/history/${sessionId}`, { method: 'DELETE' })
    chatSessions.value = chatSessions.value.filter(s => s.id !== sessionId)
    // Jika sesi yang dihapus adalah sesi aktif, mulai baru
    if (activeSessionId.value === sessionId) {
      startNewChat()
    }
  } catch (e) {
    addToast('error', 'Gagal menghapus sesi.', 'History')
  }
}

/** Reset tampilan untuk chat baru */
function startNewChat() {
  activeSessionId.value = null
  messages.value = []
  input.value = ''
}

// ── Utility ──────────────────────────────────────────────────────────────────

function tryExtractAction(text) {
  if (!text) return null
  const stripped = text.replace(/```(?:json)?\s*([\s\S]*?)```/g, '$1').trim()
  const jsonMatch = stripped.match(/\{[\s\S]*?"action"\s*:\s*".*?"[\s\S]*?\}/)
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]) } catch { /* noop */ }
  }
  try { return JSON.parse(stripped) } catch { return null }
}

function renderMarkdown(content) {
  return md.render(content || '')
}

function cancelOrder(index) {
  messages.value.splice(index, 1)
}

function handlePaymentSuccess(orderData) {
  if (window.snap) {
    window.snap.pay(orderData.snapToken, {
      onSuccess: () => {
        messages.value.push({ role: 'assistant', content: `✅ Pembayaran berhasil! Terima kasih sudah memesan **${orderData.product.name}**. 🎉`, fromDB: false })
        scrollToBottom()
      },
      onPending: () => {
        messages.value.push({ role: 'assistant', content: `⏳ Pembayaran menunggu konfirmasi. Kami akan update segera!`, fromDB: false })
        scrollToBottom()
      },
      onError: () => {
        messages.value.push({ role: 'assistant', content: `❌ Pembayaran gagal. Silakan coba lagi.`, fromDB: false })
        scrollToBottom()
      },
      onClose: () => {}
    })
  }
}

// ── Send Message ─────────────────────────────────────────────────────────────

async function sendMessage() {
  const text = input.value.trim()
  if (!text || isLoading.value) return

  messages.value.push({ role: 'user', content: text })
  input.value = ''
  isLoading.value = true

  await nextTick()
  scrollToBottom()

  try {
    // Kirim hanya pesan user terbaru + sessionId ke backend
    // Konteks riwayat dikelola oleh backend (Sliding Window dari DB)
    const result = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        message: text,
        sessionId: activeSessionId.value,
        useDatabase: useDatabase.value,
        userRole: session.value?.user?.role,
        userName: session.value?.user?.name
      }
    })

    // Simpan sessionId yang dikembalikan backend (untuk sesi baru)
    if (result?.sessionId && !activeSessionId.value) {
      activeSessionId.value = result.sessionId
      // Refresh sidebar agar sesi baru muncul
      await fetchSessions()
    } else if (result?.sessionId) {
      // Update updatedAt sesi di sidebar (pindah ke posisi teratas)
      await fetchSessions()
    }

    const reply = result?.message || ''
    const extractedAction = tryExtractAction(reply)

    if (extractedAction) {
      if (extractedAction.action === 'show_order_form') {
        try {
          const productData = await $fetch(`/api/products?search=${encodeURIComponent(extractedAction.productName || '')}`)
          const product = productData?.find(p => p.id === extractedAction.productId) || productData?.[0]
          if (product) {
            const finalPrice = extractedAction.negotiatedPrice || product.price
            messages.value.push({ role: 'assistant', type: 'order_form', content: '', orderData: { product: { ...product, price: finalPrice }, quantity: extractedAction.quantity || 1 }, fromDB: true })
          } else {
            addToast('warn', `Produk "${extractedAction.productName}" tidak ditemukan.`, 'Order')
            messages.value.push({ role: 'assistant', content: 'Maaf, produk tidak ditemukan di database kami.', fromDB: true })
          }
        } catch (e) {
          addToast('error', 'Gagal mengambil data produk.', 'Order Error')
        }
        return
      }

      if (extractedAction.action === 'create_product') {
        try {
          const createData = await $fetch('/api/products', { method: 'POST', body: extractedAction })
          addToast('success', `Produk "${createData.name}" berhasil ditambahkan!`, 'Admin')
          messages.value.push({ role: 'assistant', content: `✅ **Berhasil!** Produk **${createData.name}** ditambahkan ke database dengan harga Rp${createData.price.toLocaleString('id-ID')}.`, fromDB: false })
        } catch (e) {
          const errMsg = e.data?.statusMessage || 'Gagal menambahkan produk.'
          addToast('error', errMsg, 'Admin')
          messages.value.push({ role: 'assistant', content: `❌ Gagal: ${errMsg}`, fromDB: false })
        }
        return
      }
    }

    messages.value.push({ role: 'assistant', content: reply, fromDB: result?.usedDatabase || false })
  } catch (e) {
    const msg = e.data?.statusMessage || e.message || 'Gagal mengirim pesan'
    addToast('error', msg, 'Chat Error')
    messages.value.push({ role: 'assistant', content: `❌ ${msg}`, fromDB: false })
  } finally {
    isLoading.value = false
    await nextTick()
    scrollToBottom()
  }
}

// ── File Upload (Admin) ──────────────────────────────────────────────────────

function triggerFileUpload() {
  // Buat elemen input file temporary tanpa perlu ref
  const el = document.createElement('input')
  el.type = 'file'
  el.accept = '.xlsx,.xls,.csv'
  el.style.display = 'none'
  document.body.appendChild(el)
  el.addEventListener('change', async (e) => {
    const file = e.target.files[0]
    document.body.removeChild(el)
    if (file) {
      await processFileUpload(file)
    }
  })
  el.click()
}

async function processFileUpload(file) {
  isLoading.value = true
  messages.value.push({
    role: 'user',
    content: `📎 Mengupload file **${file.name}**...`,
    fromDB: false
  })
  await nextTick()
  scrollToBottom()

  const formData = new FormData()
  formData.append('file', file)

  try {
    const result = await $fetch('/api/products/import', {
      method: 'POST',
      body: formData
    })

    if (result?.success) {
      const { summary } = result
      let reportStr = `HASIL IMPORT EXCEL:\nTotal baris dibaca: ${summary.total}\nBerhasil: ${summary.successCount}\nGagal: ${summary.failedCount}\n`
      if (summary.errors?.length > 0) {
        reportStr += `\nDetail baris yang gagal:\n` + summary.errors.join('\n')
      }

      // Kirim laporan ke AI untuk dirangkum
      input.value = reportStr
      isLoading.value = false
      await sendMessage()
    }
  } catch (e) {
    console.error('Import Error:', e)
    messages.value.push({
      role: 'assistant',
      content: `❌ Gagal mengimpor file: ${e.data?.message || e.message || 'Terjadi kesalahan sistem.'}`,
      fromDB: false
    })
    await nextTick()
    scrollToBottom()
    isLoading.value = false
  }
}

async function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  await processFileUpload(file)
  if (fileInput.value) fileInput.value.value = ''
}

function scrollToBottom() {
  if (messagesRef.value) messagesRef.value.scrollTop = messagesRef.value.scrollHeight
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  
  await fetchSessions()

  // Jika user baru (belum ada sesi), tampilkan pesan perkenalan dari Nexthive AI
  if (chatSessions.value.length === 0) {
    isLoading.value = true
    try {
      const welcome = await $fetch('/api/chat/welcome')
      if (welcome?.message) {
        activeSessionId.value = welcome.sessionId
        messages.value = [{ role: 'assistant', content: welcome.message, fromDB: true }]
        // Refresh sidebar agar sesi welcome muncul
        await fetchSessions()
        await nextTick()
        scrollToBottom()
      }
    } catch (e) {
      console.error('[WELCOME] Gagal memuat welcome message:', e)
    } finally {
      isLoading.value = false
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

</script>

<style scoped>
:deep(.message-content p) { margin-bottom: 0.5rem; }
:deep(.message-content p:last-child) { margin-bottom: 0; }
:deep(.message-content ul), :deep(.message-content ol) { margin-bottom: 0.5rem; padding-left: 1.25rem; }
:deep(.message-content li) { margin-bottom: 0.25rem; }
:deep(.message-content ul) { list-style-type: disc; }
:deep(.message-content ol) { list-style-type: decimal; }
:deep(.message-content strong) { font-weight: 700; }
:deep(.message-content a) { color: #8b5cf6; text-decoration: underline; }
:deep(.message-content code) { background: rgba(0,0,0,0.1); padding: 0.1rem 0.3rem; border-radius: 0.25rem; font-family: monospace; }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
</style>
