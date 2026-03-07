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

  return {
    id: chatSession.id,
    title: chatSession.title,
    messages: chatSession.messages.map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt
    }))
  }
})
