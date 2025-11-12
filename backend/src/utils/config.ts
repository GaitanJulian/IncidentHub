import "dotenv/config";

export const config = {
  port: Number(process.env.PORT) || 4001,
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  env: process.env.NODE_ENV || "development",
};
