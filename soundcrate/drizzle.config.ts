import { defineConfig } from "drizzle-kit"

if (process.env.VERCEL && !process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Add your Turso database URL and DATABASE_AUTH_TOKEN in Vercel → Project → Settings → Environment Variables."
  )
}

const url = process.env.DATABASE_URL ?? "file:local.db"

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: url.startsWith("file:") ? "sqlite" : "turso",
  dbCredentials: {
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
})
