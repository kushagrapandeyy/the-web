import { TextReveal } from "../components/text-reveal";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "contentlayer/generated";
import { WorkPreview } from "../components/work-preview";
import { Reveal } from "../components/reveal";
import { Playground } from "../components/playground";

type Props = {
  projects: Project[];
  views: Record<string, number>;
  category: "engineering" | "design";
};

export function ProjectsContent({ projects, views, category }: Props) {
  return (
    <main id="main-content" className="page-width pb-24 pt-28 sm:pt-32">
      <div>
        <TextReveal as="h1" className="page-title">{category === "engineering" ? "What I’ve built." : "What I’ve designed."}</TextReveal>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">{category === "engineering" ? "From Firmlytic’s legal beta to a sponsored ASU capstone: the problems I took on, the systems I built, and what I learned along the way." : "Interface studies and interactive prototypes shaped by my work in computer science, film, and media at ASU."}</p>
        <nav aria-label="Project categories" className="mb-12 mt-8 flex gap-7 border-b border-white/10">
          {([['engineering', '/projects', 'Engineering'], ['design', '/design', 'Design']] as const).map(([key, href, label]) => <Link key={key} href={href} aria-current={category === key ? "page" : undefined} className={`inline-flex min-h-[48px] items-center border-b-2 pb-3 text-sm ${category === key ? "border-accent-300 text-accent-300" : "border-transparent text-zinc-400 hover:text-zinc-100"}`}>{label}</Link>)}
        </nav>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.slug} as="article" className="min-w-0">
            <Link href={`/projects/${project.slug}`} className={`group flex h-full min-w-0 flex-col ${project.image ? "" : "rounded-lg border border-white/10 bg-white/[0.02] p-6 sm:p-8"}`}>
              {project.image && <WorkPreview className="rounded-lg border border-white/10 bg-[#191c1a] transition-colors duration-200 group-hover:border-accent-300/40"><Image src={project.image} alt={`${project.title} project preview`} fill sizes="(max-width: 768px) 100vw, 50vw" priority={index < 2} className="object-contain p-3 sm:p-4" /></WorkPreview>}
              <div className={`flex flex-1 flex-col ${project.image ? "pt-5" : "justify-center"}`}>
                <p className="mb-3 text-sm text-accent-300">{project.role}</p>
                <div className="flex items-start justify-between gap-4"><h2 className="min-w-0 font-display text-2xl leading-tight tracking-tight text-zinc-100">{project.title}</h2><ArrowUpRight size={20} aria-hidden="true" className="mt-1 shrink-0 text-zinc-400 transition-colors duration-200 group-hover:text-accent-300" /></div>
                <p className="mb-5 mt-3 text-sm leading-7 text-zinc-400">{project.description}</p>
                <p className="mt-auto pt-2 text-xs leading-6 text-zinc-400">{project.status}{(views[project.slug] ?? 0) > 0 && <span className="ml-3 text-zinc-500">{Intl.NumberFormat("en-US", { notation: "compact" }).format(views[project.slug])} views</span>}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      {projects.length === 0 && <p className="py-12 text-zinc-400">Projects will appear here as they are published.</p>}
      {category === "engineering" && <div className="mt-16"><Playground /></div>}
    </main>
  );
}
