import { TextReveal } from "../components/text-reveal";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Gamepad2 } from "lucide-react";
import type { Project } from "contentlayer/generated";
import { WorkPreview } from "../components/work-preview";
import { Reveal } from "../components/reveal";
import { GameLauncher } from "../components/game-launcher";

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
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-secondary">{category === "engineering" ? "Work across web applications, backend systems, and data analysis, including my completed Spring 2026 capstone at ASU." : "Interface studies and prototypes from my computer science and film work at ASU."}</p>
        <nav aria-label="Project categories" className="mb-12 mt-8 flex gap-7 border-b border-paper/10">
          {([['engineering', '/projects', 'Engineering'], ['design', '/design', 'Design']] as const).map(([key, href, label]) => <Link key={key} href={href} aria-current={category === key ? "page" : undefined} className={`inline-flex min-h-[48px] items-center border-b-2 pb-3 text-sm ${category === key ? "border-accent-300 text-accent-300" : "border-transparent text-secondary hover:text-paper"}`}>{label}</Link>)}
        </nav>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {projects.map((project, index) => (
          <Reveal key={project.slug} as="article" className="min-w-0">
            <Link href={`/projects/${project.slug}`} className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-200 hover:border-accent-300/50 focus-visible:border-accent-300">
              {project.image && <WorkPreview className="border-b border-line bg-canvas"><Image src={project.image} alt={`${project.title} project preview`} fill sizes="(max-width: 768px) 100vw, 50vw" priority={index < 2} className="object-contain p-4 sm:p-6" /></WorkPreview>}
              <div className={`flex flex-1 flex-col p-5 sm:p-6 ${project.image ? "" : "min-h-[280px]"}`}>
                <p className="mb-3 text-sm text-secondary">{project.role}</p>
                <div className="flex items-start justify-between gap-4"><h2 className="min-w-0 font-display text-xl leading-tight tracking-tight text-paper [overflow-wrap:anywhere] sm:text-2xl">{project.title}</h2><ArrowUpRight size={20} aria-hidden="true" className="mt-1 shrink-0 text-secondary transition-colors duration-200 group-hover:text-accent-300" /></div>
                <p className="mb-5 mt-3 max-w-lg text-sm leading-7 text-secondary">{project.description}</p>
                {!project.image && project.tags && <p className="mb-5 text-xs leading-6 text-muted">{project.tags.slice(0, 4).join(" · ")}</p>}
                <p className="mt-auto flex min-h-[61px] flex-wrap items-center border-t border-line pt-4 text-xs leading-6 text-muted">{project.status}{(views[project.slug] ?? 0) > 0 && <span className="ml-3">{Intl.NumberFormat("en-US", { notation: "compact" }).format(views[project.slug])} views</span>}</p>
              </div>
            </Link>
          </Reveal>
        ))}
        {category === "engineering" && <Reveal as="article" className="min-w-0">
          <div className="flex h-full min-h-[280px] flex-col rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-4"><p className="text-sm text-secondary">Interactive experiment</p><Gamepad2 size={20} strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-muted" /></div>
            <h2 className="font-display text-xl leading-tight tracking-tight text-paper sm:text-2xl">Chronos</h2>
            <p className="mb-5 mt-3 max-w-lg text-sm leading-7 text-secondary">A small game about momentum and control. Collect fragments and avoid the rifts.</p>
            <p className="mb-5 text-xs leading-6 text-muted">React · TypeScript · Canvas</p>
            <div className="mt-auto flex min-h-[61px] items-center border-t border-line pt-4"><GameLauncher /></div>
          </div>
        </Reveal>}
      </div>
      {projects.length === 0 && <p className="py-12 text-secondary">Projects will appear here as they are published.</p>}
    </main>
  );
}
