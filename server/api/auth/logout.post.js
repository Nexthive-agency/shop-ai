import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  await clearUserSession(event)
  logger.info('AUTH', 'User logout')
  return { message: 'Logout berhasil' }
})
