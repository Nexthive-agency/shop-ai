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

  const body = await readBody(event)
  const { messages, useDatabase, userRole, userName } = body || {}
  const isAdmin = userRole === 'admin'

  if (!messages?.length) {
    throw createError({
      statusCode: 400,
      message: 'Messages diperlukan'
    })
  }

  // System messages awal
  const systemMessages = []

  // Jika mode database aktif, cari data relevan dari DB
  if (useDatabase) {
    try {
      // Ambil pesan terakhir user
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
      const userQuery = lastUserMessage?.content || ''

      // Ekstrak kata kunci (buang kata-kata umum / stop words sederhana)
      const stopWords = ['berapa', 'harga', 'ada', 'cari', 'tampilkan', 'apa', 'saja', 'di', 'pada', 'siapa', 'yang', 'dimana']
      const keywords = userQuery.toLowerCase()
        .replace(/[^\w\s]/g, '') // hapus tanda baca
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.includes(word))

      // Cari produk di DB menggunakan keywords
      const products = await prisma.product.findMany({
        where: keywords.length > 0 ? {
          OR: [
            ...keywords.map(kw => ({ name: { contains: kw } })),
            ...keywords.map(kw => ({ description: { contains: kw } })),
            ...keywords.map(kw => ({ category: { contains: kw } }))
          ]
        } : undefined,
        take: 10,
        orderBy: { createdAt: 'desc' }
      })

      // Jika tidak ada hasil spesifik, ambil produk terbaru sebagai konteks umum
      const contextData = products.length > 0
        ? products
        : await prisma.product.findMany({ take: 15, orderBy: { createdAt: 'desc' } })

      if (contextData.length > 0) {
        const dbContext = contextData.map(p =>
          `- [ID: ${p.id}] ${p.name} | HARGA: Rp${p.price.toLocaleString('id-ID')} | STOK: ${p.stock} | KATEGORI: ${p.category || '-'} | DESKRIPSI: ${p.description || '-'}`
        ).join('\n')

        systemMessages.push({
          role: 'system',
          content: `Kamu adalah asisten toko AI yang cerdas bernama AI Shop Assistant.
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

${isAdmin ? `**PERAN 3 - Tambah Produk (Admin):**
- Jika user ingin tambah produk baru ("tambah produk", "tambahkan produk", "input produk", "masukkan produk baru"), ekstrak data dan respons HANYA dengan JSON:
{"action":"create_product","name":"NAMA","description":"DESKRIPSI","price":HARGA,"minPrice":HARGA_MIN,"stock":STOK,"category":"KATEGORI"}
- Jika ada info yang kurang, tanyakan dulu sebelum kirim JSON.
- Jika minPrice tidak disebutkan, gunakan 80% dari price.

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
          content: `Kamu adalah AI Shop Assistant. Kamu sedang berbicara dengan ${userName || 'User'}.
DATABASE SAAT INI KOSONG.
${isAdmin ? 'Bantu user menambahkan produk pertama dengan mengirim JSON:\n{"action":"create_product","name":"NAMA","description":"DESKRIPSI","price":HARGA,"minPrice":HARGA_MIN,"stock":STOK,"category":"KATEGORI"}' : 'Maaf, database toko sedang kosong. Silakan hubungi admin untuk menambahkan produk baru.'}`
        })
      }
    } catch (dbError) {
      logger.error('CHAT', 'DB Error saat ambil konteks produk', dbError)
      // Jika DB error, lanjutkan tanpa konteks DB
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

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [...systemMessages, ...messages],
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
  return {
    message: data.choices?.[0]?.message?.content || '',
    usage: data.usage,
    usedDatabase: useDatabase
  }
})
