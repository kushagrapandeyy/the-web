import { GameLauncher } from "./game-launcher";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
import { ChronosStory } from "./chronos-story";

export function Playground() {
  return <><ChronosStory /><section id="playground" aria-labelledby="playground-title" className="section-space border-t border-white/15">
    <div className="grid items-center gap-10 md:grid-cols-[1.5fr_1fr] md:gap-20">
      <div>
        <p className="mb-4 text-sm text-accent-300">Interactive experiment</p>
        <TextReveal id="playground-title" className="work-heading font-display tracking-tight text-paper">Chronos.</TextReveal>
        <Reveal>
          <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-300">A small game about momentum and control.</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400">Built with React, TypeScript, and Canvas.</p>
        </Reveal>
      </div>
      <Reveal id="chronos-play" className="scroll-mt-28 border-l border-white/15 pl-6 sm:pl-8">
        <GameLauncher />
        <p className="mt-4 max-w-xs text-sm leading-7 text-zinc-400">Collect blue fragments and avoid red rifts. Move with your pointer, touch, or arrow keys. Your best score stays in this browser.</p>
        <a href="https://github.com/kushagrapandeyy/the-web/blob/main/app/components/chronos-game.tsx" target="_blank" rel="noopener noreferrer" className="text-link mt-3">Read the game code</a>
      </Reveal>
    </div>
  </section></>;
}
