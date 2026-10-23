"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useMotionValueEvent, useTransform, type MotionValue, type MotionStyle } from "framer-motion";

import { GameLauncher } from "./game-launcher";

const moments = [
  { title: "Move.", text: "Scroll to move the player. It carries momentum as it changes direction.", range: [0, 0.20, 0.28, 1], opacity: [1, 1, 0, 0] },
  { title: "Collect.", text: "Keep scrolling to collect the blue fragment. Each one adds to your score.", range: [0, 0.23, 0.30, 0.46, 0.53, 1], opacity: [0, 0, 1, 1, 0, 0] },
  { title: "Avoid.", text: "Move past the red rift. Contact ends the round.", range: [0, 0.48, 0.55, 0.77, 0.84, 1], opacity: [0, 0, 1, 1, 0, 0] },
  { title: "Your turn.", text: "Play Chronos. Move with your pointer, touch, or arrow keys.", range: [0, 0.79, 0.88, 1], opacity: [0, 0, 1, 1] },
];

function Moment({ moment, progress }: { moment: typeof moments[number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, moment.range, moment.opacity);
  const y = useTransform(opacity, [0, 1], [12, 0]);
  return <motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity, y }}>
    <h3 className="max-w-sm font-display text-[clamp(2.6rem,5.6vw,5.5rem)] leading-[1.08] tracking-tight text-paper">{moment.title}</h3>
    <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-300 sm:text-base sm:leading-7">{moment.text}</p>
  </motion.div>;
}

function PlayInvitation() {
  return <><h3 className="font-display text-[clamp(2.6rem,5.6vw,5.5rem)] leading-[1.08] tracking-tight text-paper">Chronos.</h3><p className="chronos-invitation-meta mt-3 text-sm text-zinc-400">React · TypeScript · Canvas</p><div className="mt-4"><GameLauncher /></div><a href="https://github.com/kushagrapandeyy/the-web/blob/main/app/components/chronos-game.tsx" target="_blank" rel="noopener noreferrer" className="text-link">Read the game code</a></>;
}

export function ChronosStory() {
  const section = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);
  const { scrollYProgress: progress } = useScroll({ target: section, offset: ["start start", "end end"] });
  useMotionValueEvent(progress, "change", value => {
    const next = value >= 0.84;
    if (next !== readyRef.current) { readyRef.current = next; setReady(next); }
  });
  const invitationOpacity = useTransform(progress, [0, 0.79, 0.88, 1], [0, 0, 1, 1]);
  const playerX = useTransform(progress, [0, 0.18, 0.36, 0.48, 0.64, 0.8, 1], [150, 270, 440, 490, 580, 480, 400]);
  const playerY = useTransform(progress, [0, 0.18, 0.36, 0.48, 0.64, 0.8, 1], [300, 215, 180, 240, 330, 280, 250]);
  const fragmentOpacity = useTransform(progress, [0, 0.2, 0.27, 0.36, 0.39, 1], [0, 0, 1, 1, 0, 0]);
  const collectedOpacity = useTransform(progress, [0, 0.34, 0.37, 0.45, 1], [0, 0, 1, 0, 0]);
  const collectedRadius = useTransform(progress, [0, 0.34, 0.45, 1], [12, 12, 65, 65]);
  const riftOpacity = useTransform(progress, [0, 0.44, 0.52, 0.78, 0.88, 1], [0, 0, 1, 1, 0, 0]);
  const riftX = useTransform(progress, [0, 0.46, 0.82, 1], [680, 680, 480, 480]);
  const riftY = useTransform(progress, [0, 0.46, 0.82, 1], [140, 140, 190, 190]);
  const zoom = useTransform(progress, [0, 0.78, 1], [1, 1, 1.08]);

  const drift = useTransform(progress, [0, 1], [-32, 32]);

  return <section ref={section} id="playground" aria-label="Chronos interactive experiment" className="relative section-space border-t border-white/15">
    <div id="chronos-preview" className="chronos-story-animated relative">
      <span id="chronos-play" className="pointer-events-none absolute bottom-[calc(100svh-6rem)] scroll-mt-0" />
      <motion.div className="chronos-story-stage" style={{ "--story-drift": drift } as MotionStyle}>
        <div className="chronos-story-header mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1"><p className="text-sm text-zinc-300">Chronos · Scroll to move</p><a href="#chronos-play" className="text-link relative z-10">Skip to the game</a></div>
        <div aria-hidden="true" className="chronos-story-progress mb-4 h-px overflow-hidden bg-white/10"><motion.div className="h-full origin-left bg-accent-300" style={{ scaleX: progress }} /></div>
        <div className="chronos-story-layout grid items-center gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-8">
          <div className="chronos-story-copy relative min-w-0"><div className="chronos-story-captions relative h-[200px] lg:h-[300px]"><div aria-hidden="true">{moments.slice(0, 3).map(moment => <Moment key={moment.title} moment={moment} progress={progress} />)}</div><motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity: invitationOpacity }} inert={!ready} aria-hidden={!ready}><PlayInvitation /></motion.div></div></div>
          <div className="chronos-story-field relative h-[clamp(180px,30svh,380px)] min-w-0 lg:h-[clamp(280px,48svh,480px)]">
            <motion.svg aria-hidden="true" viewBox="0 0 800 500" className="h-full w-full" style={{ scale: reduce ? 1 : zoom }}>
              <path d="M0 100H800M0 200H800M0 300H800M0 400H800M160 0V500M320 0V500M480 0V500M640 0V500" fill="none" stroke="currentColor" strokeOpacity="0.06" vectorEffect="non-scaling-stroke" />
              <motion.circle cx={440} cy={180} r={18} className="fill-accent-300 stroke-accent-300" strokeWidth={12} vectorEffect="non-scaling-stroke" style={{ opacity: fragmentOpacity }} />
              <motion.circle cx={440} cy={180} r={collectedRadius} fill="none" className="stroke-accent-300" strokeWidth={2} vectorEffect="non-scaling-stroke" style={{ opacity: collectedOpacity }} />
              <motion.text x={440} y={130} textAnchor="middle" className="fill-accent-300 text-3xl" style={{ opacity: collectedOpacity }}>+10</motion.text>
              <motion.circle cx={riftX} cy={riftY} r={36} fill="#fb7185" stroke="#fb7185" strokeWidth={10} vectorEffect="non-scaling-stroke" style={{ opacity: riftOpacity }} />
              <motion.circle cx={playerX} cy={playerY} r={32} className="fill-paper stroke-paper" strokeWidth={14} vectorEffect="non-scaling-stroke" />
            </motion.svg>
          </div>
        </div>
      </motion.div>
    </div>
    <ol className="chronos-story-static sr-only">{moments.map(moment => <li key={moment.title}><h3 className="font-display text-2xl text-paper">{moment.title}</h3><p className="mt-3 text-sm leading-7 text-zinc-300">{moment.text.replace("Scroll to move", "Move").replace("Keep scrolling to collect", "Collect")}</p></li>)}</ol>
    <div className="chronos-story-controls hidden mt-8"><PlayInvitation /></div>
    <noscript><style>{`.chronos-story-animated { display: none !important; } .chronos-story-controls { display: block !important; } .chronos-story-static { position: static !important; width: auto !important; height: auto !important; margin: 0 !important; overflow: visible !important; clip: auto !important; white-space: normal !important; display: grid !important; gap: 1.5rem; }`}</style></noscript>
  </section>;
}
