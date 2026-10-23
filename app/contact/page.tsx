import { TextReveal } from "../components/text-reveal";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "../components/reveal";

export default function ContactPage() {
  return <main id="main-content" className="contact-page min-h-dvh bg-sand pb-16 pt-32 text-[#24251f] sm:pb-24 sm:pt-40">
    <div className="page-width">
      <TextReveal as="h1" className="max-w-4xl font-display text-[clamp(3rem,7vw,6.5rem)] leading-[1.02] tracking-[-0.045em]">Let’s build something worthwhile.</TextReveal>
      <Reveal>
        <p className="mt-8 max-w-lg text-lg leading-relaxed text-[#515347]">Looking for new grad and entry-level software engineering roles. Open to relocation.</p>
        <a href="mailto:kushagrapandeyy@gmail.com" className="contact-email group mt-16 flex min-h-[44px] items-center justify-between gap-4 border-b border-black/25 pb-6 text-[clamp(1.1rem,3.1vw,2.8rem)] tracking-tight"><span className="break-all">kushagrapandeyy@gmail.com</span><ArrowUpRight size={32} aria-hidden="true" className="shrink-0 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" /></a>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <a href="https://www.linkedin.com/in/kushagra--pandey/" target="_blank" rel="noopener noreferrer" className="group"><span className="inline-flex min-h-[44px] items-center gap-2 text-lg">LinkedIn <ArrowUpRight size={18} aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span><span className="block text-sm text-[#515347]">Experience and professional background</span></a>
          <a href="https://github.com/kushagrapandeyy" target="_blank" rel="noopener noreferrer" className="group"><span className="inline-flex min-h-[44px] items-center gap-2 text-lg">GitHub <ArrowUpRight size={18} aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span><span className="block text-sm text-[#515347]">Code, projects, and experiments</span></a>
        </div>
        <p className="mt-20 text-sm text-[#515347]">Based in New York, NY. Open to relocation.</p>
      </Reveal>
    </div>
  </main>;
}
