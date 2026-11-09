import type { Metadata } from "next"

import { siteConfig } from "@/lib/site"

export const metadata: Metadata = { title: "Affiliate disclosure" }

export default function DisclosurePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Affiliate disclosure</h1>
      <p className="text-muted-foreground">
        {siteConfig.name} is reader-supported. Some links to sample packs on
        this site are affiliate links: if you buy a pack after clicking one, we
        may earn a commission at no extra cost to you.
      </p>
      <p className="text-muted-foreground">
        Commissions never affect which packs are listed or how they are
        described. Prices and availability are set by the sellers and may
        change — always check the official product page before buying.
      </p>
    </div>
  )
}
