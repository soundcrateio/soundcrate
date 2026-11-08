/**
 * Seeds the database with the taxonomy (genres, DAWs, synths) and a set of
 * EXAMPLE packs. The packs, labels and URLs below are placeholders — replace
 * them with your real catalogue and affiliate links.
 *
 *   npm run db:seed
 */
import { db } from "./index"
import {
  daws,
  genres,
  packDaws,
  packGenres,
  packs,
  packSynths,
  synths,
} from "./schema"

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

const GENRES = [
  "House",
  "Tech House",
  "Deep House",
  "Afro House",
  "Bass House",
  "Techno",
  "Melodic Techno",
  "Trance",
  "Progressive House",
  "Drum & Bass",
  "Dubstep",
  "Future Bass",
  "Hardstyle",
  "UK Garage",
  "Big Room",
]

const DAWS = [
  "Ableton Live",
  "FL Studio",
  "Logic Pro",
  "Bitwig Studio",
  "Cubase",
  "Studio One",
  "Reason",
]

const SYNTHS = [
  "Serum",
  "Serum 2",
  "Vital",
  "Massive",
  "Massive X",
  "Sylenth1",
  "Spire",
  "Diva",
  "Phase Plant",
  "Pigments",
]

const ALL_DAWS = DAWS

// Placeholder demo loops in /public/previews — replace with each pack's real demo.
const DEMO_BY_GENRE: Record<string, string> = {
  "Drum & Bass": "/previews/demo-dnb.mp3",
  Dubstep: "/previews/demo-dubstep.mp3",
  "Future Bass": "/previews/demo-dubstep.mp3",
  Hardstyle: "/previews/demo-dubstep.mp3",
  Techno: "/previews/demo-techno.mp3",
  "Melodic Techno": "/previews/demo-techno.mp3",
  Trance: "/previews/demo-techno.mp3",
}
const demoFor = (genres: string[]) =>
  genres.map((g) => DEMO_BY_GENRE[g]).find(Boolean) ?? "/previews/demo-house.mp3"

type SeedPack = {
  name: string
  brand: string
  description: string
  priceCents: number | null
  genres: string[]
  daws: string[]
  synths: string[]
  hasMidi: boolean
  sampleCount: number
  sizeMb: number
  featured?: boolean
  releasedAt: string
}

const PACKS: SeedPack[] = [
  {
    name: "Warehouse Pressure",
    brand: "Lowend Lab",
    description:
      "Rolling tech house grooves, punchy drum tops and chunky bass hits built for the club. Includes full construction kits with MIDI and Serum presets for every bassline.",
    priceCents: 2999,
    genres: ["Tech House", "House"],
    daws: ALL_DAWS,
    synths: ["Serum"],
    hasMidi: true,
    sampleCount: 412,
    sizeMb: 1240,
    featured: true,
    releasedAt: "2026-09-12",
  },
  {
    name: "Neon Cathedral",
    brand: "Aurora Sound Co.",
    description:
      "Emotive melodic techno: evolving arps, cinematic pads and hypnotic sequences. Ships with Diva and Serum 2 patches plus MIDI for every melody.",
    priceCents: 3499,
    genres: ["Melodic Techno", "Techno", "Progressive House"],
    daws: ALL_DAWS,
    synths: ["Diva", "Serum 2"],
    hasMidi: true,
    sampleCount: 360,
    sizeMb: 1850,
    featured: true,
    releasedAt: "2026-10-03",
  },
  {
    name: "Amen Reactor",
    brand: "Breakline Audio",
    description:
      "Liquid to neuro drum & bass: chopped breaks, reese basses and razor-sharp FX. Includes Phase Plant and Vital presets.",
    priceCents: 2499,
    genres: ["Drum & Bass"],
    daws: ALL_DAWS,
    synths: ["Phase Plant", "Vital"],
    hasMidi: true,
    sampleCount: 520,
    sizeMb: 1410,
    releasedAt: "2026-06-20",
  },
  {
    name: "Wobble Theory",
    brand: "Subfreq",
    description:
      "Heavy dubstep growls, riddim basses and impact FX. 120 Serum presets, plus resampled bass loops ready to chop.",
    priceCents: 2799,
    genres: ["Dubstep", "Bass House"],
    daws: ALL_DAWS,
    synths: ["Serum"],
    hasMidi: false,
    sampleCount: 300,
    sizeMb: 980,
    featured: true,
    releasedAt: "2026-08-01",
  },
  {
    name: "Sunrise Anthems",
    brand: "Aurora Sound Co.",
    description:
      "Uplifting trance leads, supersaws and plucks. Sylenth1 and Spire soundbanks with matching MIDI progressions.",
    priceCents: 3999,
    genres: ["Trance", "Progressive House"],
    daws: ALL_DAWS,
    synths: ["Sylenth1", "Spire"],
    hasMidi: true,
    sampleCount: 280,
    sizeMb: 1120,
    releasedAt: "2026-05-14",
  },
  {
    name: "Kick Drum Essentials Vol. 3",
    brand: "Lowend Lab",
    description:
      "250 processed kicks for house, techno and tech house — tuned, labelled by key and ready to drop in. One-shots only.",
    priceCents: 1499,
    genres: ["House", "Techno", "Tech House"],
    daws: ALL_DAWS,
    synths: [],
    hasMidi: false,
    sampleCount: 250,
    sizeMb: 210,
    releasedAt: "2026-02-10",
  },
  {
    name: "Ableton Tech House Template Pack",
    brand: "Projectfile",
    description:
      "Five full Ableton Live project templates with stems, arrangement markers and stock-device racks — learn how club tracks are built.",
    priceCents: 4499,
    genres: ["Tech House"],
    daws: ["Ableton Live"],
    synths: ["Serum"],
    hasMidi: true,
    sampleCount: 190,
    sizeMb: 2600,
    releasedAt: "2026-07-07",
  },
  {
    name: "FL Future Bass Starter",
    brand: "Projectfile",
    description:
      "FL Studio project files, chord MIDI and bright Serum 2 presets for future bass drops, vocal chops and sidechained pads.",
    priceCents: 1999,
    genres: ["Future Bass"],
    daws: ["FL Studio"],
    synths: ["Serum 2", "Vital"],
    hasMidi: true,
    sampleCount: 230,
    sizeMb: 890,
    releasedAt: "2026-04-18",
  },
  {
    name: "Rawstyle Fury",
    brand: "Hardline",
    description:
      "Distorted hardstyle kicks, screeches and anthemic leads. Includes kick construction layers and Spire presets.",
    priceCents: 2999,
    genres: ["Hardstyle"],
    daws: ALL_DAWS,
    synths: ["Spire"],
    hasMidi: true,
    sampleCount: 340,
    sizeMb: 1300,
    releasedAt: "2026-03-22",
  },
  {
    name: "Shuffle Season",
    brand: "Southside Samples",
    description:
      "2-step and UK garage swing: shuffled drums, organ stabs, chopped vocals and sub basses. Massive and Massive X presets included.",
    priceCents: 2299,
    genres: ["UK Garage", "Bass House"],
    daws: ALL_DAWS,
    synths: ["Massive", "Massive X"],
    hasMidi: true,
    sampleCount: 380,
    sizeMb: 760,
    releasedAt: "2026-09-29",
  },
  {
    name: "Savanna Grooves",
    brand: "Southside Samples",
    description:
      "Organic afro house percussion, log drums, shakers and vocal textures recorded live. Loops and one-shots.",
    priceCents: 2499,
    genres: ["Afro House", "Deep House"],
    daws: ALL_DAWS,
    synths: [],
    hasMidi: false,
    sampleCount: 460,
    sizeMb: 1540,
    releasedAt: "2026-10-21",
  },
  {
    name: "Mainstage Arsenal",
    brand: "Hardline",
    description:
      "Big room leads, festival drops, risers and claps. Packed with Serum, Sylenth1 and Massive presets for instant energy.",
    priceCents: 3499,
    genres: ["Big Room", "Progressive House"],
    daws: ALL_DAWS,
    synths: ["Serum", "Sylenth1", "Massive"],
    hasMidi: true,
    sampleCount: 410,
    sizeMb: 1700,
    releasedAt: "2026-06-02",
  },
  {
    name: "Deep Currents",
    brand: "Lowend Lab",
    description:
      "Warm deep house chords, dusty drums and soulful keys. Includes Pigments presets and chord MIDI.",
    priceCents: 1999,
    genres: ["Deep House", "House"],
    daws: ALL_DAWS,
    synths: ["Pigments"],
    hasMidi: true,
    sampleCount: 270,
    sizeMb: 820,
    releasedAt: "2026-01-15",
  },
  {
    name: "Free Vital Bass Bundle",
    brand: "Subfreq",
    description:
      "A free taster: 40 Vital bass presets for dubstep, bass house and DnB. No samples — presets only.",
    priceCents: null,
    genres: ["Dubstep", "Bass House", "Drum & Bass"],
    daws: ALL_DAWS,
    synths: ["Vital"],
    hasMidi: false,
    sampleCount: 0,
    sizeMb: 4,
    releasedAt: "2026-08-30",
  },
  {
    name: "Industrial Ritual",
    brand: "Breakline Audio",
    description:
      "Dark, driving techno: distorted rumbles, metallic percussion and atonal textures. Bitwig Studio project included.",
    priceCents: 2799,
    genres: ["Techno"],
    daws: ["Bitwig Studio", "Ableton Live"],
    synths: ["Phase Plant"],
    hasMidi: true,
    sampleCount: 330,
    sizeMb: 1450,
    releasedAt: "2026-10-30",
  },
  {
    name: "Logic Pop-EDM Toolkit",
    brand: "Projectfile",
    description:
      "Logic Pro templates, Alchemy-free sound design and MIDI for radio-ready EDM-pop toplines. Serum presets for every lead.",
    priceCents: 3299,
    genres: ["Future Bass", "Progressive House"],
    daws: ["Logic Pro"],
    synths: ["Serum"],
    hasMidi: true,
    sampleCount: 210,
    sizeMb: 1100,
    releasedAt: "2026-05-30",
  },
]

async function main() {
  console.log("Seeding database…")

  // Clear existing data.
  await db.delete(packGenres)
  await db.delete(packDaws)
  await db.delete(packSynths)
  await db.delete(packs)
  await db.delete(genres)
  await db.delete(daws)
  await db.delete(synths)

  const genreRows = await db
    .insert(genres)
    .values(GENRES.map((name) => ({ name, slug: slugify(name) })))
    .returning()
  const dawRows = await db
    .insert(daws)
    .values(DAWS.map((name) => ({ name, slug: slugify(name) })))
    .returning()
  const synthRows = await db
    .insert(synths)
    .values(SYNTHS.map((name) => ({ name, slug: slugify(name) })))
    .returning()

  const idOf = (rows: { id: number; name: string }[], name: string) => {
    const row = rows.find((r) => r.name === name)
    if (!row) throw new Error(`Unknown taxonomy value: ${name}`)
    return row.id
  }

  for (const p of PACKS) {
    const slug = slugify(p.name)
    const [pack] = await db
      .insert(packs)
      .values({
        slug,
        name: p.name,
        brand: p.brand,
        description: p.description,
        priceCents: p.priceCents,
        // Placeholder — replace with the real affiliate link.
        previewUrl: demoFor(p.genres),
        affiliateUrl: `https://example.com/packs/${slug}?ref=YOUR_AFFILIATE_ID`,
        hasMidi: p.hasMidi,
        hasPresets: p.synths.length > 0,
        sampleCount: p.sampleCount,
        sizeMb: p.sizeMb,
        featured: p.featured ?? false,
        releasedAt: p.releasedAt,
      })
      .returning()

    if (p.genres.length)
      await db
        .insert(packGenres)
        .values(p.genres.map((g) => ({ packId: pack.id, genreId: idOf(genreRows, g) })))
    if (p.daws.length)
      await db
        .insert(packDaws)
        .values(p.daws.map((d) => ({ packId: pack.id, dawId: idOf(dawRows, d) })))
    if (p.synths.length)
      await db
        .insert(packSynths)
        .values(p.synths.map((s) => ({ packId: pack.id, synthId: idOf(synthRows, s) })))
  }

  console.log(
    `Seeded ${PACKS.length} packs, ${GENRES.length} genres, ${DAWS.length} DAWs, ${SYNTHS.length} synths.`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
