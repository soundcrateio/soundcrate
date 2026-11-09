import Link from "next/link"

import { siteConfig } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>{siteConfig.name} — hand-picked sample packs for electronic producers.</p>
        <p>
          Some links are affiliate links.{" "}
          <Link href="/disclosure" className="underline underline-offset-4 hover:text-foreground">
            Learn more
          </Link>
        </p>
      </div>
    </footer>
  )
}
