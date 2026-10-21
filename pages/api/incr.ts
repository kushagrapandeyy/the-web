import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// Keep MDX out of the edge bundle; check-analytics verifies this list against published projects.
const publishedSlugs = new Set([
  "Capstone", "OnlineBrand", "bookstore", "checkoutRedesign", "firmlyticSolutions",
  "kushagrapandey", "photoQuizGame", "priceTracker", "salesExplorer", "sspandey",
  "startupPitch", "tempeCameraRedesign",
]);
export const config = {
  runtime: "edge",
};

export default async function incr(req: NextRequest): Promise<NextResponse> {
  if (req.method !== "POST") {
    return new NextResponse("use POST", { status: 405, headers: { Allow: "POST" } });
  }
  if (req.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return new NextResponse("must be json", { status: 400 });
  }

  let body: unknown;
  try { body = await req.json(); }
  catch { return new NextResponse("Invalid JSON", { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body) || !("slug" in body) || typeof body.slug !== "string" || !body.slug) {
    return new NextResponse("Slug not found", { status: 400 });
  }
  const slug = body.slug;
  if (!publishedSlugs.has(slug)) return new NextResponse("Project not found", { status: 404 });
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return new NextResponse(null, { status: 204 });
  try {
    const redis = Redis.fromEnv({ retry: { retries: 0 }, signal: () => AbortSignal.timeout(1200) });
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : undefined;
    if (ip) {
      // Hash the IP in order to not store it directly in your db.
      const buf = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(ip),
      );
      const hash = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // deduplicate the ip for each slug
      const isNew = await redis.set(["deduplicate", hash, slug].join(":"), true, {
        nx: true,
        ex: 24 * 60 * 60,
      });
      if (!isNew) {
        return new NextResponse(null, { status: 202 });
      }
    }
    await redis.incr(["pageviews", "projects", slug].join(":"));
    return new NextResponse(null, { status: 202 });
  } catch {
    return new NextResponse("Analytics unavailable", { status: 503 });
  }
}
