type Env = Record<string, string | undefined>;

const bunEnv: Env = (globalThis as any).Bun?.env || {};
const nodeEnv: Env = typeof process !== "undefined" ? (process.env as Env) : {};
const env: Env = { ...nodeEnv, ...bunEnv };

export const CONFIG = {
  NODE_ENV: env.NODE_ENV || 'development',
  PORT: Number(env.PORT || '4242'),
  STRIPE_SECRET_KEY: env.STRIPE_SECRET_KEY,
  FRONTEND_URL: env.FRONTEND_URL || 'http://localhost:5173',
  AUTH_AMOUNT_EUR: Number(env.AUTH_AMOUNT_EUR || '50'),
  DATABASE_URL: env.DATABASE_URL,
  LOG_LEVEL: env.LOG_LEVEL || (env.NODE_ENV === 'production' ? 'info' : 'debug'),
  STRIPE_WEBHOOK_SECRET: env.STRIPE_WEBHOOK_SECRET,
  ADMIN_API_KEY: env.ADMIN_API_KEY,
  AUTH_JWT_SECRET: env.AUTH_JWT_SECRET || 'change_me',
  ADMIN_EMAIL: env.ADMIN_EMAIL || 'admin@example.com',
  ADMIN_PASSWORD: env.ADMIN_PASSWORD || 'password123',
}
