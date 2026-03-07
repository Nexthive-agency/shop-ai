import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const userId = session.user.id

  const sessions = await prisma.chatSession.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 1 // Ambil pesan pertama sebagai preview judul
      }
    }
  })

  return sessions.map(s => ({
    id: s.id,
    title: s.title,
    preview: s.messages[0]?.content?.slice(0, 80) || 'Belum ada pesan',
    createdAt: s.createdAt,
    updatedAt: s.updatedAt
  }))
})
