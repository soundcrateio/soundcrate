export function formatPrice(cents: number | null, currency = "USD") {
  if (cents === null) return "Free"
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    cents / 100
  )
}

export function formatSize(mb: number | null) {
  if (!mb) return null
  return mb >= 1000 ? `${(mb / 1000).toFixed(1)} GB` : `${mb} MB`
}
