import { allProjects } from "contentlayer/generated";
import { Redis } from "@upstash/redis";
import { ProjectsContent } from "./projects-content";

export async function ProjectList({ category }: { category: "engineering" | "design" }) {
  const order = category === "engineering"
    ? ["firmlyticSolutions", "Capstone", "sspandey", "priceTracker", "kushagrapandey", "bookstore", "OnlineBrand", "salesExplorer"]
    : ["tempeCameraRedesign", "startupPitch", "photoQuizGame", "checkoutRedesign"];
  const projects = allProjects.filter(p => p.published && (p.category === "design") === (category === "design"))
    .sort((a, b) => {
      const rank = (slug: string) => order.includes(slug) ? order.indexOf(slug) : order.length;
      return rank(a.slug) - rank(b.slug);
    });
  let views: Record<string, number> = {};
  try {
    if (projects.length && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const redis = Redis.fromEnv({ retry: { retries: 0 }, signal: () => AbortSignal.timeout(1200) });
      const counts = await redis.mget<(number | null)[]>(...projects.map(p => `pageviews:projects:${p.slug}`));
      views = Object.fromEntries(projects.map((p, i) => [p.slug, counts[i] ?? 0]));
    }
  } catch { /* Project content remains available when analytics is unavailable. */ }
  return <ProjectsContent projects={projects} category={category} views={views} />;
}
