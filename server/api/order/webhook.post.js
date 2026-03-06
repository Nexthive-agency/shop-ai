import crypto from 'crypto'
import prisma from '../../utils/prisma'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { order_id, transaction_status, fraud_status, signature_key, gross_amount, status_code } = body

    // Verifikasi Signature dari Midtrans (keamanan)
    const serverKey = process.env.MIDTRANS_SERVER_KEY
    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex')

    if (signature_key !== expectedSignature) {
      logger.warn('WEBHOOK', 'Invalid signature! Possible spoofed webhook.', { order_id })
      throw createError({ statusCode: 403, statusMessage: 'Invalid signature' })
    }

    logger.info('WEBHOOK', `Notifikasi diterima: ${order_id} → status: ${transaction_status}`, { fraud_status })

    // Cari order di DB
    const order = await prisma.order.findUnique({ where: { orderId: order_id } })
    if (!order) {
      throw createError({ statusCode: 404, statusMessage: 'Order tidak ditemukan' })
    }

    // Tentukan status baru berdasarkan notifikasi Midtrans
    let newStatus = order.status
    if (transaction_status === 'capture' && fraud_status === 'accept') {
      newStatus = 'paid'
    } else if (transaction_status === 'settlement') {
      newStatus = 'paid'
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
      newStatus = 'cancelled'
    }

    // Update status order
    await prisma.order.update({
      where: { orderId: order_id },
      data: { status: newStatus }
    })

    // Kurangi stok jika sudah paid
    if (newStatus === 'paid' && order.status !== 'paid') {
      await prisma.product.update({
        where: { id: order.productId },
        data: { stock: { decrement: order.quantity } }
      })
      logger.success('WEBHOOK', `Order ${order_id} LUNAS. Stok produk berkurang.`, {
        productId: order.productId,
        decremented: order.quantity
      })
    }

    return { message: 'OK' }
  } catch (error) {
    logger.error('WEBHOOK', 'Error memproses webhook', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Webhook error'
    })
  }
})
