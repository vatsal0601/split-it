import type { Config } from "drizzle-kit";

if (!process.env.DRIZZLE_DATABASE_URL) {
  throw new Error("DRIZZLE_DATABASE_URL is not defined");
}

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DRIZZLE_DATABASE_URL,
  },
  breakpoints: true,
  strict: true,
  verbose: true,
} satisfies Config;
