"use client";

import dynamic from "next/dynamic";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { animate, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ScrambleName } from "./scramble-name";
import { introduction } from "../profile";

const Particles = dynamic(() => import("./particles"), { ssr: false });

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 32, mass: 0.6 });
  const y = useTransform(progress, [0, 1], [0, 40]);
  const scale = useTransform(progress, [0, 1], [1, 0.98]);
  const opacity = useTransform(progress, [0, 0.7, 1], [1, 1, 0]);

  useEffect(() => {
    if (reduce !== false || document.documentElement.dataset.intro !== "done" || !ref.current) return;
    const glyphs = Array.from(ref.current.querySelectorAll<HTMLElement>("[data-glyph]"));
    const copy = ref.current.querySelector<HTMLElement>(".hero-return-copy");
    const controls = glyphs.map((glyph, index) => {
      const secondLine = index >= 8;
      return animate(glyph, {
        x: [secondLine ? 22 : -22, 0],
        y: [secondLine ? 20 : -20, 0],
        opacity: [0, 1],
      }, {
        duration: 0.72,
        delay: (secondLine ? 0.12 : 0) + (secondLine ? index - 8 : index) * 0.025,
        ease: [0.22, 1, 0.36, 1],
      });
    });
    if (copy) controls.push(animate(copy, { y: [12, 0], opacity: [0, 1] }, { duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }));
    return () => controls.forEach(control => control.stop());
  }, [reduce]);

  return <section ref={ref} id="hero-section" className="home-hero relative flex min-h-[min(900px,100dvh)] items-center justify-center overflow-hidden px-6 pb-20 pt-24">
    <Particles className="hero-particles pointer-events-none absolute inset-0 opacity-30" quantity={45} staticity={80} />
    <motion.div className="hero-content scroll-art relative mx-auto w-full max-w-4xl text-center" style={reduce ? undefined : { y, scale, opacity }}>
      <h1 aria-label="Kushagra Pandey" className="hero-name mx-auto w-fit font-display tracking-[-0.05em] text-paper"><ScrambleName animate={false} /></h1>
      <div className="hero-return-copy scroll-art">
        <div className="hero-introduction">
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-secondary [text-wrap:balance] sm:text-lg">{introduction}</p>
          <a href="#selected-work" className="text-link group mt-8">View selected work <ArrowDown size={16} aria-hidden="true" className="transition-transform group-hover:translate-y-1" /></a>
        </div>
      </div>
    </motion.div>
  </section>;
}
