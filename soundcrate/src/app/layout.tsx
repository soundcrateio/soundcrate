import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { AudioPlayerProvider } from "@/components/audio/audio-player-provider"
import { PlayerBar } from "@/components/audio/player-bar"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { siteConfig } from "@/lib/site"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — EDM sample pack directory`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AudioPlayerProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <PlayerBar />
          </AudioPlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
