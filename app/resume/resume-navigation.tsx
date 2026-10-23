"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";

const sections = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "credentials", label: "Credentials" },
];

export function ResumeNavigation() {
  const [active, setActive] = useState(sections[0].id);
  const current = useRef(active);
  const targets = useRef<HTMLElement[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 240, damping: 32 });

  const updateActive = useCallback(() => {
    let next = sections[0].id;
    const threshold = window.innerWidth >= 1024 ? 160 : 180;
    for (const section of targets.current) {
      if (section.getBoundingClientRect().top <= threshold) next = section.id;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) next = sections[sections.length - 1].id;
    if (next !== current.current) { current.current = next; setActive(next); }
  }, []);

  useEffect(() => {
    targets.current = sections.flatMap(({ id }) => {
      const element = document.getElementById(id);
      return element ? [element] : [];
    });
    updateActive();
    window.addEventListener("resize", updateActive);
    return () => window.removeEventListener("resize", updateActive);
  }, [updateActive]);

  useMotionValueEvent(scrollY, "change", updateActive);

  useEffect(() => {
    const container = scroller.current;
    const link = container?.querySelector<HTMLElement>(`[href="#${active}"]`);
    if (container && link && window.innerWidth < 1024) {
      container.scrollTo({ left: link.offsetLeft - (container.clientWidth - link.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
    }
  }, [active, reduce]);

  return <nav aria-label="Résumé sections" className="sticky top-16 z-20 -mx-6 self-start border-b border-paper/10 bg-canvas px-6 py-2 sm:-mx-8 sm:px-8 lg:top-28 lg:mx-0 lg:border-0 lg:px-0 lg:py-0 print:hidden">
    <p className="mb-5 hidden text-xs text-muted lg:block">On this page</p>
    <div className="relative">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-px bg-paper/10 lg:block"><motion.span className="absolute inset-0 origin-top bg-accent-300/60" style={{ scaleY: reduce ? scrollYProgress : progress }} /></span>
      <div ref={scroller} className="relative overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max gap-5 lg:w-full lg:flex-col lg:gap-1">
          {sections.map(({ id, label }) => <li key={id}>
            <motion.a href={`#${id}`} aria-current={active === id ? "location" : undefined} whileHover={{ x: reduce ? 0 : 3 }} transition={{ type: "spring", stiffness: 420, damping: 32 }} className={`relative flex min-h-[44px] items-center whitespace-nowrap text-sm transition-colors lg:pl-5 ${active === id ? "text-accent-300" : "text-secondary hover:text-paper"}`}>
              {active === id && <motion.span aria-hidden="true" layoutId="resume-section-marker" className="absolute inset-x-0 bottom-0 h-px bg-accent-300 lg:inset-x-auto lg:inset-y-3 lg:left-0 lg:h-auto lg:w-[2px]" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }} />}
              {label}
            </motion.a>
          </li>)}
        </ul>
      </div>
    </div>
  </nav>;
}
