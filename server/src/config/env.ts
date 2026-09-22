import "dotenv/config";

const required = (name: string, fallback?: string) => {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 5000),
  CLIENT_URL: required("CLIENT_URL", "http://localhost:5173"),
  MONGO_URI: required("MONGO_URI", "mongodb://127.0.0.1:27017/digital_heroes_premium"),
  JWT_SECRET: required("JWT_SECRET", "development-secret-change-me-please-32-characters"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "1d",
  DRAW_RANGE_MAX: Number(process.env.DRAW_RANGE_MAX ?? 45),
  DRAW_NUMBER_COUNT: Number(process.env.DRAW_NUMBER_COUNT ?? 5),
  SUBSCRIPTION_PROVIDER: (process.env.SUBSCRIPTION_PROVIDER ?? "demo") as "demo" | "stripe",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "",
  STRIPE_MONTHLY_PRICE_ID: process.env.STRIPE_MONTHLY_PRICE_ID ?? "",
  STRIPE_YEARLY_PRICE_ID: process.env.STRIPE_YEARLY_PRICE_ID ?? "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  LOG_LEVEL: process.env.LOG_LEVEL ?? "info"
};
