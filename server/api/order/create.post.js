import Midtrans from 'midtrans-client'
import prisma from '../../utils/prisma'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { productId, price, quantity, customerName, customerPhone, customerEmail } = body

    // Validasi input
    if (!productId || !quantity || !customerName || !customerPhone || !customerEmail) {
      throw createError({ statusCode: 400, statusMessage: 'Data tidak lengkap' })
    }

    logger.info('ORDER', 'Membuat pesanan baru', { productId, quantity, customerName })

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })
    }
    if (product.stock < quantity) {
      throw createError({ statusCode: 400, statusMessage: `Stok tidak cukup. Tersedia: ${product.stock}` })
    }

    // Tentukan harga: gunakan harga dari body (jika valid) atau harga asli DB
    let finalUnitPrice = product.price
    if (price && price !== product.price) {
      // Validasi harga tawar tidak boleh di bawah minPrice
      if (price < product.minPrice) {
        logger.warn('ORDER', 'Upaya manipulasi harga di bawah minPrice', { productId, price, minPrice: product.minPrice })
        throw createError({ statusCode: 400, statusMessage: 'Harga tawar tidak valid (terlalu rendah)' })
      }
      finalUnitPrice = price
      logger.info('ORDER', 'Menggunakan harga hasil negosiasi', { original: product.price, negotiated: price })
    }

    const totalPrice = finalUnitPrice * quantity
    const orderId = `ORDER-${productId}-${Date.now()}`

    // Simpan order ke DB dengan status pending
    const order = await prisma.order.create({
      data: {
        orderId,
        productId: product.id,
        quantity,
        totalPrice,
        customerName,
        customerPhone,
        customerEmail,
        status: 'pending'
      }
    })

    // Inisialisasi Midtrans Snap
    const snap = new Midtrans.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    })

    // Buat Snap Token
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(totalPrice)
      },
      customer_details: {
        first_name: customerName,
        phone: customerPhone,
        email: customerEmail
      },
      item_details: [{
        id: String(product.id),
        price: Math.round(finalUnitPrice),
        quantity: quantity,
        name: product.name
      }]
    }

    const snapResponse = await snap.createTransaction(parameter)
    logger.success('ORDER', `Snap token berhasil dibuat: ${orderId}`, { snapToken: snapResponse.token })

    // Simpan snap token ke order
    await prisma.order.update({
      where: { id: order.id },
      data: { snapToken: snapResponse.token }
    })

    return {
      snapToken: snapResponse.token,
      orderId,
      totalPrice,
      product: { name: product.name, price: finalUnitPrice }
    }
  } catch (error) {
    logger.error('ORDER', 'Gagal membuat pesanan', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Gagal membuat pesanan'
    })
  }
})
