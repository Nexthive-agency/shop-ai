<template>
  <div :class="isDark ? 'dark' : ''" class="h-screen overflow-hidden">
    <ToastNotification :toasts="toasts" @remove="removeToast" />
    <div class="flex flex-col h-full bg-slate-50 dark:bg-[#0f0f17] text-slate-800 dark:text-zinc-200 transition-colors duration-300 font-sans">

      <!-- Header -->
      <header class="flex-shrink-0 py-4 px-5 border-b border-slate-200 dark:border-white/[0.06] flex items-center gap-3">
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
      <div class="flex flex-col flex-1 w-full max-w-2xl mx-auto px-4 overflow-hidden">

        <!-- Messages -->
        <div ref="messagesRef" class="flex flex-col flex-1 gap-4 overflow-y-auto py-6 pr-1 scroll-smooth custom-scrollbar">

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
                'max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed message-content',
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
        <form class="flex gap-2 pt-3 border-t border-slate-200 dark:border-white/[0.06]" @submit.prevent="sendMessage">
          <input
            v-model="input"
            type="text"
            placeholder="Tanya tentang produk, tawar harga, atau mau beli..."
            :disabled="isLoading"
            autocomplete="off"
            class="flex-1 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-600 outline-none focus:border-violet-400 dark:focus:border-violet-500/60 focus:ring-1 focus:ring-violet-400/20 dark:focus:ring-violet-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          />
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

const messages = ref([])
const input = ref('')
const isLoading = ref(false)
const messagesRef = ref(null)
const isDark = ref(true)
const useDatabase = ref(true)

// Toast system
const toasts = ref([])
let toastId = 0

function addToast(type, message, title = '') {
  const id = ++toastId
  toasts.value.push({ id, type, message, title })
  setTimeout(() => removeToast(id), 4000)
  const logFn = type === 'error' ? console.error : type === 'warn' ? console.warn : console.log
  logFn(`[FE][${type.toUpperCase()}] ${title ? title + ': ' : ''}${message}`)
}

function removeToast(id) {
  const idx = toasts.value.findIndex(t => t.id === id)
  if (idx !== -1) toasts.value.splice(idx, 1)
}

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

async function sendMessage() {
  const text = input.value.trim()
  if (!text || isLoading.value) return

  messages.value.push({ role: 'user', content: text })
  input.value = ''
  isLoading.value = true

  await nextTick()
  scrollToBottom()

  try {
    const chatMessages = messages.value
      .filter(m => m.type !== 'order_form')
      .map(m => ({ role: m.role, content: m.content }))

    // Pakai $fetch bukan useFetch (komponen sudah mounted)
    const result = await $fetch('/api/chat', {
      method: 'POST',
      body: { 
        messages: chatMessages, 
        useDatabase: useDatabase.value,
        userRole: session.value?.user?.role, // Kirim role user ke AI
        userName: session.value?.user?.name // Kirim nama user ke AI
      }
    })

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

function scrollToBottom() {
  if (messagesRef.value) messagesRef.value.scrollTop = messagesRef.value.scrollHeight
}
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
