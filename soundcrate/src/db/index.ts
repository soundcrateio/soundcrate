import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import * as schema from "./schema"

// Local SQLite file by default. Point DATABASE_URL at a Turso/libSQL
// database (libsql://...) with DATABASE_AUTH_TOKEN for production.
if (process.env.VERCEL && !process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Add your Turso database URL and DATABASE_AUTH_TOKEN in Vercel → Project → Settings → Environment Variables."
  )
}

const client = createClient({
  url: process.env.DATABASE_URL ?? "file:local.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

export const db = drizzle(client, { schema })
