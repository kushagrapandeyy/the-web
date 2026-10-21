import { TextReveal } from "../../components/text-reveal";
import { Reveal } from "../../components/reveal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = { project: { title: string; description: string; category?: string } };

export function Header({ project }: Props) {
  return (
    <>

      <header className="page-width pb-12 pt-24 sm:pb-16">
        <Link href={project.category === "design" ? "/design" : "/projects"} className="mb-7 inline-flex min-h-[44px] items-center gap-2 text-sm text-zinc-400 hover:text-accent-300"><ArrowLeft size={16} aria-hidden="true" />{project.category === "design" ? "Design" : "Projects"}</Link>
        <TextReveal as="h1" className="page-title max-w-4xl">{project.title}</TextReveal>
        <Reveal delay={0.12}><p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">{project.description}</p></Reveal>
      </header>
    </>
  );
}
