import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'OPENROUTER_API_KEY tidak dikonfigurasi.' })
  }

  const userSession = await getUserSession(event)
  if (!userSession?.user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  const userId = userSession.user.id
  const userName = userSession.user.name || 'User'
  const userRole = userSession.user.role || 'user'
  const isAdmin = userRole === 'admin'

  // Cek apakah user sudah pernah chat sebelumnya
  const existingSessionCount = await prisma.chatSession.count({ where: { userId } })
  if (existingSessionCount > 0) {
    // Bukan user baru, tidak perlu welcome message
    return null
  }

  // Bangun prompt untuk perkenalan diri AI
  const welcomePrompt = `Kamu adalah **Nexthive AI**, asisten toko AI yang cerdas.
Kamu ditenagai oleh model bahasa dari OpenRouter dan dikembangkan oleh **Umar Abdul Aziz** (alias **NanoKyuuun**).

User baru bernama **${userName}** baru saja bergabung${isAdmin ? ' sebagai **Admin**' : ''}.
Tugasmu sekarang: **perkenalkan dirimu secara hangat dan singkat** kepada ${userName}.

Dalam perkenalan kamu wajib menyebutkan:
1. Nama kamu: Nexthive AI
2. Siapa yang mengembangkan kamu: Umar Abdul Aziz (NanoKyuuun), ditenagai OpenRouter
3. Apa saja yang bisa kamu lakukan:
   - Menjawab pertanyaan seputar produk (harga, stok, kategori)
   - Melakukan tawar-menawar harga (nego) secara langsung di chat
   - Membantu proses pembelian / checkout
   ${isAdmin ? '- Membantu Admin menambahkan produk baru langsung dari chat' : ''}
4. Ajak ${userName} untuk mulai bertanya atau mencari produk

Gunakan Bahasa Indonesia yang hangat, santai, dan gunakan emoji yang sesuai. Jangan terlalu panjang.`

  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const siteName = process.env.NUXT_PUBLIC_SITE_NAME || 'AI Shop Assistant'

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
      messages: [{ role: 'user', content: welcomePrompt }],
      stream: false
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw createError({ statusCode: response.status, message: err || 'Gagal mendapatkan welcome message' })
  }

  const data = await response.json()
  const welcomeContent = data.choices?.[0]?.message?.content || ''

  // Buat sesi pertama dan simpan welcome message ke DB
  const chatSession = await prisma.chatSession.create({
    data: {
      userId,
      title: `Selamat datang, ${userName}!`,
      messages: {
        create: {
          role: 'assistant',
          content: welcomeContent
        }
      }
    }
  })

  return {
    sessionId: chatSession.id,
    message: welcomeContent
  }
})
