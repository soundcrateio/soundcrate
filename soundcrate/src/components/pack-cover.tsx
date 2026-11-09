import { cn } from "@/lib/utils"

function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Cover art for a pack. Uses the pack's image when it has one, otherwise
 * draws a deterministic "waveform" artwork from the slug.
 */
export function PackCover({
  slug,
  name,
  imageUrl,
  className,
}: {
  slug: string
  name: string
  imageUrl?: string | null
  className?: string
}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- affiliate images come from arbitrary hosts
      <img
        src={imageUrl}
        alt={name}
        className={cn("aspect-square w-full object-cover", className)}
      />
    )
  }

  const rand = rng(hash(slug))
  const hue = Math.floor(rand() * 360)
  const hue2 = (hue + 40 + Math.floor(rand() * 80)) % 360
  const bars = 28
  const heights = Array.from({ length: bars }, (_, i) => {
    const env = Math.sin((i / (bars - 1)) * Math.PI)
    return 0.12 + env * (0.35 + rand() * 0.5)
  })

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${name} cover`}
      className={cn("aspect-square w-full", className)}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`g-${slug}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`oklch(0.28 0.08 ${hue})`} />
          <stop offset="100%" stopColor={`oklch(0.16 0.04 ${hue2})`} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#g-${slug})`} />
      {heights.map((h, i) => {
        const w = 100 / bars
        const barH = h * 60
        return (
          <rect
            key={i}
            x={i * w + w * 0.2}
            y={50 - barH / 2}
            width={w * 0.6}
            height={barH}
            rx={w * 0.3}
            fill={`oklch(0.88 0.17 ${i % 5 === 0 ? hue2 : hue})`}
            opacity={0.55 + h * 0.45}
          />
        )
      })}
      <text
        x="6"
        y="92"
        fill="oklch(0.97 0 0)"
        fontSize="7"
        fontWeight="700"
        fontFamily="var(--font-geist-sans), sans-serif"
        letterSpacing="-0.2"
      >
        {name.length > 26 ? name.slice(0, 25) + "…" : name}
      </text>
    </svg>
  )
}
