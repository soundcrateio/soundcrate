import { KeyboardMusicIcon, SlidersHorizontalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { Pack } from "@/lib/queries"

/** MIDI / presets badges, with the synths the presets are for. */
export function PackFeatures({ pack }: { pack: Pick<Pack, "hasMidi" | "hasPresets" | "synths"> }) {
  if (!pack.hasMidi && !pack.hasPresets) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {pack.hasMidi && (
        <Badge variant="secondary">
          <KeyboardMusicIcon />
          MIDI
        </Badge>
      )}
      {pack.hasPresets &&
        (pack.synths.length ? (
          pack.synths.map((s) => (
            <Badge key={s.slug} variant="secondary">
              <SlidersHorizontalIcon />
              {s.name}
            </Badge>
          ))
        ) : (
          <Badge variant="secondary">
            <SlidersHorizontalIcon />
            Presets
          </Badge>
        ))}
    </div>
  )
}
