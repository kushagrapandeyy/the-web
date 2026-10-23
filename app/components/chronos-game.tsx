"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type Entity = { x: number; y: number; vx: number; vy: number; r: number; fragment: boolean };

export default function Chronos({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);

  useEffect(() => {
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    try { setBest(Number(localStorage.getItem("chronos-high-score")) || 0); } catch { /* Storage can be unavailable in private browsing. */ }
    return () => { document.body.style.overflow = overflow; };
  }, []);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const palette = getComputedStyle(document.documentElement);
    const accent = palette.getPropertyValue("--color-accent").trim();
    const paper = palette.getPropertyValue("--color-paper").trim();
    let frame = 0, previous = 0, lastRift = 0, lastFragment = 0, points = 0;
    let entities: Entity[] = [];
    let running = true;
    const keys = new Set<string>();
    const player = { x: 0, y: 0, vx: 0, vy: 0 };
    const target = { x: 0, y: 0 };
    const resize = () => {
      el.width = el.clientWidth;
      el.height = el.clientHeight;
      player.x = target.x = el.width / 2;
      player.y = target.y = el.height / 2;
    };
    resize();
    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
    };
    const keydown = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(event.key)) {
        event.preventDefault(); keys.add(event.key);
      }
    };
    const keyup = (event: KeyboardEvent) => { keys.delete(event.key); };
    const clearKeys = () => keys.clear();
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerdown", move);
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    window.addEventListener("blur", clearKeys);
    window.addEventListener("resize", resize);

    const spawn = (fragment: boolean) => {
      const side = Math.floor(Math.random() * 4);
      const x = side === 0 ? -40 : side === 1 ? el.width + 40 : Math.random() * el.width;
      const y = side === 2 ? -40 : side === 3 ? el.height + 40 : Math.random() * el.height;
      const angle = Math.atan2(player.y - y, player.x - x);
      const speed = fragment ? 1.5 : 1.5 + Math.random();
      entities.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: fragment ? 9 : 18, fragment });
    };
    const draw = (time: number) => {
      if (!running) return;
      const dt = previous ? Math.min((time - previous) / 16.67, 2) : 1;
      if (!previous) lastRift = lastFragment = time;
      previous = time;
      if (keys.has("ArrowLeft") || keys.has("a")) target.x -= 7 * dt;
      if (keys.has("ArrowRight") || keys.has("d")) target.x += 7 * dt;
      if (keys.has("ArrowUp") || keys.has("w")) target.y -= 7 * dt;
      if (keys.has("ArrowDown") || keys.has("s")) target.y += 7 * dt;
      target.x = Math.max(20, Math.min(el.width - 20, target.x));
      target.y = Math.max(20, Math.min(el.height - 20, target.y));
      player.vx = (player.vx + (target.x - player.x) * 0.04 * dt) * Math.pow(0.88, dt);
      player.vy = (player.vy + (target.y - player.y) * 0.04 * dt) * Math.pow(0.88, dt);
      player.x += player.vx * dt; player.y += player.vy * dt;
      if (time - lastRift > 1400) { spawn(false); lastRift = time; }
      if (time - lastFragment > 2000) { spawn(true); lastFragment = time; }
      ctx.clearRect(0, 0, el.width, el.height);
      entities = entities.filter(entity => {
        entity.x += entity.vx * dt; entity.y += entity.vy * dt;
        if (Math.hypot(entity.x - player.x, entity.y - player.y) < entity.r + 16) {
          if (entity.fragment) { points += 10; setScore(points); }
          else {
            running = false; setOver(true);
            setBest(old => {
              const next = Math.max(old, points);
              try { localStorage.setItem("chronos-high-score", String(next)); } catch { /* The game still works without persistent scores. */ }
              return next;
            });
          }
          return false;
        }
        ctx.beginPath(); ctx.arc(entity.x, entity.y, entity.r, 0, Math.PI * 2);
        ctx.fillStyle = entity.fragment ? accent : "#fb7185"; ctx.fill();
        return entity.x > -100 && entity.x < el.width + 100 && entity.y > -100 && entity.y < el.height + 100;
      });
      ctx.beginPath(); ctx.arc(player.x, player.y, 16, 0, Math.PI * 2);
      ctx.fillStyle = paper; ctx.fill();
      if (running) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", move); el.removeEventListener("pointerdown", move);
      window.removeEventListener("keydown", keydown); window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", clearKeys); window.removeEventListener("resize", resize);
    };
  }, [round]);

  return (
    <dialog ref={dialog} onClose={onClose} aria-labelledby="chronos-title" className="game-dialog">
      <div className="flex shrink-0 items-start justify-between gap-4 p-4 sm:p-5">
        <div><h2 id="chronos-title" className="font-display text-2xl text-zinc-100">Chronos</h2><p className="mt-1 text-sm text-zinc-400">Collect blue fragments. Avoid red rifts. Move with your pointer, touch, or arrow keys.</p></div>
        <button autoFocus onClick={() => dialog.current?.close()} aria-label="Close Chronos" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/15 text-zinc-200"><X size={20} /></button>
      </div>
      <p className="shrink-0 px-4 text-sm text-zinc-300 sm:px-5">Score {score} <span className="ml-5 text-zinc-400">Best {best}</span></p>
      <div className="relative mt-4 min-h-0 flex-1">
        <canvas ref={canvas} aria-label="Chronos game area" className="h-full w-full touch-none" />
        {over && <div role="status" className="absolute inset-0 flex items-center justify-center p-3"><div className="max-h-full overflow-y-auto rounded-2xl border border-white/15 bg-zinc-950 p-4 text-center sm:p-6"><h3 className="text-xl text-zinc-100">Round complete</h3><p className="mt-1 text-zinc-400">{score} points</p><button className="button-primary mt-3" onClick={() => { setScore(0); setOver(false); setRound(v => v + 1); }}>Play again</button></div></div>}
      </div>
    </dialog>
  );
}
