import prisma from '../../utils/prisma'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  // Cek session - hanya admin yang boleh tambah produk
  const session = await getUserSession(event)
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Harus login terlebih dahulu' })
  }
  if (session.user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Hanya admin yang bisa menambahkan produk' })
  }

  try {
    const body = await readBody(event)
    const { name, description, price, minPrice, stock, category, imageUrl } = body

    if (!name || !price || !stock) {
      throw createError({ statusCode: 400, statusMessage: 'name, price, dan stock wajib diisi' })
    }

    let categoryId = null

    if (category && category.trim() !== '') {
      const catName = category.trim()
      // Cari kategori atau buat baru jika belum ada
      let catRecord = await prisma.category.findFirst({
        where: { name: { equals: catName } }
      })

      if (!catRecord) {
        catRecord = await prisma.category.create({
          data: { name: catName }
        })
      }
      categoryId = catRecord.id
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        minPrice: parseFloat(minPrice || price * 0.8), // default: 80% dari harga
        stock: parseInt(stock),
        categoryId,
        imageUrl: imageUrl || null
      }
    })

    logger.success('PRODUCT', `Produk baru berhasil ditambahkan: ${name}`, { id: product.id })
    return product
  } catch (error) {
    logger.error('PRODUCT', 'Gagal menambahkan produk', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Gagal menambahkan produk'
    })
  }
})
