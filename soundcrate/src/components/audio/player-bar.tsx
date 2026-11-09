"use client"

import {
  PauseIcon,
  PlayIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
  XIcon,
} from "lucide-react"
import Link from "next/link"
import * as React from "react"

import {
  usePlayer,
  usePlayerProgress,
} from "@/components/audio/audio-player-provider"
import { PackCover } from "@/components/pack-cover"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"

function formatTime(s: number) {
  if (!Number.isFinite(s) || s < 0) s = 0
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, "0")}`
}

function Progress() {
  const { seek, track } = usePlayer()
  const { currentTime, duration } = usePlayerProgress()
  // While dragging, show the drag position instead of the live time.
  const [dragValue, setDragValue] = React.useState<number | null>(null)
  const value = dragValue ?? currentTime

  return (
    <div className="flex w-full items-center gap-3">
      <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">
        {formatTime(value)}
      </span>
      <Slider
        aria-label={`Seek ${track?.name ?? ""} preview`}
        min={0}
        max={duration || 1}
        step={0.1}
        value={[Math.min(value, duration || 1)]}
        disabled={!duration}
        onValueChange={([v]) => setDragValue(v)}
        onValueCommit={([v]) => {
          seek(v)
          setDragValue(null)
        }}
      />
      <span className="w-10 text-xs text-muted-foreground tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  )
}

function VolumeControl() {
  const { volume, muted, setVolume, toggleMute } = usePlayer()
  const effective = muted ? 0 : volume
  const Icon = effective === 0 ? VolumeXIcon : effective < 0.5 ? Volume1Icon : Volume2Icon

  return (
    <div className="hidden w-36 items-center gap-2 md:flex">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={muted ? "Unmute" : "Mute"}
        onClick={toggleMute}
      >
        <Icon />
      </Button>
      <Slider
        aria-label="Volume"
        min={0}
        max={1}
        step={0.01}
        value={[effective]}
        onValueChange={([v]) => setVolume(v)}
      />
    </div>
  )
}

/** Sticky bottom bar shown while a preview is loaded. */
export function PlayerBar() {
  const { track, status, pause, resume, stop } = usePlayer()
  if (!track) return null

  const isPlaying = status === "playing"

  return (
    <>
      {/* Spacer so the fixed bar never covers the footer. */}
      <div aria-hidden className="h-20" />
      <section
        aria-label="Audio preview player"
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75"
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-4 sm:gap-5 sm:px-6">
          <Link
            href={`/packs/${track.slug}`}
            className="flex min-w-0 items-center gap-3 sm:w-64"
          >
            <span className="size-12 shrink-0 overflow-hidden rounded-md">
              <PackCover slug={track.slug} name="" imageUrl={track.imageUrl} />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">{track.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {status === "error" ? "Preview unavailable" : track.brand}
              </span>
            </span>
          </Link>

          <Button
            size="icon"
            className="shrink-0 rounded-full"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={isPlaying ? pause : resume}
            disabled={status === "error"}
          >
            {status === "loading" ? (
              <Spinner />
            ) : isPlaying ? (
              <PauseIcon className="fill-current" />
            ) : (
              <PlayIcon className="fill-current" />
            )}
          </Button>

          <div className="hidden min-w-0 flex-1 sm:flex">
            <Progress />
          </div>

          <VolumeControl />

          <Button
            variant="ghost"
            size="icon-sm"
            className="ml-auto shrink-0 sm:ml-0"
            aria-label="Close player"
            onClick={stop}
          >
            <XIcon />
          </Button>
        </div>
        {/* Compact progress line on small screens. */}
        <MobileProgressLine />
      </section>
    </>
  )
}

function MobileProgressLine() {
  const { currentTime, duration } = usePlayerProgress()
  const pct = duration ? (currentTime / duration) * 100 : 0
  return (
    <div className="absolute inset-x-0 top-0 h-0.5 bg-muted sm:hidden" aria-hidden>
      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
    </div>
  )
}
