import bcrypt from 'bcryptjs'
import prisma from '../../utils/prisma'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  try {
    const { name, email, password } = await readBody(event)

    if (!name || !email || !password) {
      throw createError({ statusCode: 400, statusMessage: 'Semua field wajib diisi' })
    }

    if (password.length < 6) {
      throw createError({ statusCode: 400, statusMessage: 'Password minimal 6 karakter' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: 'Email sudah terdaftar' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'user' }
    })

    logger.success('AUTH', `User baru terdaftar: ${email}`)
    return { id: user.id, name: user.name, email: user.email, role: user.role }
  } catch (error) {
    logger.error('AUTH', 'Gagal register', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Gagal mendaftar'
    })
  }
})
