import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // ── VALIDASI KONFIGURASI ──────────────────────────────────────────────────
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'OPENROUTER_API_KEY tidak dikonfigurasi.' })
  }

  const model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free'

  // ── VALIDASI SESSION ──────────────────────────────────────────────────────
  const userSession = await getUserSession(event)
  if (!userSession?.user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const userId   = userSession.user.id
  const userName = userSession.user.name || 'User'
  const userRole = userSession.user.role || 'user'
  const isAdmin  = userRole === 'admin'

  // Hanya kirim welcome untuk user yang belum pernah chat
  const existingSessionCount = await prisma.chatSession.count({ where: { userId } })
  if (existingSessionCount > 0) return null

  // ── BANGUN WELCOME PROMPT ─────────────────────────────────────────────────
  const welcomePrompt = `Kamu adalah **Nexthive AI**, asisten toko pintar yang dibangun oleh **Umar Abdul Aziz (NanoKyuuun)** dan ditenagai oleh OpenRouter.

User baru bernama **${userName}**${isAdmin ? ' (Admin)' : ''} baru saja bergabung.

Tugasmu: **perkenalkan dirimu secara hangat, singkat, dan menarik** kepada ${userName}.

Wajib sebutkan dalam perkenalan:
1. Nama kamu: **Nexthive AI**
2. Dibuat oleh: **Umar Abdul Aziz (NanoKyuuun)**, ditenagai **OpenRouter**
3. Yang bisa kamu bantu:
   - Informasi produk (harga, stok, kategori)
   - Negosiasi harga secara langsung di chat
   - Proses pembelian / checkout${isAdmin ? '\n   - Manajemen toko: tambah kategori & produk langsung dari chat' : ''}
4. Ajak ${userName} untuk mulai bertanya atau mencari produk

Gaya penulisan: hangat, santai, pakai emoji yang sesuai. Jangan terlalu panjang (maks 5–6 kalimat).`

  // ── PANGGIL OPENROUTER ────────────────────────────────────────────────────
  const siteUrl  = process.env.NUXT_PUBLIC_SITE_URL  || 'http://localhost:3000'
  const siteName = process.env.NUXT_PUBLIC_SITE_NAME || 'AI Shop Assistant'

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': siteUrl,
      'X-Title':      siteName,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: welcomePrompt }],
      stream: false
    })
  })

  if (!response.ok) {
    const errText = await response.text()
    console.error(`[WELCOME] OpenRouter error [HTTP ${response.status}] model: ${model} | ${errText}`)
    // Jangan crash app — kembalikan null, UI bisa skip welcome message
    return null
  }

  const data           = await response.json()
  const welcomeContent = data.choices?.[0]?.message?.content || ''

  if (!welcomeContent) {
    console.warn('[WELCOME] OpenRouter mengembalikan konten kosong, skip welcome message.')
    return null
  }

  // ── SIMPAN SESI DAN WELCOME MESSAGE KE DB ────────────────────────────────
  const chatSession = await prisma.chatSession.create({
    data: {
      userId,
      title: `Selamat datang, ${userName}!`,
      messages: {
        create: { role: 'assistant', content: welcomeContent }
      }
    }
  })

  return {
    sessionId: chatSession.id,
    message:   welcomeContent
  }
})
