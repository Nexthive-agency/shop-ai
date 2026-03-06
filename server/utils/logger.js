/**
 * Logger utility untuk server-side logging yang terstruktur dan berwarna
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
}

function timestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19)
}

function formatLog(level, tag, message, data) {
  const time = `${colors.gray}[${timestamp()}]${colors.reset}`
  const levelTag = `${colors[level === 'ERROR' ? 'red' : level === 'WARN' ? 'yellow' : level === 'SUCCESS' ? 'green' : 'cyan']}[${level}]${colors.reset}`
  const moduleTag = `${colors.magenta}[${tag}]${colors.reset}`
  const dataStr = data ? `\n  ${colors.gray}→${colors.reset} ${JSON.stringify(data, null, 2).split('\n').join('\n  ')}` : ''
  return `${time} ${levelTag} ${moduleTag} ${message}${dataStr}`
}

export const logger = {
  info: (tag, message, data) => console.log(formatLog('INFO', tag, message, data)),
  success: (tag, message, data) => console.log(formatLog('SUCCESS', tag, message, data)),
  warn: (tag, message, data) => console.warn(formatLog('WARN', tag, message, data)),
  error: (tag, message, error) => {
    const errorData = error ? {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack?.split('\n').slice(0, 4).join(' | ')
    } : undefined
    console.error(formatLog('ERROR', tag, message, errorData))
  }
}
