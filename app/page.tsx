"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, animate, useInView, AnimatePresence } from "framer-motion";
import Particles from "./components/particles";
import { Navigation } from "./components/nav";


// ─── Typewriter roles ────────────────────────────────────────────────────────
const roles = [
  "Full-Stack Engineer",
  "Creative Technologist",
  "CS @ ASU '26",
];

// ─── Skills data ─────────────────────────────────────────────────────────────
const skillCategories = [
  {
    label: "Languages",
    icon: "⌨",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.15)",
    skills: ["TypeScript", "Python", "Java", "C++", "Swift", "JavaScript"],
  },
  {
    label: "Frontend",
    icon: "✦",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.15)",
    skills: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Expo"],
  },
  {
    label: "Backend",
    icon: "⚙",
    color: "#34d399",
    glow: "rgba(52,211,153,0.15)",
    skills: ["Node.js", "FastAPI", "Spring Boot", "REST APIs", "Microservices"],
  },
  {
    label: "Cloud & Infra",
    icon: "☁",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.15)",
    skills: ["AWS Lambda", "DynamoDB", "Docker", "Kubernetes", "Cloudflare"],
  },
  {
    label: "Data & AI",
    icon: "◈",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.15)",
    skills: ["PostgreSQL", "MongoDB", "Redis", "Vertex AI", "Kubeflow"],
  },
];

// ─── Tech marquee ────────────────────────────────────────────────────────────
const techStrip = [
  { name: "React", color: "#61DAFB" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Node.js", color: "#8CC84B" },
  { name: "FastAPI", color: "#009688" },
  { name: "Spring Boot", color: "#6DB33F" },
  { name: "AWS Lambda", color: "#FF9900" },
  { name: "DynamoDB", color: "#FF9900" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "MongoDB", color: "#47A248" },
  { name: "Docker", color: "#2496ED" },
  { name: "Kubernetes", color: "#326CE5" },
  { name: "Python", color: "#3776AB" },
  { name: "Cloudflare", color: "#F6821F" },
  { name: "Redis", color: "#DC382D" },
];

// ─── Typewriter Component ────────────────────────────────────────────────────
function Typewriter() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIdx];
    let t: NodeJS.Timeout;
    if (!deleting && displayed.length < current.length) {
      t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 55);
    } else if (!deleting && displayed.length === current.length) {
      t = setTimeout(() => setDeleting(true), 2400);
    } else if (deleting && displayed.length > 0) {
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
    } else {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % roles.length);
    }
    return () => clearTimeout(t);
  }, [displayed, deleting, roleIdx]);

  return (
    <span className="gradient-text-vivid font-mono">
      {displayed}
      <span className="text-indigo-400 opacity-80 animate-pulse">|</span>
    </span>
  );
}

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [displayed, setDisplayed] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        setDisplayed(value % 1 !== 0 ? v.toFixed(1) : Math.floor(v).toString());
      },
    });
    return () => c.stop();
  }, [inView, value]);

  return <span ref={ref} className="stat-number">{displayed}{suffix}</span>;
}

// Dev Mode Canvas — interactive physics ball-pit + Kushagra Pandey name block
// --- Chronos Game Constants ---
const RIFT_SPAWN_INTERVAL = 1400; // ms
const FRAGMENT_SPAWN_INTERVAL = 2000; // ms
const MAX_RIFTS = 12;

type GameEntity = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: string;
  type: "rift" | "fragment";
  opacity: number;
  pulse: number;
};

function ChronosGame({ active, onScoreUpdate, onExit, timedOut, onContinue }: {
  active: boolean;
  onScoreUpdate: (score: number) => void;
  onExit: () => void;
  timedOut: boolean;
  onContinue: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const entitiesRef = useRef<GameEntity[]>([]);
  const auraRef = useRef({ x: 0, y: 0, r: 25, vx: 0, vy: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const scoreRef = useRef(0);
  const lastSpawnRef = useRef({ rift: 0, fragment: 0 });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver || timedOut) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          if (gameOver) {
            setGameOver(false);
            scoreRef.current = 0;
            entitiesRef.current = [];
            onScoreUpdate(0);
          } else {
            onContinue();
          }
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      const t = setTimeout(onExit, 5000);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        clearTimeout(t);
      };
    }
  }, [gameOver, timedOut, onExit, onContinue, onScoreUpdate]);

  useEffect(() => {
    if (!active) {
      setGameOver(false);
      scoreRef.current = 0;
      entitiesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const spawnEntity = (type: "rift" | "fragment", time: number) => {
      const margin = 100;
      let x, y;
      const side = Math.floor(Math.random() * 4);
      if (side === 0) { x = Math.random() * canvas.width; y = -margin; }
      else if (side === 1) { x = canvas.width + margin; y = Math.random() * canvas.height; }
      else if (side === 2) { x = Math.random() * canvas.width; y = canvas.height + margin; }
      else { x = -margin; y = Math.random() * canvas.height; }

      const angle = Math.atan2(auraRef.current.y - y, auraRef.current.x - x);
      const speed = type === "rift" ? 1.5 + Math.random() * 2 : 1.0 + Math.random();

      entitiesRef.current.push({
        x, y, r: type === "rift" ? 15 + Math.random() * 15 : 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: type === "rift" ? "#f43f5e" : "#34d399",
        type, opacity: 0, pulse: 0,
      });
      lastSpawnRef.current[type] = time;
    };

    const update = (time: number) => {
      if (gameOver || timedOut) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth Aura (Player) movement
      const aura = auraRef.current;
      const dx = mouseRef.current.x - aura.x;
      const dy = mouseRef.current.y - aura.y;
      aura.vx += dx * 0.04;
      aura.vy += dy * 0.04;
      aura.vx *= 0.88;
      aura.vy *= 0.88;
      aura.x += aura.vx;
      aura.y += aura.vy;

      // Spawning
      if (time - lastSpawnRef.current.rift > RIFT_SPAWN_INTERVAL && entitiesRef.current.filter(e => e.type === "rift").length < MAX_RIFTS) {
        spawnEntity("rift", time);
      }
      if (time - lastSpawnRef.current.fragment > FRAGMENT_SPAWN_INTERVAL) {
        spawnEntity("fragment", time);
      }

      // Entities update & draw
      entitiesRef.current = entitiesRef.current.filter(e => {
        e.x += e.vx;
        e.y += e.vy;
        e.opacity = Math.min(e.opacity + 0.05, 1);
        e.pulse += 0.05;

        // Collision detection
        const dist = Math.sqrt((e.x - aura.x) ** 2 + (e.y - aura.y) ** 2);
        if (dist < e.r + aura.r) {
          if (e.type === "rift") {
            setGameOver(true);
            return false;
          } else {
            scoreRef.current += 10;
            onScoreUpdate(scoreRef.current);
            return false;
          }
        }

        // Boundary check (remove if too far away)
        const margin = 200;
        if (e.x < -margin || e.x > canvas.width + margin || e.y < -margin || e.y > canvas.height + margin) {
          return false;
        }

        // Rendering Entity
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r + Math.sin(e.pulse) * 2, 0, Math.PI * 2);
        ctx.shadowBlur = 15;
        ctx.shadowColor = e.color;
        ctx.fillStyle = e.color + Math.floor(e.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        return true;
      });

      // Rendering Aura
      ctx.beginPath();
      ctx.arc(aura.x, aura.y, aura.r, 0, Math.PI * 2);
      ctx.shadowBlur = 30;
      ctx.shadowColor = "#818cf8";
      const auraGrd = ctx.createRadialGradient(aura.x, aura.y, 0, aura.x, aura.y, aura.r);
      auraGrd.addColorStop(0, "rgba(129, 140, 248, 0.8)");
      auraGrd.addColorStop(1, "rgba(129, 140, 248, 0.2)");
      ctx.fillStyle = auraGrd;
      ctx.fill();
      ctx.strokeStyle = "rgba(129, 140, 248, 0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Mouse connection line
      ctx.beginPath();
      ctx.moveTo(aura.x, aura.y);
      ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
      ctx.strokeStyle = "rgba(129, 140, 248, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [active, gameOver, timedOut, onScoreUpdate, onExit]);

  if (!active) return null;

  return (
    <>
      {/* Layer 1: Game Canvas (Base) */}
      <div className="fixed inset-0 z-[100] pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full pointer-events-auto cursor-none" />
      </div>

      {/* Layer 2: Temporal Stability HUD */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 pointer-events-none z-[150]">
        <div className="px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl flex flex-col items-center">
          <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em] mb-1">Temporal Stability</div>
          <div className="text-3xl font-bold gradient-text-vivid leading-none">{scoreRef.current}</div>
        </div>
      </div>

      {/* Layer 3: Results / Game Over (Above CTA Toggle) */}
      {(gameOver || timedOut) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onExit}
          className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-xl pointer-events-auto cursor-pointer z-[250]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="text-center p-10 rounded-3xl border border-white/10 bg-zinc-900/80 shadow-2xl cursor-default max-w-sm w-full mx-6"
          >
            <h2 className="text-4xl font-bold text-white mb-2">
              {gameOver ? "Stability Collapsed" : "Continue Research?"}
            </h2>
            <p className="text-zinc-400 mb-8">
              {gameOver
                ? `Final Score: ${scoreRef.current}`
                : "Simulation window paused. Would you like to continue?"}
            </p>

            <div className="flex flex-col gap-3">
              {gameOver ? (
                <button
                  onClick={() => {
                    setGameOver(false);
                    scoreRef.current = 0;
                    entitiesRef.current = [];
                    onScoreUpdate(0);
                  }}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  Restart Simulation <span className="text-[10px] opacity-50 px-1.5 py-0.5 rounded border border-white/20">ENTER</span>
                </button>
              ) : (
                <button
                  onClick={onContinue}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  Continue <span className="text-[10px] opacity-50 px-1.5 py-0.5 rounded border border-white/20">ENTER</span>
                </button>
              )}
              <button
                onClick={onExit}
                className="w-full px-6 py-3 border border-white/10 text-zinc-400 rounded-xl hover:bg-white/5 transition-colors font-medium text-sm"
              >
                Exit Simulation
              </button>
            </div>

            <p className="mt-8 text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em]">
              Auto-dismissing in 5s...
            </p>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

// ─── Scroll Progress Bar ─────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[310] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #6366f1, #a78bfa, #38bdf8)",
      }}
    />
  );
}


// ─── Scramble-decode name ────────────────────────────────────────────────────
const SCRAMBLE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjklmnpqrstuvwxyz01@#$*+=⌥⌘←→{}[]()";
const SWORDS = ["Kushagra", "Pandey"];
type CharCell = { char: string; locked: boolean };

function ScrambleName({ onDone }: { onDone?: () => void }) {
  const [lines, setLines] = useState<CharCell[][]>(() =>
    SWORDS.map(w =>
      w.split("").map(() => ({
        char: SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
        locked: false,
      }))
    )
  );

  useEffect(() => {
    let frameCount = 0;
    let rafId: number;
    let lastTs = 0;
    const MAX_FRAMES = 65;

    const tick = (ts: number) => {
      if (ts - lastTs < 16) { rafId = requestAnimationFrame(tick); return; }
      lastTs = ts;
      frameCount++;

      setLines(prev =>
        prev.map((line, wi) =>
          line.map((cell, ci) => {
            if (cell.locked) return cell;
            const unlockFrame = 6 + (wi * 10 + ci) * 2;
            if (frameCount >= unlockFrame) {
              return { char: SWORDS[wi][ci], locked: true };
            }
            return {
              char: SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
              locked: false,
            };
          })
        )
      );

      if (frameCount < MAX_FRAMES) {
        rafId = requestAnimationFrame(tick);
      } else {
        onDone?.();
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      aria-label="Kushagra Pandey"
      className="select-none mb-2"
      style={{ padding: "0.45em 0", overflow: "visible" }}
    >
      {lines.map((chars, wi) => (
        <div
          key={wi}
          className="flex justify-center"
          style={{ overflow: "visible", marginBottom: wi === 0 ? "0.02em" : 0 }}
        >
          {chars.map(({ char, locked }, ci) => (
            <span
              key={`${wi}-${ci}`}
              className={`font-display font-bold inline-block${locked ? " gradient-text" : ""}`}
              style={{
                fontSize: "clamp(3.5rem, 9.5vw, 8.5rem)",
                lineHeight: 1.35,
                letterSpacing: "-0.01em",
                padding: "0 0.02em",
                color: locked ? undefined : "rgba(99,102,241,0.4)",
                textShadow: locked ? "0 0 80px rgba(165,180,252,0.18)" : "none",
                transition: locked ? "text-shadow 0.4s ease, opacity 0.12s ease" : "none",
                overflow: "visible",
              }}
            >
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [scrambleDone, setScrambleDone] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [devBtnHovered, setDevBtnHovered] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameTimedOut, setGameTimedOut] = useState(false);
  const [isIndefinite, setIsIndefinite] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("chronos-high-score");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const handleScoreUpdate = useCallback((score: number) => {
    setGameScore(score);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("chronos-high-score", score.toString());
    }
  }, [highScore]);

  useEffect(() => {
    if (!devMode || isIndefinite) return;
    const t = setTimeout(() => setGameTimedOut(true), 15000);
    return () => clearTimeout(t);
  }, [devMode, isIndefinite]);

  const scrollToNext = useCallback(() => {
    const el = document.getElementById("about-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen w-full bg-black overflow-x-hidden">
      {/* ── Scroll progress ─────────────────────────────── */}
      <ScrollProgress />

      {/* ── Chronos Virtual Simulation Layer ──────────────────────── */}
      <ChronosGame
        active={devMode}
        onScoreUpdate={handleScoreUpdate}
        onExit={() => {
          setDevMode(false);
          setGameTimedOut(false);
          setIsIndefinite(false);
        }}
        timedOut={gameTimedOut}
        onContinue={() => {
          setGameTimedOut(false);
          setIsIndefinite(true);
        }}
      />

      {/* ── Fixed Nav (scroll-aware blur) ──────────────────────── */}
      <Navigation />

      {/* ══════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section
        id="hero-section"
        className="relative h-screen w-full flex flex-col items-center justify-center bg-black overflow-clip"
      >
        {/* Tarantula Nebula Backdrop Layer */}
        <AnimatePresence>
          {mounted && scrambleDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3.5, ease: "easeInOut" }}
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse 110% 80% at 50% 50%, rgba(10, 15, 25, 0.98) 0%, #000 100%),
                  radial-gradient(ellipse 65% 55% at 5% 5%, rgba(13, 148, 136, 0.28) 0%, transparent 80%),
                  radial-gradient(ellipse 65% 55% at 95% 95%, rgba(217, 119, 6, 0.22) 0%, transparent 80%),
                  radial-gradient(ellipse 55% 50% at 90% 10%, rgba(6, 182, 212, 0.2) 0%, transparent 75%),
                  radial-gradient(ellipse 55% 50% at 10% 90%, rgba(245, 158, 11, 0.15) 0%, transparent 75%),
                  radial-gradient(circle at 50% 50%, rgba(240, 249, 255, 0.1) 0%, transparent 45%)
                `,
              }}
            >
              {/* Central R136 Star Cluster Core (Subtle) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,transparent_65%)] opacity-50 mix-blend-screen animate-pulse-slow" />

              {/* Nebula Filament Textures */}
              <div className="absolute inset-0 opacity-25 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
              {/* Peripheral Nebula Filaments & Clouds */}
              <div
                className="absolute inset-0 opacity-50 mix-blend-screen"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 15% 15%, rgba(45, 212, 191, 0.12) 0%, transparent 40%),
                    radial-gradient(circle at 85% 85%, rgba(251, 191, 36, 0.1) 0%, transparent 40%),
                    radial-gradient(circle at 85% 15%, rgba(6, 182, 212, 0.08) 0%, transparent 35%),
                    radial-gradient(circle at 15% 85%, rgba(217, 119, 6, 0.08) 0%, transparent 35%)
                  `
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Fine dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Particles (Cosmic Stars) */}
        <Particles
          className={`absolute inset-0 z-[3] transition-opacity duration-[2.5s] ${scrambleDone ? "opacity-100" : "opacity-30"}`}
          quantity={scrambleDone ? 180 : 40}
          staticity={60}
          ease={50}
          refresh={scrambleDone}
        />

        {/* ── Content ──────────────────────────────── */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 select-none w-full max-w-6xl mx-auto">

          {/* Badge */}
          {mounted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10"
            >
            </motion.div>
          )}

          {/* Name — scramble decode reveal */}
          {mounted && <ScrambleName onDone={() => setScrambleDone(true)} />}

          {/* Badge — animates in sync with scramble */}
          {mounted && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10"
            >
              <span
                style={{
                  background: "linear-gradient(135deg, rgba(52,211,153,0.08) 0%, rgba(52,211,153,0.04) 100%)",
                  border: "1px solid rgba(52,211,153,0.25)",
                }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-mono tracking-wider"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                  style={{ boxShadow: "0 0 8px 2px rgba(52,211,153,0.5)" }}
                />
                Open to SWE Roles · May 2026
              </span>
            </motion.div>
          )}

          {mounted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="text-lg sm:text-xl md:text-2xl font-light text-zinc-400 mt-2 mb-4 h-9 flex items-center"
            >
              <Typewriter />
            </motion.div>
          )}

          {/* Nav links as subtle pills */}
          {mounted && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-6 flex-wrap justify-center"
            >
            </motion.div>
          )}
        </div>

        {/* Bottom fade to black */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none" />

        {/* ── Bouncing scroll arrow ────────────────── */}
        {mounted && (
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
          >
            <motion.button
              onClick={scrollToNext}
              className="flex flex-col items-center gap-2 group"
              whileHover={{ scale: 1.1 }}
              aria-label="Scroll down"
            >
              <span className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase font-mono group-hover:text-zinc-400 transition-colors">
                scroll
              </span>
              <motion.div
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors duration-300"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ boxShadow: "0 0 20px rgba(99,102,241,0.0)" }}
                whileHover={{ boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════
          ABOUT / PERSONA SECTION
      ══════════════════════════════════════════════════ */}
      <section
        id="about-section"
        className="relative py-28 bg-black overflow-hidden"
      >
        {/* Subtle right-side glow */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center md:justify-start"
          >
            <div className="photo-glow-wrapper shadow-2xl shadow-indigo-950/50">
              <img
                src="/me.jpg"
                alt="Kushagra Pandey"
                className="w-64 h-64 sm:w-72 sm:h-72 object-cover rounded-[14px] block"
              />
            </div>
          </motion.div>

          {/* Identity text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono">
              who I am
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug">
              I don't aim to just write code,{" "}
              <span className="gradient-text-vivid">I craft experiences.</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed text-[15px]">
              I'm{" "}
              <span className="font-medium bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                Kushagra Pandey,
              </span>{" "}
              a{" "}
              <span className="font-medium bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                full-stack engineer
              </span>{" "}
              early in my career, already building{" "}
              <span className="font-medium bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
                scalable, AI-driven systems
              </span>.
              {" "}I ship products with intent and design{" "}
              <span className="font-medium bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                architecture built to scale
              </span>.
            </p>
            <p className="text-zinc-500 leading-relaxed text-sm">
              Computer Science student at{" "}
              <span className="text-amber-300/80 font-medium">Arizona State University </span>
              with a minor in Film & Media Production.
            </p>
            <div className="flex gap-4 pt-2 flex-wrap">
              <Link
                href="/resume"
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all duration-300 hover:shadow-[0_0_24px_rgba(99,102,241,0.4)]"
              >
                Read Resume →
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-lg border border-white/10 text-zinc-400 text-sm hover:border-white/30 hover:text-white transition-all duration-300"
              >
                Get in Touch →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SKILLS BENTO SECTION
      ══════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-black border-t border-white/[0.04] overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-14 text-center"
          >
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono mb-3">
              technical depth
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              The Stack Behind the Vision
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillCategories.map((cat, ci) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.7,
                  delay: ci * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
                className="relative group rounded-2xl p-[1px] cursor-default"
                style={{
                  background: `linear-gradient(135deg, ${cat.color}20, transparent 60%)`,
                }}
              >
                {/* Inner card */}
                <div
                  className="relative h-full rounded-2xl bg-zinc-950 p-6 overflow-hidden"
                  style={{
                    boxShadow: `inset 0 0 30px ${cat.glow}`,
                  }}
                >
                  {/* Subtle hover bg bloom */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${cat.glow} 0%, transparent 70%)`,
                    }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <span
                        className="text-xl w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${cat.color}18`, color: cat.color }}
                      >
                        {cat.icon}
                      </span>
                      <span
                        className="text-sm font-semibold uppercase tracking-widest"
                        style={{ color: cat.color }}
                      >
                        {cat.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill, si) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.85 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: ci * 0.08 + si * 0.06 }}
                          whileHover={{
                            backgroundColor: `${cat.color}22`,
                            color: "#fff",
                            borderColor: `${cat.color}60`,
                            transition: { duration: 0.15 },
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.07] text-zinc-400 cursor-default transition-all duration-200"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Manifesto card — spans full row on lg */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="sm:col-span-2 lg:col-span-1 relative rounded-2xl p-[1px]"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.15), rgba(56,189,248,0.1))",
              }}
            >
              <div className="h-full rounded-2xl bg-zinc-950 p-6 flex flex-col justify-between"
                style={{ boxShadow: "inset 0 0 40px rgba(99,102,241,0.07)" }}
              >
                <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono mb-4">
                  my edge
                </p>
                <p className="text-zinc-300 text-sm leading-relaxed flex-1">
                  I bring engineering rigor, product instinct, and creative vision
                  together. Whether architecting serverless APIs or building
                  pixel-perfect interfaces, I optimize for what actually matters.
                </p>
                <div className="mt-6 pt-4 border-t border-white/[0.05]">
                  <span className="text-xs text-zinc-600 font-mono">
                    B.Sc Computer Science · Minor Film & Media Production
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TECH MARQUEE
      ══════════════════════════════════════════════════ */}
      <section className="relative py-14 bg-black border-y border-white/[0.04] overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        <div className="overflow-hidden">
          <div className="marquee-track">
            {[...techStrip, ...techStrip].map((tech, i) => (
              <div
                key={i}
                className="flex-shrink-0 mx-3 flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.05] transition-colors duration-300 cursor-default"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tech.color, boxShadow: `0 0 6px ${tech.color}80` }}
                />
                <span className="text-zinc-400 text-sm font-mono whitespace-nowrap">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PHILOSOPHY / VISION
      ══════════════════════════════════════════════════ */}
      <section className="relative py-32 bg-black overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs text-zinc-600 uppercase tracking-widest font-mono mb-10"
          >
            philosophy
          </motion.p>

          {["Good software is invisible.", "Great software is unforgettable."].map(
            (line, i) => (
              <motion.p
                key={i}
                className={`text-2xl sm:text-3xl md:text-4xl font-light leading-normal mb-3 ${i === 1 ? "font-semibold gradient-text-vivid" : "text-zinc-400"
                  }`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                "{line}"
              </motion.p>
            )
          )}

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="text-zinc-600 text-sm leading-relaxed max-w-md mx-auto mt-8"
          >
            I'm drawn to the intersection of technically rigorous systems and
            human-centered experiences. Precision and beauty aren't opposites,
            the best products are both.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          DEV MODE CTA TOGGLE
      ══════════════════════════════════════════════════ */}
      <section className="relative py-28 bg-black border-t border-white/[0.04] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: devMode
              ? "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 70%)"
              : "transparent",
            transition: "background 1.2s ease",
          }}
        />

        <div
          className="max-w-2xl mx-auto px-6 text-center relative"
          style={{ zIndex: devMode ? 200 : 70 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-zinc-600 uppercase tracking-widest font-mono mb-6"
          >
            front-end craft
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            {devMode ? (
              <span className="gradient-text-vivid">Aura Active. Collecting Light.</span>
            ) : (
              <>
                See the code{" "}
                <span className="gradient-text-vivid">come alive.</span>
                <div className="mt-4 text-base font-medium text-zinc-400 flex flex-col items-center gap-1">
                  <span>High Score: {highScore}</span>
                  <span className="text-zinc-600 text-xs font-mono uppercase tracking-widest animate-pulse">
                    Come and try to break the high score
                  </span>
                </div>
              </>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-zinc-500 text-sm mb-10 leading-relaxed"
          >
            {devMode
              ? `High Score: ${highScore} · Collect fragments to increase stability. Avoid the red rifts.`
              : "Experience 'Chronos,' an interactive high-performance canvas simulation demonstrating smooth physical momentum and real-time entity management."}

          </motion.p>

          <motion.button
            onClick={() => setDevMode((v) => !v)}
            onHoverStart={() => setDevBtnHovered(true)}
            onHoverEnd={() => setDevBtnHovered(false)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="relative inline-flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-500 overflow-hidden focus:outline-none"
            style={{
              background: devMode
                ? "linear-gradient(135deg, #1e1b4b, #312e81)"
                : "linear-gradient(135deg, #18181b, #27272a)",
              border: devMode
                ? "1px solid rgba(99,102,241,0.6)"
                : "1px solid rgba(255,255,255,0.12)",
              boxShadow: devMode
                ? "0 0 40px rgba(99,102,241,0.35), inset 0 0 20px rgba(99,102,241,0.05)"
                : devBtnHovered
                  ? "0 0 20px rgba(99,102,241,0.15)"
                  : "none",
              color: devMode ? "#a5b4fc" : "#a1a1aa",
            }}
          >
            {/* Animated shimmer on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={devBtnHovered && !devMode ? { x: ["−100%", "200%"] } : { x: "-100%" }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                width: "100%",
              }}
            />

            {/* Icon */}
            <motion.span
              animate={{ rotate: devMode ? 360 : 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg"
            >
              {devMode ? "◈" : "⌥"}
            </motion.span>

            <span className="relative z-10">
              {devMode ? "Stop Simulation" : "Enter Interactive Mode"}
            </span>

            {/* Pulsing dot when active */}
            {devMode && (
              <motion.span
                className="w-2 h-2 rounded-full bg-indigo-400 relative z-10"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.button>

          {devMode && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs text-zinc-700 font-mono mt-5"
            >
              requestAnimationFrame · high-speed collision detection · local-storage persistent high-score
            </motion.p>
          )}
        </div>
      </section >

      {/* ══════════════════════════════════════════════════
          CLOSING CTA
      ══════════════════════════════════════════════════ */}
      < section className="relative py-28 bg-black border-t border-white/[0.04] overflow-hidden" >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.09) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-zinc-600 uppercase tracking-widest font-mono mb-8"
          >
            get in touch
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5"
          >
            Let's build something{" "}
            <span className="gradient-text-vivid">remarkable.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="text-zinc-500 text-sm mb-12 leading-relaxed"
          >
            Whether it's a full-stack role, a startup opportunity, or a project
            worth shipping.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/contact"
              className="group px-7 py-3.5 rounded-xl bg-white text-black text-sm font-semibold tracking-wide transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.18)] hover:scale-[1.02]"
            >
              Get in Touch
              <span className="ml-2 opacity-40 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
            <a
              href="mailto:kushagrapandeyy@gmail.com"
              className="px-7 py-3.5 rounded-xl border border-white/12 text-zinc-400 text-sm font-medium hover:border-white/30 hover:text-white transition-all duration-300"
            >
              kushagrapandeyy@gmail.com ↗
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-zinc-700 text-xs font-mono"
          >
            Tempe, AZ · Arizona State University · CS '26
          </motion.p>
        </div>
      </section >
    </div >
  );
}
