"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Cloud, Code2, Database, PanelTop, Server, Terminal } from "lucide-react";
import { technicalSkills } from "../profile";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";

const categories = [
  { title: "Languages", icon: Code2 },
  { title: "Frontend", icon: PanelTop },
  { title: "Backend", icon: Server },
  { title: "Data", icon: Database },
  { title: "Cloud", icon: Cloud },
  { title: "AI & tools", icon: Terminal },
];

export function TechnicalStack() {
  const [active, setActive] = useState(1);
  const reduce = useReducedMotion();
  const selected = technicalSkills[active];
  const Icon = categories[active].icon;
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 180, damping: 30 });
  const y = useSpring(pointerY, { stiffness: 180, damping: 30 });
  const light = useMotionTemplate`radial-gradient(300px circle at ${x}px ${y}px, color-mix(in srgb, var(--color-accent) 9%, transparent), transparent 80%)`;

  return <section id="stack" aria-labelledby="stack-title" className="page-width section-space border-t border-white/15">
    <div className="mb-10 grid items-end gap-5 md:grid-cols-2 md:gap-12">
      <TextReveal id="stack-title" className="section-title">Across the stack.</TextReveal>
      <p className="max-w-md leading-relaxed text-zinc-400 md:justify-self-end">Explore the languages, frameworks, and services I use. Choose a category to see the tools.</p>
    </div>
    <Reveal>
      <LayoutGroup id="stack-explorer">
        <div className="stack-interactive overflow-hidden rounded-2xl border border-white/15 bg-white/[0.025]">
          <div role="group" aria-label="Explore skill categories" className="grid grid-cols-3 border-b border-white/15 sm:grid-cols-6">
            {technicalSkills.map(({ label }, index) => {
              const CategoryIcon = categories[index].icon;
              return <motion.button key={label} id={`stack-category-${index}`} type="button" aria-label={label} aria-pressed={active === index} aria-controls="stack-tools" onClick={() => setActive(index)} onFocus={() => setActive(index)} onPointerMove={event => { if (event.pointerType === "mouse" && active !== index) setActive(index); }} whileTap={reduce ? undefined : { scale: 0.96 }} className={`relative isolate flex min-h-[88px] min-w-0 flex-col items-center justify-center gap-2 px-2 py-4 text-xs transition-colors focus-visible:z-10 focus-visible:outline focus-visible:-outline-offset-4 sm:min-h-[104px] sm:text-sm ${active === index ? "text-accent-300" : "text-zinc-400 hover:text-paper"}`}>
                {active === index && <motion.span aria-hidden="true" layoutId={reduce ? undefined : "stack-category-highlight"} transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 32 }} className="pointer-events-none absolute inset-1.5 -z-10 rounded-lg border border-accent-300/20 bg-accent-300/[0.08]" />}
                <motion.span aria-hidden="true" animate={{ y: active === index && !reduce ? -2 : 0 }} transition={{ type: "spring", stiffness: 320, damping: 22 }}><CategoryIcon size={21} strokeWidth={1.5} /></motion.span>
                <span>{categories[index].title}</span>
              </motion.button>;
            })}
          </div>
          <div id="stack-tools" role="region" aria-labelledby={`stack-category-${active}`} className="relative min-h-[390px] overflow-hidden p-5 sm:min-h-[360px] sm:p-8" onPointerMove={event => {
            if (reduce || event.pointerType !== "mouse") return;
            const bounds = event.currentTarget.getBoundingClientRect();
            pointerX.set(event.clientX - bounds.left);
            pointerY.set(event.clientY - bounds.top);
          }}>
            {!reduce && <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: light }} />}
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div key={selected.label} initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -8 }} transition={{ duration: reduce ? 0 : 0.18 }} className="relative">
                <div className="flex min-h-[108px] items-start justify-between gap-4 sm:min-h-[90px]">
                  <div className="min-w-0">
                    <h3 className="font-display text-[clamp(1.8rem,3.2vw,2.6rem)] leading-tight tracking-tight text-paper">{selected.label}</h3>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-400">{selected.context}</p>
                  </div>
                  <Icon size={44} strokeWidth={1} aria-hidden="true" className="hidden shrink-0 text-accent-300/50 sm:block" />
                </div>
                <motion.ul aria-label={`${selected.label} technologies`} initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: reduce ? 0 : 0.035 } } }} className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2 sm:gap-x-10">
                  {selected.skills.map(skill => <motion.li key={skill} variants={{ hidden: { opacity: 0, y: reduce ? 0 : 6 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: reduce ? 0 : 0.2 }} whileHover={reduce ? undefined : { x: 4 }} className="flex min-h-[40px] min-w-0 items-center border-b border-white/10 text-sm leading-5 text-zinc-200 sm:text-base">{skill}</motion.li>)}
                </motion.ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </LayoutGroup>
      <noscript>
        <style>{`.stack-interactive { display: none !important; }`}</style>
        <div className="grid gap-6 sm:grid-cols-2">{technicalSkills.map(({ label, skills }) => <div key={label}><h3 className="font-display text-xl text-paper">{label}</h3><p className="mt-3 leading-7 text-zinc-300">{skills.join(", ")}</p></div>)}</div>
      </noscript>
    </Reveal>
  </section>;
}
