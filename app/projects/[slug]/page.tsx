import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";
import { Redis } from "@upstash/redis";
import { ProjectScrollReveal } from "./scroll-reveal";
import { ProjectSidebar } from "./sidebar";

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

const redis = Redis.fromEnv();

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allProjects
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const project = allProjects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  const views =
    (await redis.get<number>(["pageviews", "projects", slug].join(":"))) ?? 0;

  return (
    <div className="bg-black min-h-screen text-zinc-100 relative overflow-hidden">
      {/* Ambient Grid and Glow Overlays */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(20,184,166,0.06) 0%, transparent 80%)",
        }}
      />
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-20 z-0" />
      <div className="fixed -top-40 -left-40 w-96 h-96 rounded-full bg-teal-550/5 blur-[120px] pointer-events-none animate-pulse-slow z-0" />
      <div className="fixed top-1/2 -right-40 w-96 h-96 rounded-full bg-emerald-550/5 blur-[120px] pointer-events-none animate-pulse-slow z-0" />

      <Header project={project} views={views} />
      <ReportView slug={project.slug} />

      <ProjectScrollReveal>
        <div className="px-6 py-16 mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <article className="lg:col-span-2 prose prose-zinc prose-invert prose-teal max-w-none prose-quoteless">
              <Mdx code={project.body.code} />
            </article>
            
            <ProjectSidebar 
              tags={project.tags} 
              role={project.role} 
              date={project.date} 
              status={project.status}
              url={project.url}
              repository={project.repository}
            />
          </div>
        </div>
      </ProjectScrollReveal>
    </div>
  );
}
