import { AudioLinesIcon } from "lucide-react"
import Link from "next/link"

import { siteConfig } from "@/lib/site"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight whitespace-nowrap">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <AudioLinesIcon className="size-4" />
          </span>
          {siteConfig.name}
        </Link>
        <nav className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="/">Browse packs</Link>
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="/disclosure">Affiliate disclosure</Link>
          </Button>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}
