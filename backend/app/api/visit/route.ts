import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { pageViews } from "@/db/schema";
import geoip from "geoip-country";

// Public, unauthenticated by design — this is what every visitor's browser
// calls to record a pageview. Never throws to the caller: a broken or
// missing analytics row should never affect the site itself.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = typeof body.path === "string" ? body.path.slice(0, 512) : "/";
    const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 512) : null;

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = (forwardedFor ? forwardedFor.split(",")[0].trim() : null) || req.headers.get("x-real-ip");
    const geo = ip ? geoip.lookup(ip) : null;
    const country = geo?.country ?? null;

    await db.insert(pageViews).values({ path, country, referrer }).run();
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
