export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name (A–Z)" },
] as const

export type SortOption = (typeof SORT_OPTIONS)[number]["value"]

export type PackFilters = {
  q: string
  genres: string[]
  daws: string[]
  synths: string[]
  midi: boolean
  presets: boolean
  free: boolean
  sort: SortOption
}

type RawParams = Record<string, string | string[] | undefined>

const list = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v.join(",") : (v ?? ""))
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .sort()

const first = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v) ?? ""

/** Parse URL search params into a normalized filter object. */
export function parseFilters(params: RawParams): PackFilters {
  const sort = first(params.sort)
  return {
    q: first(params.q).trim().slice(0, 100),
    genres: list(params.genre),
    daws: list(params.daw),
    synths: list(params.synth),
    midi: first(params.midi) === "1",
    presets: first(params.presets) === "1",
    free: first(params.free) === "1",
    sort: SORT_OPTIONS.some((o) => o.value === sort)
      ? (sort as SortOption)
      : "featured",
  }
}

/** Serialize filters back to a query string (omitting defaults). */
export function filtersToSearchParams(f: PackFilters) {
  const sp = new URLSearchParams()
  if (f.q) sp.set("q", f.q)
  if (f.genres.length) sp.set("genre", f.genres.join(","))
  if (f.daws.length) sp.set("daw", f.daws.join(","))
  if (f.synths.length) sp.set("synth", f.synths.join(","))
  if (f.midi) sp.set("midi", "1")
  if (f.presets) sp.set("presets", "1")
  if (f.free) sp.set("free", "1")
  if (f.sort !== "featured") sp.set("sort", f.sort)
  return sp
}

export function countActiveFilters(f: PackFilters) {
  return (
    f.genres.length +
    f.daws.length +
    f.synths.length +
    Number(f.midi) +
    Number(f.presets) +
    Number(f.free)
  )
}
