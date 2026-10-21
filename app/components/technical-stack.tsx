import { technicalSkills } from "../profile";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";

export function TechnicalStack() {
  return <section id="stack" aria-labelledby="stack-title" className="page-width section-space border-t border-white/15">
    <div className="mb-10 grid items-end gap-5 md:grid-cols-2 md:gap-12">
      <TextReveal id="stack-title" className="section-title">Across the stack.</TextReveal>
      <p className="max-w-md leading-relaxed text-zinc-400 md:justify-self-end">From the interface to the infrastructure. The tools I work with, and where I put them to use.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {technicalSkills.map(({ label, context, skills }, index) => <Reveal as="article" key={label} delay={(index % 3) * 0.06} className="stack-panel flex flex-col rounded-lg border border-white/10 bg-white/[0.025] p-6 transition-colors duration-200 hover:border-accent-300/40 hover:bg-white/[0.045] sm:p-7">
        <div className="flex-1">
          <h3 className="font-display text-xl leading-tight tracking-tight text-accent-300">{label}</h3>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm leading-6 text-zinc-200" aria-label={`${label} technologies`}>
            {skills.map(skill => <li key={skill}>{skill}</li>)}
          </ul>
        </div>
        <p className="mt-6 border-t border-white/10 pt-4 text-sm leading-6 text-zinc-400">{context}</p>
      </Reveal>)}
    </div>
  </section>;
}
