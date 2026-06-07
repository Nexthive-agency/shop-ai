import prisma from '../utils/prisma'
import { logger } from '../utils/logger'

export default defineEventHandler(async (event) => {
  // ── VALIDASI KONFIGURASI ──────────────────────────────────────────────────
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'OPENROUTER_API_KEY tidak dikonfigurasi. Tambahkan ke file .env'
    })
  }

  const model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free'

  // ── VALIDASI SESSION ──────────────────────────────────────────────────────
  const userSession = await getUserSession(event)
  if (!userSession?.user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  const userId    = userSession.user.id
  const userRole  = userSession.user.role || 'user'
  const userName  = userSession.user.name || 'User'
  const isAdmin   = userRole === 'admin'

  // ── VALIDASI BODY ─────────────────────────────────────────────────────────
  const body = await readBody(event)
  const { message, sessionId: incomingSessionId, useDatabase } = body || {}

  if (!message?.trim()) {
    throw createError({ statusCode: 400, message: 'Field "message" diperlukan dan tidak boleh kosong.' })
  }

  // ── 1. KELOLA SESI CHAT ───────────────────────────────────────────────────
  let chatSession

  if (incomingSessionId) {
    chatSession = await prisma.chatSession.findFirst({
      where: { id: parseInt(incomingSessionId), userId }
    })
    if (!chatSession) {
      throw createError({ statusCode: 404, message: 'Sesi chat tidak ditemukan atau tidak memiliki akses.' })
    }
  } else {
    const title = message.trim().slice(0, 60) + (message.trim().length > 60 ? '…' : '')
    chatSession = await prisma.chatSession.create({
      data: { userId, title }
    })
  }

  const activeSessionId = chatSession.id

  // ── 2. SLIDING WINDOW — Ambil 12 pesan terakhir dari DB ──────────────────
  const recentDbMessages = await prisma.chatMessage.findMany({
    where: { sessionId: activeSessionId },
    orderBy: { createdAt: 'desc' },
    take: 12
  })
  const historyMessages = recentDbMessages.reverse().map(m => ({
    role: m.role,
    content: m.content
  }))

  // ── 3. BANGUN SYSTEM PROMPT ───────────────────────────────────────────────
  const systemContent = await buildSystemPrompt({ useDatabase, isAdmin, userName, historyMessages, message })

  // ── 4. PANGGIL OPENROUTER ─────────────────────────────────────────────────
  const siteUrl  = process.env.NUXT_PUBLIC_SITE_URL  || 'http://localhost:3000'
  const siteName = process.env.NUXT_PUBLIC_SITE_NAME || 'AI Shop Assistant'

  const aiMessages = [
    { role: 'system', content: systemContent },
    ...historyMessages,
    { role: 'user', content: message }
  ]

  logger.info?.('CHAT', `Memanggil OpenRouter | model: ${model} | session: ${activeSessionId} | user: ${userId}`)

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': siteUrl,
      'X-Title': siteName,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: aiMessages,
      stream: false
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    logger.error('CHAT', `OpenRouter error [HTTP ${response.status}] model: ${model} | ${errorText}`)
    throw createError({
      statusCode: response.status,
      message: `OpenRouter error [${response.status}]: ${errorText || 'Gagal mendapatkan respons dari AI'}`
    })
  }

  const data = await response.json()
  const aiResponseContent = data.choices?.[0]?.message?.content || ''

  if (!aiResponseContent) {
    logger.error('CHAT', 'OpenRouter mengembalikan respons kosong', data)
    throw createError({ statusCode: 502, message: 'AI tidak menghasilkan respons. Coba lagi.' })
  }

  // ── 5. SIMPAN PESAN KE DB ─────────────────────────────────────────────────
  await prisma.chatMessage.createMany({
    data: [
      { sessionId: activeSessionId, role: 'user',      content: message },
      { sessionId: activeSessionId, role: 'assistant', content: aiResponseContent }
    ]
  })

  await prisma.chatSession.update({
    where: { id: activeSessionId },
    data:  { updatedAt: new Date() }
  })

  return {
    message:     aiResponseContent,
    usage:       data.usage,
    usedDatabase: useDatabase,
    sessionId:   activeSessionId
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Bangun System Prompt
// ─────────────────────────────────────────────────────────────────────────────
async function buildSystemPrompt({ useDatabase, isAdmin, userName, historyMessages, message }) {
  const IDENTITY = `Kamu adalah **Nexthive AI**, asisten toko pintar yang dibangun oleh **Umar Abdul Aziz (NanoKyuuun)** dan ditenagai oleh OpenRouter.
Kamu sedang melayani **${userName}**${isAdmin ? ' (Admin)' : ''}.
Selalu gunakan Bahasa Indonesia yang ramah, ringkas, dan profesional. Gunakan emoji secukupnya.
Jika ditanya siapa kamu, siapa pembuatmu, atau model apa yang kamu pakai — jawab dengan informasi di atas.`

  // ── Mode tanpa database ───────────────────────────────────────────────────
  if (!useDatabase) {
    return `${IDENTITY}

Kamu bertugas menjawab pertanyaan umum dari user. Jawab dengan singkat, jelas, dan informatif.`
  }

  // ── Mode dengan database ──────────────────────────────────────────────────
  try {
    // Kumpulkan kata kunci dari konteks percakapan terkini
    const stopWords = new Set([
      'berapa', 'harga', 'ada', 'cari', 'tampilkan', 'apa', 'saja', 'di', 'pada',
      'siapa', 'yang', 'dimana', 'aku', 'mau', 'beli', 'satu', 'itu', 'deh',
      'kamu', 'dan', 'ini', 'atau', 'untuk', 'dengan', 'dari', 'ke', 'yang'
    ])

    const recentUserHistory = historyMessages
      .filter(m => m.role === 'user')
      .slice(-3)
      .map(m => m.content)
      .join(' ')

    const contextText = `${recentUserHistory} ${message}`.toLowerCase()
    const keywords = [...new Set(
      contextText
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 2 && !stopWords.has(w))
    )]

    // Ambil kategori
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    const categoryList = categories.map(c => c.name).join(', ') || 'Belum ada kategori'

    // Query produk relevan, fallback ke produk terbaru
    let products = keywords.length > 0
      ? await prisma.product.findMany({
          where: {
            OR: [
              ...keywords.map(kw => ({ name:        { contains: kw } })),
              ...keywords.map(kw => ({ description: { contains: kw } })),
              ...keywords.map(kw => ({ category: { is: { name: { contains: kw } } } }))
            ]
          },
          include: { category: true },
          take: 10,
          orderBy: { createdAt: 'desc' }
        })
      : []

    if (products.length === 0) {
      products = await prisma.product.findMany({
        include: { category: true },
        take: 15,
        orderBy: { createdAt: 'desc' }
      })
    }

    // Format data produk
    const productContext = products.length > 0
      ? products.map(p => {
          const cat = p.category?.name ?? '-'
          const price = p.price.toLocaleString('id-ID')
          const minPrice = p.minPrice?.toLocaleString('id-ID') ?? price
          return `• [ID:${p.id}] ${p.name} | Harga: Rp${price} | Harga Min: Rp${minPrice} | Stok: ${p.stock} | Kategori: ${cat}${p.description ? ` | Desc: ${p.description}` : ''}`
        }).join('\n')
      : 'Tidak ada produk tersedia saat ini.'

    const adminRules = isAdmin ? `

## PERAN 3 — MANAJEMEN TOKO (Admin Only)
Kategori yang tersedia saat ini: ${categoryList}

**Tambah Kategori Baru** → respons HANYA JSON (tanpa teks tambahan):
{"action":"create_category","name":"NAMA_KATEGORI"}

**Tambah Produk Baru** → respons HANYA JSON (tanpa teks tambahan):
{"action":"create_product","name":"NAMA","description":"DESKRIPSI","price":HARGA,"minPrice":HARGA_MIN,"stock":STOK,"category":"KATEGORI"}
- Jika minPrice tidak disebutkan, hitung 80% dari price.
- Jika kategori belum ada, gunakan kategori baru dari input user.

**Import Excel** → Jika sistem mengirim pesan "HASIL IMPORT EXCEL...", rangkum hasilnya: beri selamat untuk yang berhasil dan rinci baris yang gagal. JANGAN balas dengan JSON.` : `

## PERAN 3 — BATASAN USER
Jika user meminta tambah produk atau fitur admin: jawab "Maaf, hanya Admin yang bisa mengelola produk. Silakan hubungi admin toko."`

    return `${IDENTITY}

## PERAN 1 — INFORMASI PRODUK
- Jawab berdasarkan DATA PRODUK di bawah SAJA. Jangan mengarang harga atau stok.
- Gunakan format markdown (bullet, tebal). Tampilkan stok yang tersedia.
- Jika produk tidak ada dalam data, katakan tidak tersedia dengan sopan.
- Jika stok = 0, informasikan bahwa produk sedang habis.

## PERAN 2 — NEGOSIASI HARGA
- Jika user menawar (kata kunci: "nego", "kurang", "diskon", "lebih murah", "bisa kurang"), lakukan negosiasi bertahap:
  1. Mulai dari harga normal.
  2. Turunkan sedikit jika user terus menawar (maks 2–3 kali).
  3. JANGAN pernah menawarkan harga di bawah **Harga Min**.
  4. Jika user setuju harga → respons HANYA JSON (tanpa teks tambahan):
     {"action":"show_order_form","productId":ID,"quantity":1,"productName":"NAMA","negotiatedPrice":HARGA_DEAL}

## PERAN 3 — DETEKSI PEMBELIAN
- Jika user ingin membeli langsung (kata kunci: "beli", "pesan", "order", "mau beli") → respons HANYA JSON (tanpa teks tambahan):
  {"action":"show_order_form","productId":ID,"quantity":JUMLAH,"productName":"NAMA"}
- Pastikan stok > 0 sebelum menampilkan form order.${adminRules}

---
## DATA PRODUK SAAT INI
${productContext}
---
Prioritas: Akurat > Ramah > Singkat. Jangan mengarang data yang tidak ada di atas.`

  } catch (dbError) {
    logger.error('CHAT', 'Gagal mengambil data produk dari DB', dbError)
    return `${IDENTITY}

Saat ini data produk tidak bisa diakses. Minta maaf kepada user dan sarankan untuk mencoba lagi atau menghubungi admin.`
  }
}
