import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Redis } from "@upstash/redis";
import { ProjectsContent } from "../projects/projects-content";

const redis = Redis.fromEnv();

export const revalidate = 60;

export default async function DesignPage() {
  let views: Record<string, number> = {};

  try {
    const viewsArray = await redis.mget<number[]>(
      ...allProjects.map((p) => ["pageviews", "projects", p.slug].join(":"))
    );
    views = viewsArray.reduce((acc, v, i) => {
      acc[allProjects[i].slug] = v ?? 0;
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    allProjects.forEach((p) => {
      views[p.slug] = 0;
    });
  }

  const publishedProjects = allProjects.filter((p) => p.published);

  const designOrder = ["tempeCameraRedesign", "photoQuizGame", "startupPitch", "checkoutRedesign"];
  const designProjects = publishedProjects
    .filter((p) => (p as any).category === "design")
    .sort((a, b) => {
      const indexA = designOrder.indexOf(a.slug);
      const indexB = designOrder.indexOf(b.slug);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  const engineeringProjects = publishedProjects.filter((p) => (p as any).category !== "design");

  const featured = engineeringProjects.find((p) => p.slug === "firmlyticSolutions") || engineeringProjects[0];
  const top2 = engineeringProjects.find((p) => p.slug === "Capstone") || engineeringProjects[1];
  const top3 = engineeringProjects.find((p) => p.slug === "kushagrapandey") || engineeringProjects[2];

  const rest = engineeringProjects
    .filter((p) => ![featured?.slug, top2?.slug, top3?.slug].filter(Boolean).includes(p.slug));

  const mskProject = rest.find((p) => p.slug === "onlineBrand");
  const otherProjects = rest
    .filter((p) => p.slug !== "onlineBrand")
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    );

  const sorted = mskProject ? [...otherProjects, mskProject] : otherProjects;

  return (
    <div className="relative pb-16">
      <Navigation />
      {featured && top2 && top3 && (
        <ProjectsContent 
          featured={featured} 
          top2={top2} 
          top3={top3} 
          sorted={sorted} 
          views={views} 
          designProjects={designProjects} 
          initialTab="design" 
        />
      )}
    </div>
  );
}
