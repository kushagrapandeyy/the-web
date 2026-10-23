"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { PropsWithChildren, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ResumeEntry({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  const element = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: element, offset: ["start 80%", "end 35%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 28 });
  const y = useTransform(scrollYProgress, [0, 0.3], [14, 0]);
  const active = hovered || focused;
  return <motion.article ref={element} className={`resume-entry reveal group relative isolate ${className}`} style={{ y: reduce ? 0 : y }} initial="rest" animate={active ? "active" : "rest"} variants={{ rest: { x: 0 }, active: { x: reduce ? 0 : 4 } }} onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }} transition={{ type: "spring", stiffness: 180, damping: 28 }}>
    <motion.span aria-hidden="true" className="pointer-events-none absolute -inset-x-3 -inset-y-4 -z-10 rounded-lg bg-paper/[0.035] print:hidden" variants={{ rest: { opacity: 0 }, active: { opacity: 1 } }} transition={{ duration: 0.2 }} />
    <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 top-9 w-px sm:left-[164px] sm:top-0 motion-reduce:hidden print:hidden">
      <motion.span className="absolute inset-0 origin-top bg-accent-300" style={{ scaleY: progress }} variants={{ rest: { opacity: 0.45 }, active: { opacity: 1 } }} />
      <motion.span className="absolute -left-[2px] top-0 h-[5px] w-[5px] rounded-full bg-accent-300" variants={{ rest: { scale: 0.8, opacity: 0.45 }, active: { scale: 1.35, opacity: 1 } }} transition={{ type: "spring", stiffness: 300, damping: 24 }} />
    </span>
    {children}
  </motion.article>;
}

export function ResumeCaseLink({ href, children }: PropsWithChildren<{ href: string }>) {
  const reduce = useReducedMotion();
  return <Link href={href} className="inline-flex max-w-full items-center gap-3 transition-colors hover:text-accent-300 focus-visible:text-accent-300">
    <span>{children}</span>
    <span className="inline-flex shrink-0 items-center gap-2 text-accent-300 print:hidden">
      <motion.span className="hidden overflow-hidden whitespace-nowrap text-xs font-normal sm:block" variants={{ rest: { width: 0, opacity: 0 }, active: { width: "auto", opacity: 1 } }} transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}>Case study</motion.span>
      <motion.span className="motion-reduce:!transform-none" variants={{ rest: { x: 0, y: 0 }, active: { x: reduce ? 0 : 3, y: reduce ? 0 : -3 } }} transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 24 }}><ArrowUpRight aria-hidden="true" size={17} /></motion.span>
    </span>
  </Link>;
}

export function ResumeSkill({ label, skills }: { label: string; skills: string[] }) {
  const reduce = useReducedMotion();
  return <motion.div whileHover={{ x: reduce ? 0 : 4 }} transition={{ type: "spring", stiffness: 240, damping: 30 }} className="reveal group border-l border-paper/10 pl-5 transition-colors hover:border-paper/[0.18] print:border-0 print:pl-0">
    <dt className="text-sm font-medium text-paper">{label}</dt>
    <dd className="mt-2 text-sm leading-7 text-secondary">{skills.join(", ")}</dd>
  </motion.div>;
}
