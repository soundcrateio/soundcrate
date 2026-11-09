import { SearchXIcon } from "lucide-react"
import { Suspense } from "react"

import {
  ActiveFilters,
  FilterToolbar,
  ResultsRegion,
} from "@/components/filters/filter-toolbar"
import { FilterPanel } from "@/components/filters/filter-panel"
import { FiltersProvider } from "@/components/filters/filters-provider"
import { PackCard } from "@/components/pack-card"
import { ClearFiltersButton } from "@/components/filters/clear-filters-button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { parseFilters } from "@/lib/filters"
import { getFilterOptions, searchPacks } from "@/lib/queries"

export default function HomePage({ searchParams }: PageProps<"/">) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
      <section className="flex max-w-2xl flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Find your next sample pack
        </h1>
        <p className="text-lg text-pretty text-muted-foreground">
          Browse EDM sample packs by genre and DAW — and see at a glance which
          ones ship with MIDI or presets for Serum, Vital, Massive and more.
        </p>
      </section>
      <Suspense fallback={<DirectorySkeleton />}>
        <Directory searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function Directory({
  searchParams,
}: {
  searchParams: PageProps<"/">["searchParams"]
}) {
  const filters = parseFilters(await searchParams)
  const [options, packs] = await Promise.all([
    getFilterOptions(),
    searchPacks(filters),
  ])

  return (
    <FiltersProvider filters={filters} options={options}>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100svh-6rem)] overflow-y-auto pr-2">
            <FilterPanel />
          </div>
        </aside>
        <div className="flex min-w-0 flex-col gap-4">
          <FilterToolbar resultCount={packs.length} />
          <ActiveFilters />
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {packs.length} {packs.length === 1 ? "pack" : "packs"}
          </p>
          <ResultsRegion>
            {packs.length ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {packs.map((pack) => (
                  <PackCard key={pack.id} pack={pack} />
                ))}
              </div>
            ) : (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <SearchXIcon />
                  </EmptyMedia>
                  <EmptyTitle>No packs match</EmptyTitle>
                  <EmptyDescription>
                    Try removing a filter or searching for something else.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <ClearFiltersButton />
                </EmptyContent>
              </Empty>
            )}
          </ResultsRegion>
        </div>
      </div>
    </FiltersProvider>
  )
}

function DirectorySkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <div className="hidden flex-col gap-3 lg:flex">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-full sm:max-w-sm" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
