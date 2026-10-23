"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

const moments = [
  { title: "Move.", text: "Scroll to move the player. It carries momentum as it changes direction.", range: [0, 0.20, 0.28, 1], opacity: [1, 1, 0, 0] },
  { title: "Collect.", text: "Keep scrolling to collect the blue fragment. Each one adds to your score.", range: [0, 0.23, 0.30, 0.46, 0.53, 1], opacity: [0, 0, 1, 1, 0, 0] },
  { title: "Avoid.", text: "Move past the red rift. Contact ends the round.", range: [0, 0.48, 0.55, 0.77, 0.84, 1], opacity: [0, 0, 1, 1, 0, 0] },
  { title: "Your turn.", text: "The preview is complete. Play Chronos below.", range: [0, 0.79, 0.88, 1], opacity: [0, 0, 1, 1] },
];

function Moment({ moment, progress }: { moment: typeof moments[number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, moment.range, moment.opacity);
  const y = useTransform(opacity, [0, 1], [12, 0]);
  return <motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity, y }}>
    <h3 className="max-w-sm font-display text-[clamp(1.8rem,3.2vw,3rem)] leading-[1.08] tracking-tight text-paper">{moment.title}</h3>
    <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-300 sm:text-base sm:leading-7">{moment.text}</p>
  </motion.div>;
}

export function ChronosStory() {
  const section = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: progress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const playerX = useTransform(progress, [0, 0.18, 0.36, 0.48, 0.64, 0.8, 1], [150, 270, 440, 490, 580, 480, 400]);
  const playerY = useTransform(progress, [0, 0.18, 0.36, 0.48, 0.64, 0.8, 1], [300, 215, 180, 240, 330, 280, 250]);
  const fragmentOpacity = useTransform(progress, [0, 0.2, 0.27, 0.36, 0.39, 1], [0, 0, 1, 1, 0, 0]);
  const collectedOpacity = useTransform(progress, [0, 0.34, 0.37, 0.45, 1], [0, 0, 1, 0, 0]);
  const collectedRadius = useTransform(progress, [0, 0.34, 0.45, 1], [12, 12, 65, 65]);
  const riftOpacity = useTransform(progress, [0, 0.44, 0.52, 0.78, 0.88, 1], [0, 0, 1, 1, 0, 0]);
  const riftX = useTransform(progress, [0, 0.46, 0.82, 1], [680, 680, 480, 480]);
  const riftY = useTransform(progress, [0, 0.46, 0.82, 1], [140, 140, 190, 190]);
  const zoom = useTransform(progress, [0, 0.78, 1], [1, 1, 1.08]);

  return <section ref={section} id="chronos-preview" aria-label="Chronos scroll preview" className="relative section-space border-t border-white/15">
    <div className="chronos-story-animated">
      <div className="chronos-story-stage rounded-2xl border border-white/15 bg-surface p-5 sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1"><p className="text-sm text-zinc-300">Chronos · Scroll to move</p><a href="#chronos-play" className="text-link relative z-10">Skip to the game</a></div>
        <div aria-hidden="true" className="mb-6 h-px overflow-hidden bg-white/10"><motion.div className="h-full origin-left bg-accent-300" style={{ scaleX: progress }} /></div>
        <div aria-hidden="true" className="grid items-center gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          <div className="relative h-[120px] lg:h-[260px]">{moments.map(moment => <Moment key={moment.title} moment={moment} progress={progress} />)}</div>
          <div className="relative h-[clamp(180px,30svh,380px)] min-w-0 overflow-hidden rounded-xl border border-white/10 bg-canvas lg:h-[clamp(280px,48svh,480px)]">
            <motion.svg viewBox="0 0 800 500" className="h-full w-full" style={{ scale: reduce ? 1 : zoom }}>
              <motion.circle cx={440} cy={180} r={18} className="fill-accent-300 stroke-accent-300" strokeWidth={12} vectorEffect="non-scaling-stroke" style={{ opacity: fragmentOpacity }} />
              <motion.circle cx={440} cy={180} r={collectedRadius} fill="none" className="stroke-accent-300" strokeWidth={2} vectorEffect="non-scaling-stroke" style={{ opacity: collectedOpacity }} />
              <motion.text x={440} y={130} textAnchor="middle" className="fill-accent-300 text-3xl" style={{ opacity: collectedOpacity }}>+10</motion.text>
              <motion.circle cx={riftX} cy={riftY} r={36} fill="#fb7185" stroke="#fb7185" strokeWidth={10} vectorEffect="non-scaling-stroke" style={{ opacity: riftOpacity }} />
              <motion.circle cx={playerX} cy={playerY} r={32} className="fill-paper stroke-paper" strokeWidth={14} vectorEffect="non-scaling-stroke" />
            </motion.svg>
          </div>
        </div>
      </div>
    </div>
    <ol className="chronos-story-static sr-only">{moments.map(moment => <li key={moment.title}><h3 className="font-display text-2xl text-paper">{moment.title}</h3><p className="mt-3 text-sm leading-7 text-zinc-300">{moment.text.replace("Scroll to move", "Move").replace("Keep scrolling to collect", "Collect")}</p></li>)}</ol>
    <noscript><style>{`.chronos-story-animated { display: none !important; } .chronos-story-static { position: static !important; width: auto !important; height: auto !important; margin: 0 !important; overflow: visible !important; clip: auto !important; white-space: normal !important; display: grid !important; gap: 1.5rem; }`}</style></noscript>
  </section>;
}
