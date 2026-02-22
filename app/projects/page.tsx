import Link from "next/link";
import React from "react";
import { allProjects } from ".contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";
import { Redis } from "@upstash/redis";
import { Eye } from "lucide-react";
import { ProjectsContent } from "./projects-content";

const redis = Redis.fromEnv();

export const revalidate = 60;

export default async function ProjectsPage() {
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
    // If Redis fails, just use zero views for all projects
    allProjects.forEach((p) => {
      views[p.slug] = 0;
    });
  }

  // Ensure featured/top projects exist
  const featured = allProjects.find((p) => p.slug === "firmlyticSolutions");
  const top2 = allProjects.find((p) => p.slug === "capstone");
  const top3 = allProjects.find((p) => p.slug === "kushagrapandey");

  if (!featured || !top2 || !top3) {
    throw new Error("Missing required featured/top projects");
  }

  const sorted = allProjects
    .filter((p) => p.published)
    .filter((p) => ![featured.slug, top2.slug, top3.slug].includes(p.slug))
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    );

  return (
    <div className="relative pb-16">
      <Navigation />
      <ProjectsContent featured={featured} top2={top2} top3={top3} sorted={sorted} views={views} />
    </div>
  );
}
