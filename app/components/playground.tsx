import { GameLauncher } from "./game-launcher";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";

export function Playground() {
  return <section id="playground" aria-labelledby="playground-title" className="section-space border-t border-white/15">
    <div className="grid items-center gap-10 md:grid-cols-[1.5fr_1fr] md:gap-20">
      <div>
        <p className="mb-4 text-sm text-accent-300">Interactive experiment</p>
        <TextReveal id="playground-title" className="work-heading font-display tracking-tight text-paper">Chronos.</TextReveal>
        <Reveal>
          <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-300">A small game about momentum and control. Collect fragments, dodge the rifts, and see how long you can stay in motion.</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400">Built with React, TypeScript, and Canvas. An experiment in the details I enjoy: responsive input, spring-like movement, collision detection, and feedback you can feel.</p>
        </Reveal>
      </div>
      <Reveal delay={0.08} className="border-l border-white/15 pl-6 sm:pl-8">
        <p className="max-w-xs text-sm leading-7 text-zinc-400">Move with your mouse, touch, or arrow keys. Collect teal fragments and avoid red rifts. Your best score stays in this browser.</p>
        <div className="mt-6"><GameLauncher /></div>
        <a href="https://github.com/kushagrapandeyy/the-web/blob/main/app/components/chronos-game.tsx" target="_blank" rel="noopener noreferrer" className="text-link mt-3">Read the game code</a>
      </Reveal>
    </div>
  </section>;
}
