"use client";

import { animate } from "framer-motion";
import { useEffect, useRef } from "react";

type Point = { x: number; y: number };
type Fragment = { from: Point; mark: Point; to: Point; row: number; rank: number };
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function InkIntro({ onReveal, onComplete }: { onReveal: () => void; onComplete: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    let controls: ReturnType<typeof animate> | undefined;
    let startTimer = 0;
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) { onComplete(); return; }

    const start = () => {
      if (cancelled) return;
      if (document.documentElement.dataset.intro !== "pending" || location.hash || window.scrollY > 1) { onComplete(); return; }
      const name = document.querySelector<HTMLElement>(".hero-name");
      const cells = Array.from(name?.querySelectorAll<HTMLElement>("[data-glyph]") ?? []);
      if (!name || cells.length !== 14) { onComplete(); return; }
      const width = innerWidth, height = innerHeight;
      const bounds = name.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= height || bounds.right <= 0 || bounds.left >= width) { onComplete(); return; }
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.scale(dpr, dpr);
      const full = document.createElement("canvas");
      const mark = document.createElement("canvas");
      full.width = width * dpr;
      full.height = height * dpr;
      mark.width = width;
      mark.height = height;
      const fullContext = full.getContext("2d", { willReadFrequently: true });
      const markContext = mark.getContext("2d", { willReadFrequently: true });
      if (!fullContext || !markContext) { onComplete(); return; }
      fullContext.scale(dpr, dpr);
      const palette = getComputedStyle(document.documentElement);
      const colors = [palette.getPropertyValue("--color-paper").trim(), palette.getPropertyValue("--color-paper").trim()];
      const style = getComputedStyle(cells[0]);
      const tracking = parseFloat(style.letterSpacing) || 0;
      const size = parseFloat(style.fontSize);
      const family = style.fontFamily;
      fullContext.font = `${style.fontWeight} ${size}px ${family}`;
      fullContext.textAlign = "center";
      fullContext.textBaseline = "alphabetic";
      const destinations: Point[][] = [[], []];
      const origins: Point[][] = [[], []];
      const step = width < 768 ? 4 : 6;
      const sample = (ctx: CanvasRenderingContext2D, points: Point[], spacing: number) => {
        const ratio = ctx.canvas.width / width;
        const pixels = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;
        for (let x = 0; x < width; x += spacing) for (let y = 0; y < height; y += spacing) {
          if (pixels[(Math.floor(y * ratio) * ctx.canvas.width + Math.floor(x * ratio)) * 4 + 3] > 160) points.push({ x, y });
        }
      };
      // Match each real letter box, including the font's baseline and tracking.
      for (const row of [0, 1]) {
        fullContext.clearRect(0, 0, width, height);
        fullContext.fillStyle = colors[row];
        cells.slice(row === 0 ? 0 : 8, row === 0 ? 8 : 14).forEach(cell => {
          const box = cell.getBoundingClientRect();
          const letter = cell.dataset.glyph!;
          const metric = fullContext.measureText(letter);
          const ascent = metric.fontBoundingBoxAscent ?? size * 0.8;
          const descent = metric.fontBoundingBoxDescent ?? size * 0.2;
          const baseline = box.top + (box.height - ascent - descent) / 2 + ascent;
          fullContext.fillText(letter, box.left + box.width / 2 - tracking / 2, baseline);
        });
        sample(fullContext, destinations[row], step);
        markContext.clearRect(0, 0, width, height);
        const markSize = Math.min(width * 0.38, height * 0.32, 270);
        markContext.font = `${style.fontWeight} ${markSize}px ${family}`;
        markContext.textAlign = "center";
        markContext.textBaseline = "middle";
        markContext.fillStyle = colors[row];
        markContext.fillText(row === 0 ? "K" : "P", width / 2 + (row === 0 ? -0.3 : 0.3) * markSize, height * 0.46);
        sample(markContext, origins[row], step);
      }
      // Rebuild the full solid glyph bitmap after sampling each line separately.
      fullContext.clearRect(0, 0, width, height);
      cells.forEach((cell, index) => {
        const box = cell.getBoundingClientRect();
        const metric = fullContext.measureText(cell.dataset.glyph!);
        const ascent = metric.fontBoundingBoxAscent ?? size * 0.8;
        const descent = metric.fontBoundingBoxDescent ?? size * 0.2;
        fullContext.fillStyle = colors[index < 8 ? 0 : 1];
        fullContext.fillText(cell.dataset.glyph!, box.left + box.width / 2 - tracking / 2, box.top + (box.height - ascent - descent) / 2 + ascent);
      });
      const fragments: Fragment[] = [];
      destinations.forEach((points, row) => points.forEach((to, index) => {
        const rank = index / points.length;
        const source = origins[row][Math.floor(rank * origins[row].length)];
        if (!source) return;
        fragments.push({ row, rank, to, mark: source, from: {
          x: width / 2 + (rank - 0.5) * Math.min(width * 0.86, 1100),
          y: height * 0.46 + Math.sin(rank * Math.PI * 3 + row * Math.PI) * Math.min(height * 0.16, 130),
        } });
      }));
      let revealed = false;
      controls = animate(0, 5.6, {
        duration: 5.6, ease: "linear",
        onUpdate: time => {
          // A restored scroll position or the before-hydration timeout must never resurrect the overlay.
          if (cancelled || document.documentElement.dataset.intro === "done" || location.hash || window.scrollY > 1) {
            controls?.stop();
            onComplete();
            return;
          }
          context.clearRect(0, 0, width, height);
          const solid = smooth((time - 3.25) / 0.6);
          const finalFade = 1 - smooth((time - 5.15) / 0.45);
          fragments.forEach(fragment => {
            const gather = smooth((time - fragment.rank * 0.15) / 1.15);
            const unfold = smooth((time - 1.35 - fragment.rank * 0.16) / 1.85);
            const x = mix(mix(fragment.from.x, fragment.mark.x, gather), fragment.to.x, unfold);
            const y = mix(mix(fragment.from.y, fragment.mark.y, gather), fragment.to.y, unfold) + Math.sin(unfold * Math.PI) * (fragment.row === 0 ? -34 : 34);
            const length = mix(5, step + 0.4, unfold);
            const thickness = mix(1.4, step + 0.4, gather);
            context.globalAlpha = smooth(time / 0.28) * (1 - solid);
            context.fillStyle = colors[fragment.row];
            context.fillRect(x - length / 2, y - thickness / 2, length, thickness);
          });
          context.globalAlpha = solid * finalFade;
          context.drawImage(full, 0, 0, width, height);
          context.globalAlpha = 1;
          if (!revealed && time >= 4) { revealed = true; onReveal(); }
        },
        onComplete,
      });
    };
    document.fonts.ready.then(() => { if (!cancelled) startTimer = window.setTimeout(start, 450); });
    const resize = () => onComplete();
    window.addEventListener("resize", resize, { once: true });
    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      controls?.stop();
      window.removeEventListener("resize", resize);
    };
  }, [onReveal, onComplete]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
