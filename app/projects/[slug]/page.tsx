import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";
import { Redis } from "@upstash/redis";
import { ProjectScrollReveal } from "./scroll-reveal";

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
    <div className="bg-zinc-50 min-h-screen">
      <Header project={project} views={views} />
      <ReportView slug={project.slug} />

      <ProjectScrollReveal>
        <div className="px-4 py-12 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2 prose prose-zinc prose-quoteless">
              <Mdx code={project.body.code} />
            </article>
            
            <aside className="lg:col-span-1 pt-12">
              <div className="sticky top-8 bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-widest mb-4">Core Stack</h3>
                <div className="space-y-2">
                  {project.tags && project.tags.map((tag: string) => (
                    <div key={tag} className="text-sm text-zinc-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full"></span>
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </ProjectScrollReveal>
    </div>
  );
}
