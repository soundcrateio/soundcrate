import { NextResponse } from "next/server"

import { recordClickAndGetUrl } from "@/lib/queries"

/**
 * Affiliate redirect: /go/<pack-slug> → the pack's affiliate URL.
 * Counts the click, then sends a 307 so the link is never cached.
 */
export async function GET(
  request: Request,
  { params }: RouteContext<"/go/[slug]">
) {
  const { slug } = await params
  const url = await recordClickAndGetUrl(slug)
  if (!url) return NextResponse.redirect(new URL("/", request.url))

  const res = NextResponse.redirect(url, 307)
  res.headers.set("X-Robots-Tag", "noindex, nofollow")
  return res
}
