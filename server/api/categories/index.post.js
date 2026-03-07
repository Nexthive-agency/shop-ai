import prisma from '../../utils/prisma'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  // Hanya admin yang boleh bikin kategori
  const session = await getUserSession(event)
  if (!session?.user || session.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Hanya admin yang bisa menambahkan kategori' })
  }

  try {
    const body = await readBody(event)
    const { name } = body

    if (!name?.trim()) {
      throw createError({ statusCode: 400, message: 'Nama kategori wajib diisi' })
    }

    const categoryName = name.trim()

    // Cek apakah kategori sudah ada (case-insensitive)
    const existing = await prisma.category.findFirst({
      where: { name: { equals: categoryName } }
    })

    if (existing) {
      return existing // Jika sudah ada, kembalikan saja yang sudah ada tanpa error
    }

    const category = await prisma.category.create({
      data: { name: categoryName }
    })

    logger.success('CATEGORY', `Kategori baru ditambahkan: ${categoryName}`)
    return category
  } catch (error) {
    logger.error('CATEGORY', 'Gagal menambahkan kategori', error)
    throw createError({ statusCode: 500, message: error.message || 'Gagal menambahkan kategori' })
  }
})
