"use client";

import { useRef, type PropsWithChildren } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

export function WorkPreview({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 32, mass: 0.6 });
  const y = useTransform(progress, [0, 1], [8, -8]);

  return <div ref={ref} className={`work-preview relative aspect-[16/10] overflow-hidden ${className}`}>
    <motion.div className="scroll-art absolute inset-0" style={reduce ? undefined : { y }}>
      {children}
    </motion.div>
  </div>;
}
