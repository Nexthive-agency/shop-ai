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

  // Verifikasi bahwa sesi ini milik user yang sedang login
  const chatSession = await prisma.chatSession.findFirst({
    where: {
      id: sessionId,
      userId: session.user.id
    }
  })

  if (!chatSession) {
    throw createError({ statusCode: 404, message: 'Sesi chat tidak ditemukan' })
  }

  // Cascade delete (ChatMessage dihapus otomatis karena relasi onDelete: Cascade)
  await prisma.chatSession.delete({
    where: { id: sessionId }
  })

  return { success: true, message: 'Sesi chat berhasil dihapus' }
})
