import { app } from './app'
import { CONFIG } from './config'

// Entry point using clean architecture app
export default {
  port: CONFIG.PORT,
  fetch: app.fetch,
}
