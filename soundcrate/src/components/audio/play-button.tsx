"use client"

import { PauseIcon, PlayIcon } from "lucide-react"

import { type Track, usePlayer } from "@/components/audio/audio-player-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

/**
 * Plays/pauses a pack's audio preview in the shared player.
 * - `overlay`: round icon button for cover art
 * - `default`: labelled button for the detail page
 */
export function PlayButton({
  track,
  variant = "default",
  className,
}: {
  track: Track
  variant?: "default" | "overlay"
  className?: string
}) {
  const { track: current, status, toggle } = usePlayer()
  const isCurrent = current?.src === track.src
  const isPlaying = isCurrent && status === "playing"
  const isLoading = isCurrent && status === "loading"
  const label = `${isPlaying ? "Pause" : "Play"} preview of ${track.name}`

  const icon = isLoading ? (
    <Spinner />
  ) : isPlaying ? (
    <PauseIcon className={cn(variant === "overlay" && "fill-current")} />
  ) : (
    <PlayIcon className={cn(variant === "overlay" && "fill-current")} />
  )

  if (variant === "overlay") {
    return (
      <Button
        type="button"
        size="icon-lg"
        aria-label={label}
        aria-pressed={isPlaying}
        onClick={() => toggle(track)}
        className={cn("rounded-full shadow-lg", className)}
      >
        {icon}
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      aria-label={label}
      aria-pressed={isPlaying}
      onClick={() => toggle(track)}
      className={className}
    >
      {isLoading ? (
        <Spinner data-icon="inline-start" />
      ) : isPlaying ? (
        <PauseIcon data-icon="inline-start" />
      ) : (
        <PlayIcon data-icon="inline-start" />
      )}
      {isPlaying ? "Pause preview" : "Play preview"}
    </Button>
  )
}
