import prisma from '../utils/prisma'
import { logger } from '../utils/logger'

export default defineEventHandler(async (event) => {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'OPENROUTER_API_KEY tidak dikonfigurasi. Tambahkan ke file .env'
    })
  }

  // Validasi session user yang login
  const userSession = await getUserSession(event)
  if (!userSession?.user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  const userId = userSession.user.id

  const body = await readBody(event)
  const { message, sessionId: incomingSessionId, useDatabase, userRole, userName } = body || {}
  const isAdmin = userRole === 'admin'

  if (!message?.trim()) {
    throw createError({
      statusCode: 400,
      message: 'message diperlukan'
    })
  }

  // ── 1. KELOLA SESI CHAT ───────────────────────────────────────────────────
  let chatSession

  if (incomingSessionId) {
    // Lanjutkan sesi yang sudah ada, verifikasi kepemilikan
    chatSession = await prisma.chatSession.findFirst({
      where: { id: parseInt(incomingSessionId), userId }
    })
    if (!chatSession) {
      throw createError({ statusCode: 404, message: 'Sesi chat tidak ditemukan' })
    }
  } else {
    // Buat sesi baru — judul diambil dari pesan pertama user (max 60 karakter)
    const title = message.trim().slice(0, 60) + (message.length > 60 ? '…' : '')
    chatSession = await prisma.chatSession.create({
      data: { userId, title }
    })
  }

  const activeSessionId = chatSession.id

  // ── 2. SLIDING WINDOW — Ambil 10 pesan terakhir dari DB ──────────────────
  const recentDbMessages = await prisma.chatMessage.findMany({
    where: { sessionId: activeSessionId },
    orderBy: { createdAt: 'desc' },
    take: 10
  })
  // Balik urutan agar dari yang paling lama ke paling baru
  const historyMessages = recentDbMessages.reverse().map(m => ({
    role: m.role,
    content: m.content
  }))

  // ── 3. BANGUN SYSTEM PROMPT ───────────────────────────────────────────────
  const systemMessages = []

  if (useDatabase) {
    try {
      const stopWords = ['berapa', 'harga', 'ada', 'cari', 'tampilkan', 'apa', 'saja', 'di', 'pada', 'siapa', 'yang', 'dimana', 'aku', 'mau', 'beli', 'satu', 'itu', 'deh', 'kamu']
      
      // Kumpulkan konteks dari riwayat: ambil 3 pesan terakhir user ditambah pesan saat ini
      const recentUserHistory = historyMessages
        .filter(m => m.role === 'user')
        .slice(-3)
        .map(m => m.content)
        .join(' ')
      const contextText = `${recentUserHistory} ${message}`.toLowerCase()
      
      const keywords = contextText
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.includes(word))
        // Buang kata kunci duplikat
        .filter((word, index, self) => self.indexOf(word) === index)

      // Ambil daftar kategori saat ini
      const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
      })
      const categoryNames = categories.map(c => c.name).join(', ')

      const products = await prisma.product.findMany({
        where: keywords.length > 0 ? {
          OR: [
            ...keywords.map(kw => ({ name: { contains: kw } })),
            ...keywords.map(kw => ({ description: { contains: kw } })),
            // Cari berdasarkan nama kategori (relasi, bukan string langsung)
            ...keywords.map(kw => ({ category: { is: { name: { contains: kw } } } }))
          ]
        } : undefined,
        include: { category: true },
        take: 10,
        orderBy: { createdAt: 'desc' }
      })

      const contextData = products.length > 0
        ? products
        : await prisma.product.findMany({ include: { category: true }, take: 15, orderBy: { createdAt: 'desc' } })

      if (contextData.length > 0) {
        const dbContext = contextData.map(p => {
          const catName = p.category ? p.category.name : '-'
          return `- [ID: ${p.id}] ${p.name} | HARGA: Rp${p.price.toLocaleString('id-ID')} | STOK: ${p.stock} | KATEGORI: ${catName} | DESKRIPSI: ${p.description || '-'}`
        }).join('\n')

        systemMessages.push({
          role: 'system',
          content: `Kamu adalah asisten toko AI bernama **Nexthive AI**.
Kamu ditenagai oleh model bahasa dari OpenRouter dan dikembangkan oleh **Umar Abdul Aziz** (alias **NanoKyuuun**).
Jika ada yang bertanya siapa kamu, siapa yang membuat kamu, atau model apa yang kamu pakai, jawab dengan informasi ini secara ramah.
Kamu sedang berbicara dengan ${userName || 'User'}. Sapa dia dengan ramah.
Kamu memiliki ${isAdmin ? 'EMPAT' : 'TIGA'} peran:

**PERAN 1 - Informasi Produk:**
- HANYA gunakan DATA DATABASE di bawah. Jangan mengarang harga.
- Gunakan markdown (bullet points, teks tebal). Sertakan stok tersedia.
- Jika produk tak ada di data, katakan tidak tersedia.

**PERAN 2 - Tawar-Menawar:**
- Jika user menawar ("nego", "kurangi", "diskon", "lebih murah", "bisa kurang"), lakukan negosiasi:
  - Mulai dari harga normal, turunkan sedikit-sedikit jika user terus menawar.
  - JANGAN pernah berikan harga di bawah HARGA_MIN.
  - Jika user setuju harga, respons HANYA dengan JSON:
{"action":"show_order_form","productId":ID,"quantity":1,"productName":"NAMA","negotiatedPrice":HARGA_DEAL}

${isAdmin ? `**PERAN 3 - Manajemen Toko (Admin):**
- **Daftar Kategori Saat Ini**: ${categoryNames || 'Belum ada kategori'}
- Jika user ingin **menambah kategori baru**, respons HANYA dengan JSON:
{"action":"create_category","name":"NAMA_KATEGORI"}
- Jika user ingin **tambah produk baru**, ekstrak data dan respons HANYA dengan JSON:
{"action":"create_product","name":"NAMA","description":"DESKRIPSI","price":HARGA,"minPrice":HARGA_MIN,"stock":STOK,"category":"KATEGORI"}
- Penting untuk Tambah Produk: Gunakan daftar kategori yang ada. Jika kategori yang diminta belum ada, gunakan kategori baru dari input user. Jika minPrice tidak disebutkan, hitung 80% dari price.
- Jika user **mengunggah file Excel (Bulk Import)**, sistem akan mengirimkan pesan berisi "HASIL IMPORT EXCEL...". Tugasmu adalah merangkum hasil tersebut: beri selamat atas yang berhasil, dan sebutkan rincian baris mana saja yang gagal beserta alasannya. JANGAN balas dengan JSON, balas dengan teks ramah.

**PERAN 4 - Deteksi Niat Beli:**` : `**PERAN 3 - Deteksi Niat Beli:**
- Jika user bertanya apakah bisa tambah produk atau ingin menambahkan produk, jawab: "Maaf, hanya admin yang bisa menambahkan produk baru ke sistem kami."

**PERAN BELI:**`}
- Jika user mau beli langsung ("beli", "mau beli", "pesan", "order"), respons HANYA dengan JSON:
{"action":"show_order_form","productId":ID,"quantity":JUMLAH,"productName":"NAMA"}
- Pastikan stok > 0.

DATA DATABASE SAAT INI:
${dbContext}

Jawab Bahasa Indonesia yang ramah dan informatif. Gunakan emoji sesekali.`
        })
      } else {
        systemMessages.push({
          role: 'system',
          content: `Kamu adalah asisten toko AI bernama **Nexthive AI**, ditenagai oleh model bahasa dari OpenRouter dan dikembangkan oleh **Umar Abdul Aziz** (alias **NanoKyuuun**).
Jika ada yang bertanya siapa kamu, siapa yang membuat kamu, atau model apa yang kamu pakai, jawab dengan informasi ini secara ramah.
Kamu sedang berbicara dengan ${userName || 'User'}.
DATABASE SAAT INI KOSONG.
${isAdmin ? `Bantu user menambahkan kategori atau produk pertama. 
Jika ingin buat kategori baru: {"action":"create_category","name":"NAMA_KATEGORI"}
Jika ingin buat produk baru: {"action":"create_product","name":"NAMA","description":"DESKRIPSI","price":HARGA,"minPrice":HARGA_MIN,"stock":STOK,"category":"KATEGORI"}` : 'Maaf, database toko sedang kosong. Silakan hubungi admin untuk menambahkan produk baru.'}`
        })
      }
    } catch (dbError) {
      logger.error('CHAT', 'DB Error saat ambil konteks produk', dbError)
      systemMessages.push({
        role: 'system',
        content: 'Kamu adalah asisten AI yang membantu. Jawab dalam Bahasa Indonesia.'
      })
    }
  } else {
    systemMessages.push({
      role: 'system',
      content: 'Kamu adalah asisten AI yang cerdas dan membantu. Jawab dalam Bahasa Indonesia secara singkat dan jelas.'
    })
  }

  // ── 4. PANGGIL OPENROUTER (model: stepfun/step-3.5-flash:free = free tier) ────────────
  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const siteName = process.env.NUXT_PUBLIC_SITE_NAME || 'AI Shop Assistant'

  const aiMessages = [
    ...systemMessages,
    ...historyMessages,
    { role: 'user', content: message }
  ]

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': siteUrl,
      'X-Title': siteName,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'stepfun/step-3.5-flash:free',
      messages: aiMessages,
      stream: false
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw createError({
      statusCode: response.status,
      message: error || 'Gagal mendapatkan respons dari OpenRouter'
    })
  }

  const data = await response.json()
  const aiResponseContent = data.choices?.[0]?.message?.content || ''

  // ── 5. SIMPAN PESAN KE DB ─────────────────────────────────────────────────
  await prisma.chatMessage.createMany({
    data: [
      { sessionId: activeSessionId, role: 'user', content: message },
      { sessionId: activeSessionId, role: 'assistant', content: aiResponseContent }
    ]
  })

  // Update updatedAt pada sesi agar muncul paling atas di daftar history
  await prisma.chatSession.update({
    where: { id: activeSessionId },
    data: { updatedAt: new Date() }
  })

  return {
    message: aiResponseContent,
    usage: data.usage,
    usedDatabase: useDatabase,
    sessionId: activeSessionId  // Kembalikan sessionId ke frontend
  }
})
