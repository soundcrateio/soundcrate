"use client"

import * as React from "react"

export type Track = {
  slug: string
  name: string
  brand: string
  src: string
  imageUrl?: string | null
}

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "error"

type PlayerContextValue = {
  track: Track | null
  status: PlayerStatus
  volume: number
  muted: boolean
  /** Play a track; calling it with the current track toggles play/pause. */
  toggle: (track: Track) => void
  pause: () => void
  resume: () => void
  seek: (seconds: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  stop: () => void
}

type ProgressContextValue = { currentTime: number; duration: number }

const PlayerContext = React.createContext<PlayerContextValue | null>(null)
// Kept separate so time updates only re-render the progress UI, not every play button.
const ProgressContext = React.createContext<ProgressContextValue>({
  currentTime: 0,
  duration: 0,
})

export function usePlayer() {
  const ctx = React.useContext(PlayerContext)
  if (!ctx) throw new Error("usePlayer must be used inside <AudioPlayerProvider>")
  return ctx
}

export function usePlayerProgress() {
  return React.useContext(ProgressContext)
}

const VOLUME_KEY = "player-volume"

// Only affects the player bar, which renders after user interaction,
// so reading localStorage here can't cause a hydration mismatch.
function readSavedVolume() {
  try {
    const raw = typeof window === "undefined" ? null : localStorage.getItem(VOLUME_KEY)
    const v = raw === null ? NaN : Number(raw)
    return v >= 0 && v <= 1 ? v : 0.8
  } catch {
    return 0.8
  }
}

/**
 * One shared <audio> element for the whole site, so only one preview plays
 * at a time and playback continues while navigating between pages.
 */
export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [track, setTrack] = React.useState<Track | null>(null)
  const [status, setStatus] = React.useState<PlayerStatus>("idle")
  const [volume, setVolumeState] = React.useState(readSavedVolume)
  const [muted, setMuted] = React.useState(false)
  const [progress, setProgress] = React.useState<ProgressContextValue>({
    currentTime: 0,
    duration: 0,
  })

  // Create the audio element once, on the client.
  React.useEffect(() => {
    const audio = new Audio()
    audio.preload = "metadata"
    audioRef.current = audio

    audio.volume = readSavedVolume()

    const onTime = () =>
      setProgress({
        currentTime: audio.currentTime,
        duration: Number.isFinite(audio.duration) ? audio.duration : 0,
      })
    const onPlaying = () => setStatus("playing")
    const onPause = () => setStatus((s) => (s === "error" ? s : "paused"))
    const onWaiting = () => setStatus("loading")
    const onEnded = () => {
      setStatus("paused")
      audio.currentTime = 0
    }
    const onError = () => {
      if (audio.getAttribute("src")) setStatus("error")
    }

    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("loadedmetadata", onTime)
    audio.addEventListener("durationchange", onTime)
    audio.addEventListener("playing", onPlaying)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("waiting", onWaiting)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("error", onError)

    return () => {
      audio.pause()
      audio.removeAttribute("src")
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("loadedmetadata", onTime)
      audio.removeEventListener("durationchange", onTime)
      audio.removeEventListener("playing", onPlaying)
      audio.removeEventListener("pause", onPause)
      audio.removeEventListener("waiting", onWaiting)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("error", onError)
      audioRef.current = null
    }
  }, [])

  const playAudio = React.useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.play().catch((err: unknown) => {
      // AbortError just means another play/pause interrupted this one.
      if (err instanceof DOMException && err.name === "AbortError") return
      setStatus("error")
    })
  }, [])

  const toggle = React.useCallback(
    (next: Track) => {
      const audio = audioRef.current
      if (!audio) return

      if (track?.src === next.src && status !== "error") {
        if (audio.paused) playAudio()
        else audio.pause()
        return
      }

      setTrack(next)
      setStatus("loading")
      setProgress({ currentTime: 0, duration: 0 })
      audio.src = next.src
      playAudio()
    },
    [track, status, playAudio]
  )

  const pause = React.useCallback(() => audioRef.current?.pause(), [])
  const resume = React.useCallback(() => playAudio(), [playAudio])

  const seek = React.useCallback((seconds: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return
    audio.currentTime = Math.min(Math.max(seconds, 0), audio.duration)
    setProgress((p) => ({ ...p, currentTime: audio.currentTime }))
  }, [])

  const setVolume = React.useCallback((v: number) => {
    const audio = audioRef.current
    const clamped = Math.min(Math.max(v, 0), 1)
    if (audio) {
      audio.volume = clamped
      audio.muted = clamped === 0
    }
    setVolumeState(clamped)
    setMuted(clamped === 0)
    try {
      localStorage.setItem(VOLUME_KEY, String(clamped))
    } catch {}
  }, [])

  const toggleMute = React.useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setMuted(audio.muted)
  }, [])

  const stop = React.useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.removeAttribute("src")
      audio.load()
    }
    setTrack(null)
    setStatus("idle")
    setProgress({ currentTime: 0, duration: 0 })
  }, [])

  // Lock-screen / media-key controls.
  React.useEffect(() => {
    if (!("mediaSession" in navigator)) return
    const ms = navigator.mediaSession
    if (!track) {
      ms.metadata = null
      return
    }
    ms.metadata = new MediaMetadata({
      title: track.name,
      artist: track.brand,
      album: "Sample pack preview",
      ...(track.imageUrl ? { artwork: [{ src: track.imageUrl }] } : {}),
    })
    ms.setActionHandler("play", resume)
    ms.setActionHandler("pause", pause)
    ms.setActionHandler("stop", stop)
    ms.setActionHandler("seekto", (d) => d.seekTime != null && seek(d.seekTime))
    return () => {
      for (const action of ["play", "pause", "stop", "seekto"] as const) {
        ms.setActionHandler(action, null)
      }
    }
  }, [track, resume, pause, stop, seek])

  const value = React.useMemo(
    () => ({
      track,
      status,
      volume,
      muted,
      toggle,
      pause,
      resume,
      seek,
      setVolume,
      toggleMute,
      stop,
    }),
    [track, status, volume, muted, toggle, pause, resume, seek, setVolume, toggleMute, stop]
  )

  return (
    <PlayerContext value={value}>
      <ProgressContext value={progress}>{children}</ProgressContext>
    </PlayerContext>
  )
}
