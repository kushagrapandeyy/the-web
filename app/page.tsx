import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { HomeHero } from "./components/home-hero";
import { Reveal } from "./components/reveal";
import { TechnicalStack } from "./components/technical-stack";
import { Playground } from "./components/playground";
import { SelectedWork } from "./components/selected-work";

export default function Home() {
  return (
    <>

      <main id="main-content">
        <HomeHero />

        <SelectedWork />

        <section id="about-section" className="page-width section-space border-t border-white/10">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[0.7fr_1.3fr] md:gap-20">
            <Reveal className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg bg-zinc-900">
              <Image src="/me.jpg" alt="Kushagra Pandey" fill sizes="(max-width: 768px) 85vw, 350px" className="object-cover object-[center_25%]" />
            </Reveal>
            <Reveal>
              <h2 className="section-title">An engineer with an eye for the whole product.</h2>
              <p className="mt-6 leading-relaxed text-zinc-400">I work from the interface down to the API, database, and infrastructure. At Firmlytic Solutions, that means turning conversations with a legal practice into software, then staying with the testing, deployment, and fixes that follow.</p>
              <p className="mt-4 leading-relaxed text-zinc-400">Before founding Firmlytic, I worked on legacy document systems at SS Pandey & Associates and data pipelines at CyberSophy. I graduated from Arizona State University in May 2026 with a B.S. in Computer Science and a minor in Film and Media Production.</p>
              <p className="mt-4 leading-relaxed text-zinc-400">I’m based in New York, NY, and open to relocation for new grad or entry-level software engineering roles.</p>
            </Reveal>
          </div>
        </section>

        <TechnicalStack />

        <div className="page-width"><Playground /></div>

        <section className="page-width section-space border-t border-white/10">
          <Reveal>
            <h2 className="work-heading max-w-3xl font-display tracking-tight text-paper">Have something in mind?</h2>
            <p className="mt-5 text-zinc-400">Looking for new grad and entry-level software engineering roles. Open to relocation.</p>
            <a href="mailto:kushagrapandeyy@gmail.com" className="mt-6 inline-flex min-h-[44px] items-center gap-3 break-all text-lg text-accent-300 hover:text-accent-200 sm:text-2xl">kushagrapandeyy@gmail.com <ArrowUpRight size={22} aria-hidden="true" className="shrink-0" /></a>
          </Reveal>
        </section>
      </main>
      <footer className="page-width flex flex-wrap items-center justify-between gap-5 border-t border-white/10 py-8 text-sm text-zinc-400">
        <span>Kushagra Pandey</span>
        <a href="#playground" className="text-link">Try Chronos</a>
      </footer>
    </>
  );
}
