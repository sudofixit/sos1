import pino from 'pino'
import { CONFIG } from '../config'

const isDev = CONFIG.NODE_ENV !== 'production'

export const logger = pino({
  level: CONFIG.LOG_LEVEL,
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard' },
      }
    : undefined,
})