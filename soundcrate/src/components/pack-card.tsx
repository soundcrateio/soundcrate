import Link from "next/link"

import { PlayButton } from "@/components/audio/play-button"
import { AffiliateButton } from "@/components/affiliate-button"
import { PackCover } from "@/components/pack-cover"
import { PackFeatures } from "@/components/pack-features"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatPrice } from "@/lib/format"
import type { Pack } from "@/lib/queries"

export function PackCard({ pack }: { pack: Pack }) {
  return (
    <Card className="group gap-4 overflow-hidden pt-0">
      <div className="relative">
        <Link href={`/packs/${pack.slug}`} className="block overflow-hidden" tabIndex={-1} aria-hidden>
          <PackCover
            slug={pack.slug}
            name={pack.name}
            imageUrl={pack.imageUrl}
            className="transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
        {pack.featured && (
          <Badge className="absolute top-3 left-3">Featured</Badge>
        )}
        {pack.previewUrl && (
          <PlayButton
            variant="overlay"
            className="absolute right-3 bottom-3"
            track={{
              slug: pack.slug,
              name: pack.name,
              brand: pack.brand,
              src: pack.previewUrl,
              imageUrl: pack.imageUrl,
            }}
          />
        )}
      </div>
      <CardHeader>
        <CardDescription>{pack.brand}</CardDescription>
        <CardTitle className="leading-snug">
          <Link href={`/packs/${pack.slug}`} className="hover:underline underline-offset-4">
            {pack.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {pack.genres.map((g) => (
            <Badge key={g.slug} variant="outline">
              {g.name}
            </Badge>
          ))}
        </div>
        <PackFeatures pack={pack} />
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <span className="font-semibold tabular-nums">
          {formatPrice(pack.priceCents, pack.currency)}
        </span>
        <AffiliateButton slug={pack.slug} size="sm" />
      </CardFooter>
    </Card>
  )
}
