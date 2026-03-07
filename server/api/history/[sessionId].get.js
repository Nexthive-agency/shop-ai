import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const sessionId = parseInt(getRouterParam(event, 'sessionId'))

  if (isNaN(sessionId)) {
    throw createError({ statusCode: 400, message: 'sessionId tidak valid' })
  }

  const chatSession = await prisma.chatSession.findFirst({
    where: {
      id: sessionId,
      userId: session.user.id // Pastikan hanya bisa akses sesi miliknya sendiri
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!chatSession) {
    throw createError({ statusCode: 404, message: 'Sesi chat tidak ditemukan' })
  }

  const messagesWithOrderData = await Promise.all(chatSession.messages.map(async (m) => {
    let type = 'text'
    let orderData = null
    let content = m.content

    // Coba parsing JSON dari pesan asisten yang mungkin berupa action
    if (m.role === 'assistant' && content.includes('"action"')) { // dilonggarkan
      try {
        const stripped = content.replace(/```(?:json)?\s*([\s\S]*?)```/g, '$1').trim()
        const parsed = JSON.parse(stripped)
        
        if (parsed.action === 'show_order_form') {
          type = 'order_form'
          // Ambil detail produk asli dari DB untuk harga dan stok
          const product = await prisma.product.findUnique({ where: { id: parsed.productId } })
          if (product) {
            orderData = {
              product: { ...product, price: parsed.negotiatedPrice || product.price },
              quantity: parsed.quantity || 1
            }
          }
        }
      } catch (e) {
        console.error('[HISTORY] Gagal parse JSON untuk pesan:', content, e.message)
        // Fallback deteksi action via regex jika JSON.parse ketat gagal (misal ada kutip aneh atau teks tambahan)
        const matchAction = content.match(/"action"\s*:\s*"show_order_form"/)
        const matchProductId = content.match(/"productId"\s*:\s*(\d+)/)
        const matchQuantity = content.match(/"quantity"\s*:\s*(\d+)/)
        const matchPrice = content.match(/"negotiatedPrice"\s*:\s*(\d+)/)

        if (matchAction && matchProductId) {
          type = 'order_form'
          const productId = parseInt(matchProductId[1])
          const product = await prisma.product.findUnique({ where: { id: productId } })
          if (product) {
            orderData = {
              product: { ...product, price: matchPrice ? parseInt(matchPrice[1]) : product.price },
              quantity: matchQuantity ? parseInt(matchQuantity[1]) : 1
            }
          }
        }
      }
    }

    return {
      id: m.id,
      role: m.role,
      type,
      orderData,
      content,
      createdAt: m.createdAt,
      fromDB: true
    }
  }))

  return {
    id: chatSession.id,
    title: chatSession.title,
    messages: messagesWithOrderData
  }
})
