# Drop Directory — EDM sample pack directory

A searchable directory of EDM sample packs built with **Next.js 16**, **shadcn/ui**
(new-york style, Radix), **Tailwind CSS v4** and **Drizzle ORM** on SQLite/libSQL.

## Features

- Filter packs by **genre**, **DAW**, **MIDI included**, **presets included**,
  **which synth the presets are for** (Serum, Vital, Massive, …) and **free only**
- Full-text search across name, label and description, plus sorting
- Filters live in the URL (`/?genre=techno&synth=serum&midi=1`) so every view is shareable
- Dark / light / system theme toggle (`next-themes`)
- Pack detail pages with specs and related packs
- Affiliate links go through `/go/<slug>`, which counts clicks and redirects
  (`rel="sponsored nofollow"`), plus an affiliate disclosure page
- **Audio previews**: play buttons on every pack card and detail page, plus a
  sticky player bar (seek, volume, lock-screen/media-key controls). One shared
  player, so only one preview plays at a time and playback keeps going while
  you browse.
- Mobile filter drawer, responsive grid

## Getting started

```bash
npm install
cp .env.example .env
npm run db:setup   # creates tables + seeds example data
npm run dev
```

Open http://localhost:3000.

## Managing packs

The seed data in `src/db/seed.ts` is **placeholder content** (fictional labels,
`example.com` affiliate links). Replace it with your real catalogue:

- **Quickest:** `npm run db:studio` opens Drizzle Studio, a GUI for editing
  rows in `packs`, `genres`, `daws`, `synths` and the `pack_*` join tables.
- **Or** edit the `PACKS` array in `src/db/seed.ts` and run `npm run db:seed`
  (this wipes and re-inserts everything).

Pack fields: `name`, `slug`, `brand`, `description`, `priceCents` (null = free),
`imageUrl` (optional — a generated cover is used otherwise), `previewUrl`
(optional — a **direct** link to an mp3/wav/ogg/m4a file; leave empty to hide
the play button), `affiliateUrl`,
`hasMidi`, `hasPresets`, `sampleCount`, `sizeMb`, `featured`, `releasedAt`.
Click counts are stored in `packs.clicks`.

### Audio previews

`previewUrl` must point at an audio file the browser can play directly, either
a file you host (put it in `public/previews/` and use `/previews/name.mp3`) or
a direct file URL from the label's CDN. SoundCloud/YouTube *page* links won't
work in an `<audio>` element. If you hotlink a label's files, check they're OK
with it. The four files in `public/previews/` are synthesized placeholder loops.

Query results are cached with `"use cache"` (`cacheLife("hours")`), so in
production edits show up within the hour, or immediately after a redeploy.

## Deploying (Vercel + Turso)

1. Create a free database at [turso.tech](https://turso.tech) and copy its
   URL (`libsql://…`) and an auth token.
2. Import the GitHub repo at [vercel.com/new](https://vercel.com/new).
   If the code lives in a subfolder, set **Root Directory** to it.
3. Add environment variables `DATABASE_URL` and `DATABASE_AUTH_TOKEN`, then deploy.

`npm run build` runs the migrations in `drizzle/` and seeds the example packs
**only if the database is empty**, so redeploys never wipe your data.

## Database

- Local: a SQLite file (`DATABASE_URL=file:local.db`).
- Production: any libSQL database such as [Turso](https://turso.tech) — set
  `DATABASE_URL=libsql://…` and `DATABASE_AUTH_TOKEN`; the build sets it up.
  (Serverless hosts like Vercel can't write to a local SQLite file, so use Turso there.)

Schema: `src/db/schema.ts`. Queries/filtering: `src/lib/queries.ts`.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `start` | Production build / server |
| `npm run db:push` | Sync schema to the database (dev shortcut) |
| `npm run db:seed` | Reset and seed example data |
| `npm run db:setup` | `db:migrate` + `db:seed` |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:generate` / `db:migrate` | Create / apply SQL migrations (run `db:generate` after changing `schema.ts`) |

## Customizing

- Site name/description: `src/lib/site.ts`
- Theme colors (light + dark): `src/app/globals.css`
- Add shadcn components: `npx shadcn@latest add <component>`
