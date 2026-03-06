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
              { category: { contains: search } }
            ]
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return products
  } catch (error) {
    console.error('API Products Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error',
      data: error
    })
  }
})
