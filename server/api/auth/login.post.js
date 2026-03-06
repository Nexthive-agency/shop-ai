import bcrypt from 'bcryptjs'
import prisma from '../../utils/prisma'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event)

    if (!email || !password) {
      throw createError({ statusCode: 400, statusMessage: 'Email dan password wajib diisi' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Email atau password salah' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      throw createError({ statusCode: 401, statusMessage: 'Email atau password salah' })
    }

    // Set session via nuxt-auth-utils
    await setUserSession(event, {
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })

    logger.success('AUTH', `Login berhasil: ${email} (${user.role})`)
    return { id: user.id, name: user.name, email: user.email, role: user.role }
  } catch (error) {
    logger.error('AUTH', 'Gagal login', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Gagal login'
    })
  }
})
