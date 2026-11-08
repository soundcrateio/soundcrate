"use client"

import { useFilters } from "@/components/filters/filters-provider"
import { Button } from "@/components/ui/button"

export function ClearFiltersButton() {
  const { clearAll } = useFilters()
  return (
    <Button variant="outline" onClick={clearAll}>
      Clear all filters
    </Button>
  )
}
