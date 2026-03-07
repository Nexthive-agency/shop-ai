import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const search = query.search?.toString() || ''

    const products = await prisma.product.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { description: { contains: search } },
              { category: { is: { name: { contains: search } } } }
            ]
          }
        : undefined,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    // Flatten category untuk kompatibilitas frontend lama
    return products.map(p => ({
      ...p,
      categoryName: p.category?.name ?? null
    }))

  } catch (error) {
    console.error('API Products Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error',
      data: error
    })
  }
})
