"use client"

import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react"
import * as React from "react"

import { FilterPanel } from "@/components/filters/filter-panel"
import { useFilters } from "@/components/filters/filters-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { countActiveFilters, SORT_OPTIONS, type SortOption } from "@/lib/filters"

function SearchBox() {
  const { filters, setFilters } = useFilters()
  const [value, setValue] = React.useState(filters.q)

  // Keep local input in sync when the URL changes (e.g. "Clear all").
  const [prevQ, setPrevQ] = React.useState(filters.q)
  if (filters.q !== prevQ) {
    setPrevQ(filters.q)
    setValue(filters.q)
  }

  // Debounce typing before updating the URL.
  React.useEffect(() => {
    if (value.trim() === filters.q) return
    const t = setTimeout(() => setFilters({ q: value.trim() }), 300)
    return () => clearTimeout(t)
  }, [value, filters.q, setFilters])

  return (
    <InputGroup className="sm:max-w-sm">
      <InputGroupInput
        type="search"
        placeholder="Search packs, labels…"
        aria-label="Search packs"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Clear search"
            onClick={() => setValue("")}
          >
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

function SortSelect() {
  const { filters, setFilters } = useFilters()
  return (
    <Select
      value={filters.sort}
      onValueChange={(v) => setFilters({ sort: v as SortOption })}
    >
      <SelectTrigger aria-label="Sort packs" className="w-full sm:w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function MobileFilters({ resultCount }: { resultCount: number }) {
  const { filters, clearAll } = useFilters()
  const active = countActiveFilters(filters)
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontalIcon data-icon="inline-start" />
          Filters
          {active > 0 && <Badge>{active}</Badge>}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow down packs by genre, DAW and contents.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <FilterPanel idPrefix="m" />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>
              Show {resultCount} {resultCount === 1 ? "pack" : "packs"}
            </Button>
          </SheetClose>
          {active > 0 && (
            <Button variant="ghost" onClick={clearAll}>
              Clear all
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function FilterToolbar({ resultCount }: { resultCount: number }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <SearchBox />
      <div className="flex items-center gap-2 sm:ml-auto">
        <MobileFilters resultCount={resultCount} />
        <SortSelect />
      </div>
    </div>
  )
}

/** Removable chips for each active filter. */
export function ActiveFilters() {
  const { filters, options, setFilters, toggleValue, clearAll } = useFilters()
  if (countActiveFilters(filters) === 0 && !filters.q) return null

  const nameOf = (facet: "genres" | "daws" | "synths", slug: string) =>
    options[facet].find((o) => o.slug === slug)?.name ?? slug

  const chips: { key: string; label: string; onRemove: () => void }[] = [
    ...(filters.q
      ? [{ key: "q", label: `“${filters.q}”`, onRemove: () => setFilters({ q: "" }) }]
      : []),
    ...(filters.midi
      ? [{ key: "midi", label: "MIDI", onRemove: () => setFilters({ midi: false }) }]
      : []),
    ...(filters.presets
      ? [{ key: "presets", label: "Presets", onRemove: () => setFilters({ presets: false }) }]
      : []),
    ...(filters.free
      ? [{ key: "free", label: "Free", onRemove: () => setFilters({ free: false }) }]
      : []),
    ...(["genres", "daws", "synths"] as const).flatMap((facet) =>
      filters[facet].map((slug) => ({
        key: `${facet}-${slug}`,
        label: nameOf(facet, slug),
        onRemove: () => toggleValue(facet, slug),
      }))
    ),
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Badge key={chip.key} variant="secondary" className="pr-1" asChild>
          <button type="button" onClick={chip.onRemove} aria-label={`Remove filter ${chip.label}`}>
            {chip.label}
            <XIcon />
          </button>
        </Badge>
      ))}
      <Button variant="link" size="sm" onClick={clearAll} className="px-1">
        Clear all
      </Button>
    </div>
  )
}

/** Dims results while a filter navigation is in flight. */
export function ResultsRegion({ children }: { children: React.ReactNode }) {
  const { isPending } = useFilters()
  return (
    <div
      aria-busy={isPending}
      data-pending={isPending || undefined}
      className="transition-opacity data-pending:opacity-60"
    >
      {children}
    </div>
  )
}
