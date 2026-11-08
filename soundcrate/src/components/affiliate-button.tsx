import { ExternalLinkIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * Outbound link to the pack's official page. Goes through /go/[slug] so
 * clicks are counted, and is marked rel="sponsored" for search engines.
 */
export function AffiliateButton({
  slug,
  children = "Get pack",
  ...props
}: { slug: string } & Omit<React.ComponentProps<typeof Button>, "asChild">) {
  return (
    <Button asChild {...props}>
      <a href={`/go/${slug}`} target="_blank" rel="sponsored nofollow noopener">
        {children}
        <ExternalLinkIcon data-icon="inline-end" />
      </a>
    </Button>
  )
}
