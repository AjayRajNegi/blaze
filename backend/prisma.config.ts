import dotenv from "dotenv";
import path from "path";

const envFile =
  process.env.NODE_ENV == "production" ? ".env.production" : ".env.development";

dotenv.config({
  path: path.resolve(__dirname, envFile),
});

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "bun ./prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
