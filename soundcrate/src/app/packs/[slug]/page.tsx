import { ArrowLeftIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { PlayButton } from "@/components/audio/play-button"
import { AffiliateButton } from "@/components/affiliate-button"
import { PackCard } from "@/components/pack-card"
import { PackCover } from "@/components/pack-cover"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice, formatSize } from "@/lib/format"
import {
  getAllPackSlugs,
  getPackBySlug,
  getRelatedPacks,
  type Pack,
} from "@/lib/queries"

export async function generateStaticParams() {
  const slugs = await getAllPackSlugs()
  // Cache Components requires at least one param; unlisted slugs render on request.
  return slugs.length ? slugs : [{ slug: "placeholder" }]
}

export async function generateMetadata({
  params,
}: PageProps<"/packs/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const pack = await getPackBySlug(slug)
  if (!pack) return { title: "Pack not found" }
  return {
    title: `${pack.name} by ${pack.brand}`,
    description: pack.description,
  }
}

export default function PackPage({ params }: PageProps<"/packs/[slug]">) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" className="self-start" asChild>
        <Link href="/">
          <ArrowLeftIcon data-icon="inline-start" />
          All packs
        </Link>
      </Button>
      <Suspense fallback={<PackSkeleton />}>
        <PackDetails params={params} />
      </Suspense>
    </div>
  )
}

async function PackDetails({ params }: Pick<PageProps<"/packs/[slug]">, "params">) {
  const { slug } = await params
  const pack = await getPackBySlug(slug)
  if (!pack) notFound()

  const related = await getRelatedPacks(
    pack.id,
    pack.genres.map((g) => g.slug)
  )

  return (
    <>
      <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12">
        <div className="self-start overflow-hidden rounded-xl border">
          <PackCover slug={pack.slug} name={pack.name} imageUrl={pack.imageUrl} />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">{pack.brand}</p>
            <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {pack.name}
            </h1>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {pack.genres.map((g) => (
                <Badge key={g.slug} variant="outline" asChild>
                  <Link href={`/?genre=${g.slug}`}>{g.name}</Link>
                </Badge>
              ))}
            </div>
          </div>

          <p className="text-pretty text-muted-foreground">{pack.description}</p>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-2xl font-semibold tabular-nums">
              {formatPrice(pack.priceCents, pack.currency)}
            </span>
            <AffiliateButton slug={pack.slug} size="lg">
              Get it on the official site
            </AffiliateButton>
            {pack.previewUrl && (
              <PlayButton
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
          <p className="text-xs text-muted-foreground">
            Affiliate link — we may earn a commission at no extra cost to you.
          </p>

          <Separator />

          <PackSpecs pack={pack} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">You might also like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PackCard key={p.id} pack={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

function PackSpecs({ pack }: { pack: Pack }) {
  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: "MIDI",
      value: pack.hasMidi ? "Included" : "Not included",
    },
    {
      label: "Presets",
      value: pack.hasPresets ? (
        <div className="flex flex-wrap justify-end gap-1.5">
          {pack.synths.length
            ? pack.synths.map((s) => (
                <Badge key={s.slug} variant="secondary" asChild>
                  <Link href={`/?synth=${s.slug}`}>{s.name}</Link>
                </Badge>
              ))
            : "Included"}
        </div>
      ) : (
        "Not included"
      ),
    },
    {
      label: "DAW",
      value: (
        <div className="flex flex-wrap justify-end gap-1.5">
          {pack.daws.map((d) => (
            <Badge key={d.slug} variant="outline" asChild>
              <Link href={`/?daw=${d.slug}`}>{d.name}</Link>
            </Badge>
          ))}
        </div>
      ),
    },
    ...(pack.sampleCount
      ? [{ label: "Samples", value: pack.sampleCount.toLocaleString("en-US") }]
      : []),
    ...(pack.sizeMb ? [{ label: "Download size", value: formatSize(pack.sizeMb) }] : []),
    ...(pack.releasedAt
      ? [
          {
            label: "Released",
            value: new Date(pack.releasedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            }),
          },
        ]
      : []),
  ]

  return (
    <dl className="flex flex-col divide-y text-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex items-start justify-between gap-6 py-3">
          <dt className="shrink-0 text-muted-foreground">{row.label}</dt>
          <dd className="text-right font-medium">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function PackSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-48" />
      </div>
    </div>
  )
}
