"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export function TextReveal({ children, as: Heading = "h2", className = "", lines = false, id }: { children: string; as?: "h1" | "h2"; className?: string; lines?: boolean; id?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const visible = useInView(ref, { once: true, margin: "0px 0px -24px 0px" });
  const reduce = useReducedMotion();
  return <Heading ref={ref} id={id} className={className} aria-label={children}>
    {children.split(" ").map((word, i) => <span key={i} aria-hidden="true" className={`${lines ? "block" : "inline-block"} max-w-full overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]`}>
      <motion.span className="text-reveal-word inline-block max-w-full [overflow-wrap:anywhere]" initial={{ y: reduce ? 0 : "105%" }} animate={{ y: visible || reduce ? 0 : "105%" }} transition={reduce ? { duration: 0 } : { duration: 0.55, delay: Math.min(i * 0.035, 0.14), ease: [0.22, 1, 0.36, 1] }}>{word}{!lines && "\u00a0"}</motion.span>
    </span>)}
    <noscript><style>{`.text-reveal-word { transform: none !important; }`}</style></noscript>
  </Heading>;
}
