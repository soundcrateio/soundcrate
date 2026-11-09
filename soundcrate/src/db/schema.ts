import { relations, sql } from "drizzle-orm"
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core"

export const packs = sqliteTable("packs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  description: text("description").notNull(),
  /** Price in cents. null = free. */
  priceCents: integer("price_cents"),
  currency: text("currency").notNull().default("USD"),
  imageUrl: text("image_url"),
  /** Direct link to an audio demo (mp3/wav/ogg) played by the preview player. */
  previewUrl: text("preview_url"),
  /** Affiliate link to the official product page. */
  affiliateUrl: text("affiliate_url").notNull(),
  hasMidi: integer("has_midi", { mode: "boolean" }).notNull().default(false),
  hasPresets: integer("has_presets", { mode: "boolean" })
    .notNull()
    .default(false),
  sampleCount: integer("sample_count"),
  sizeMb: integer("size_mb"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  /** Outbound affiliate clicks, incremented by /go/[slug]. */
  clicks: integer("clicks").notNull().default(0),
  releasedAt: text("released_at"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
})

export const genres = sqliteTable("genres", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
})

export const daws = sqliteTable("daws", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
})

/** Synths / plugins that presets are made for (Serum, Massive, ...). */
export const synths = sqliteTable("synths", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
})

export const packGenres = sqliteTable(
  "pack_genres",
  {
    packId: integer("pack_id")
      .notNull()
      .references(() => packs.id, { onDelete: "cascade" }),
    genreId: integer("genre_id")
      .notNull()
      .references(() => genres.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.packId, t.genreId] })]
)

export const packDaws = sqliteTable(
  "pack_daws",
  {
    packId: integer("pack_id")
      .notNull()
      .references(() => packs.id, { onDelete: "cascade" }),
    dawId: integer("daw_id")
      .notNull()
      .references(() => daws.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.packId, t.dawId] })]
)

export const packSynths = sqliteTable(
  "pack_synths",
  {
    packId: integer("pack_id")
      .notNull()
      .references(() => packs.id, { onDelete: "cascade" }),
    synthId: integer("synth_id")
      .notNull()
      .references(() => synths.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.packId, t.synthId] })]
)

export const packsRelations = relations(packs, ({ many }) => ({
  genres: many(packGenres),
  daws: many(packDaws),
  synths: many(packSynths),
}))

export const packGenresRelations = relations(packGenres, ({ one }) => ({
  pack: one(packs, { fields: [packGenres.packId], references: [packs.id] }),
  genre: one(genres, { fields: [packGenres.genreId], references: [genres.id] }),
}))

export const packDawsRelations = relations(packDaws, ({ one }) => ({
  pack: one(packs, { fields: [packDaws.packId], references: [packs.id] }),
  daw: one(daws, { fields: [packDaws.dawId], references: [daws.id] }),
}))

export const packSynthsRelations = relations(packSynths, ({ one }) => ({
  pack: one(packs, { fields: [packSynths.packId], references: [packs.id] }),
  synth: one(synths, { fields: [packSynths.synthId], references: [synths.id] }),
}))
