"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { InkIntro } from "./ink-intro";
import { ScrambleName } from "./scramble-name";

type IntroPhase = "opening" | "entering" | "done";

export function LoadingMark() {
  const pathname = usePathname();
  if (pathname === "/") return <p role="status" className="sr-only">Loading page</p>;
  return <div role="status" aria-label="Loading page" className="flex min-h-[65dvh] items-center justify-center px-6 text-center text-5xl text-paper sm:text-6xl"><ScrambleName /></div>;
}

export function SiteEntrance({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("opening");
  const visible = phase !== "done";
  const pathname = usePathname();
  const initialPath = useRef(pathname);
  const reduce = useReducedMotion();
  const finish = useCallback(() => {
    document.documentElement.dataset.intro = "done";
    setPhase("done");
  }, []);

  const reveal = useCallback(() => {
    document.documentElement.dataset.intro = "entering";
    setPhase("entering");
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (document.documentElement.dataset.intro !== "pending" || reduce) { finish(); return; }
    try { sessionStorage.setItem("kp-intro-seen", "1"); } catch { /* Storage may be disabled. */ }
    const fallback = window.setTimeout(finish, 9000);
    return () => window.clearTimeout(fallback);
  }, [reduce, finish, visible]);

  useEffect(() => { if (pathname !== initialPath.current) finish(); }, [pathname, finish]);
  useEffect(() => {
    if (!visible) return;
    const skip = (event: KeyboardEvent) => { if (event.key === "Escape" || event.key === "Tab") finish(); };
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", finish, { once: true, passive: true });
    window.addEventListener("touchmove", finish, { once: true, passive: true });
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", finish);
      window.removeEventListener("touchmove", finish);
    };
  }, [visible, finish]);

  return <>
    {children}
    {visible && <section data-intro-loader aria-label="Welcome to Kushagra Pandey’s portfolio" className="intro-loader pointer-events-none fixed inset-0 z-50 print:hidden">
      <motion.div className="absolute inset-0 bg-canvas" initial={false} animate={{ opacity: phase === "entering" ? 0 : 1 }} transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }} />
      <InkIntro onReveal={reveal} onComplete={finish} />
      <motion.button type="button" onClick={finish} tabIndex={phase === "entering" ? -1 : 0} animate={{ opacity: phase === "entering" ? 0 : 1 }} transition={{ duration: 0.2 }} style={{ pointerEvents: phase === "entering" ? "none" : "auto" }} className="pointer-events-auto absolute right-6 top-5 inline-flex min-h-[44px] items-center px-3 text-sm text-zinc-400 hover:text-paper">Skip intro</motion.button>
    </section>}
  </>;
}
