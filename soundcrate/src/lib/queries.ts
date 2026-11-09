import "server-only"

import { and, asc, desc, eq, exists, inArray, isNull, like, or, sql } from "drizzle-orm"
import { cacheLife, cacheTag } from "next/cache"

import { db } from "@/db"
import {
  daws,
  genres,
  packDaws,
  packGenres,
  packs,
  packSynths,
  synths,
} from "@/db/schema"
import type { PackFilters } from "@/lib/filters"

export const PACKS_TAG = "packs"

const withRelations = {
  genres: { with: { genre: true } },
  daws: { with: { daw: true } },
  synths: { with: { synth: true } },
} as const

function shapePack<
  T extends {
    genres: { genre: { slug: string; name: string } }[]
    daws: { daw: { slug: string; name: string } }[]
    synths: { synth: { slug: string; name: string } }[]
  },
>(p: T) {
  const { genres, daws, synths, ...rest } = p
  return {
    ...(rest as Omit<T, "genres" | "daws" | "synths">),
    genres: genres.map((g) => g.genre),
    daws: daws.map((d) => d.daw),
    synths: synths.map((s) => s.synth),
  }
}

export type Pack = NonNullable<Awaited<ReturnType<typeof getPackBySlug>>>

/** All taxonomy values used by the filter UI. */
export async function getFilterOptions() {
  "use cache"
  cacheTag(PACKS_TAG)
  cacheLife("hours")

  const [genreRows, dawRows, synthRows] = await Promise.all([
    db.select().from(genres).orderBy(asc(genres.name)),
    db.select().from(daws).orderBy(asc(daws.name)),
    db.select().from(synths).orderBy(asc(synths.name)),
  ])
  return { genres: genreRows, daws: dawRows, synths: synthRows }
}

/**
 * Search packs. Within a facet (e.g. several genres) values are OR-ed;
 * different facets are AND-ed together.
 */
export async function searchPacks(filters: PackFilters): Promise<Pack[]> {
  "use cache"
  cacheTag(PACKS_TAG)
  cacheLife("hours")

  const conditions = []

  if (filters.q) {
    const term = `%${filters.q.replace(/[%_]/g, "")}%`
    conditions.push(
      or(
        like(packs.name, term),
        like(packs.brand, term),
        like(packs.description, term)
      )
    )
  }

  if (filters.genres.length) {
    conditions.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(packGenres)
          .innerJoin(genres, eq(genres.id, packGenres.genreId))
          .where(
            and(
              eq(packGenres.packId, packs.id),
              inArray(genres.slug, filters.genres)
            )
          )
      )
    )
  }

  if (filters.daws.length) {
    conditions.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(packDaws)
          .innerJoin(daws, eq(daws.id, packDaws.dawId))
          .where(
            and(eq(packDaws.packId, packs.id), inArray(daws.slug, filters.daws))
          )
      )
    )
  }

  if (filters.synths.length) {
    conditions.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(packSynths)
          .innerJoin(synths, eq(synths.id, packSynths.synthId))
          .where(
            and(
              eq(packSynths.packId, packs.id),
              inArray(synths.slug, filters.synths)
            )
          )
      )
    )
  }

  if (filters.midi) conditions.push(eq(packs.hasMidi, true))
  if (filters.presets) conditions.push(eq(packs.hasPresets, true))
  if (filters.free) conditions.push(isNull(packs.priceCents))

  const orderBy = {
    featured: [desc(packs.featured), desc(packs.releasedAt)],
    newest: [desc(packs.releasedAt)],
    "price-asc": [asc(sql`coalesce(${packs.priceCents}, 0)`)],
    "price-desc": [desc(sql`coalesce(${packs.priceCents}, 0)`)],
    name: [asc(packs.name)],
  }[filters.sort]

  const rows = await db.query.packs.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    orderBy,
    with: withRelations,
  })

  return rows.map(shapePack)
}

export async function getPackBySlug(slug: string) {
  "use cache"
  cacheTag(PACKS_TAG, `pack:${slug}`)
  cacheLife("hours")

  const row = await db.query.packs.findFirst({
    where: eq(packs.slug, slug),
    with: withRelations,
  })
  return row ? shapePack(row) : null
}

export async function getAllPackSlugs() {
  "use cache"
  cacheTag(PACKS_TAG)
  return db.select({ slug: packs.slug }).from(packs)
}

/** Packs sharing a genre with the given pack. */
export async function getRelatedPacks(packId: number, genreSlugs: string[]) {
  "use cache"
  cacheTag(PACKS_TAG)
  cacheLife("hours")

  if (!genreSlugs.length) return []
  const rows = await db.query.packs.findMany({
    where: and(
      sql`${packs.id} != ${packId}`,
      exists(
        db
          .select({ one: sql`1` })
          .from(packGenres)
          .innerJoin(genres, eq(genres.id, packGenres.genreId))
          .where(
            and(eq(packGenres.packId, packs.id), inArray(genres.slug, genreSlugs))
          )
      )
    ),
    orderBy: [desc(packs.featured), desc(packs.releasedAt)],
    limit: 3,
    with: withRelations,
  })
  return rows.map(shapePack)
}

/** Used by the /go/[slug] redirect: never cached. */
export async function recordClickAndGetUrl(slug: string) {
  const [row] = await db
    .update(packs)
    .set({ clicks: sql`${packs.clicks} + 1` })
    .where(eq(packs.slug, slug))
    .returning({ url: packs.affiliateUrl })
  return row?.url ?? null
}
