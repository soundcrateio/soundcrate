"use client"

import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import {
  filtersToSearchParams,
  type PackFilters,
} from "@/lib/filters"

type FilterOption = { slug: string; name: string }

export type FilterOptions = {
  genres: FilterOption[]
  daws: FilterOption[]
  synths: FilterOption[]
}

type FiltersContextValue = {
  filters: PackFilters
  options: FilterOptions
  isPending: boolean
  setFilters: (patch: Partial<PackFilters>) => void
  toggleValue: (key: "genres" | "daws" | "synths", slug: string) => void
  clearAll: () => void
}

const FiltersContext = React.createContext<FiltersContextValue | null>(null)

export function useFilters() {
  const ctx = React.useContext(FiltersContext)
  if (!ctx) throw new Error("useFilters must be used inside <FiltersProvider>")
  return ctx
}

/**
 * Holds the current filters (parsed on the server from the URL) and pushes
 * changes back into the URL. The URL is the source of truth, so filtered
 * views are shareable and bookmarkable.
 */
export function FiltersProvider({
  filters,
  options,
  children,
}: {
  filters: PackFilters
  options: FilterOptions
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = React.useTransition()
  const [optimistic, setOptimistic] = React.useOptimistic(filters)

  const setFilters = React.useCallback(
    (patch: Partial<PackFilters>) => {
      const next = { ...optimistic, ...patch }
      const qs = filtersToSearchParams(next).toString()
      startTransition(() => {
        setOptimistic(next)
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
      })
    },
    [optimistic, pathname, router, setOptimistic]
  )

  const toggleValue = React.useCallback(
    (key: "genres" | "daws" | "synths", slug: string) => {
      const current = optimistic[key]
      const next = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug].sort()
      setFilters({ [key]: next })
    },
    [optimistic, setFilters]
  )

  const clearAll = React.useCallback(
    () =>
      setFilters({
        q: "",
        genres: [],
        daws: [],
        synths: [],
        midi: false,
        presets: false,
        free: false,
      }),
    [setFilters]
  )

  const value = React.useMemo(
    () => ({
      filters: optimistic,
      options,
      isPending,
      setFilters,
      toggleValue,
      clearAll,
    }),
    [optimistic, options, isPending, setFilters, toggleValue, clearAll]
  )

  return <FiltersContext value={value}>{children}</FiltersContext>
}
