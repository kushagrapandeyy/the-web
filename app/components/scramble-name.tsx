"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const words = ["Kushagra", "Pandey"];
const glyphs = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789{}[]<>";

export function ScrambleName({ onComplete, duration = 720, animate = true, reveal = false }: { onComplete?: () => void; duration?: number; animate?: boolean; reveal?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!animate || reduce === null || (reveal && document.documentElement.dataset.intro === "done")) return;
    if (reduce) { onComplete?.(); return; }
    const cells = Array.from(ref.current?.querySelectorAll<HTMLElement>("[data-glyph]") ?? []);
    let frame = 0, started = 0, lastUpdate = 0, cancelled = false;
    const tick = (time: number) => {
      if (!started) started = time;
      const elapsed = time - started;
      if (time - lastUpdate >= 40) {
        cells.forEach((cell, index) => {
          const locked = elapsed >= duration * (0.12 + index / cells.length * 0.76);
          cell.dataset.locked = String(locked);
          cell.textContent = locked ? cell.dataset.glyph! : glyphs[Math.floor(Math.random() * glyphs.length)];
        });
        lastUpdate = time;
      }
      if (elapsed < duration) frame = requestAnimationFrame(tick);
      else onComplete?.();
    };
    document.fonts.ready.then(() => { if (!cancelled) frame = requestAnimationFrame(tick); });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      cells.forEach(cell => { cell.textContent = cell.dataset.glyph!; cell.dataset.locked = "true"; });
    };
  }, [reduce, onComplete, duration, animate, reveal]);

  return <span ref={ref} aria-hidden="true" className="block font-display tracking-[-0.05em]">
    {words.map((word, row) => <span key={word} className={`block overflow-hidden pb-[0.1em] -mb-[0.1em] ${row === 1 ? "text-accent-300" : ""}`}><motion.span className="entrance-word block" initial={reveal ? { y: "110%" } : false} animate={{ y: 0 }} transition={{ duration: 1.1, delay: row * 0.14, ease: [0.22, 1, 0.36, 1] }}>{word.split("").map((letter, index) => <span key={index} className="relative inline-block"><span className="invisible">{letter}</span><span data-glyph={letter} data-locked="true" className="decode-glyph absolute inset-0 flex items-center justify-center">{letter}</span></span>)}</motion.span></span>)}
  </span>;
}
