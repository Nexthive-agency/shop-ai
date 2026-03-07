import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
    return categories
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Gagal memuat kategori'
    })
  }
})
