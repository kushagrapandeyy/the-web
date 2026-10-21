"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PropsWithChildren } from "react";

export function Reveal({ children, className = "", as = "div", id, delay = 0 }: PropsWithChildren<{ className?: string; as?: "div" | "article" | "h2" | "h3"; id?: string; delay?: number }>) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  return (
    <Component id={id} className={`reveal ${className}`} initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={reduce ? { duration: 0 } : { duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </Component>
  );
}
