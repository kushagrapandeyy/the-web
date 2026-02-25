"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, animate, useInView } from "framer-motion";
import Particles from "./components/particles";

// ─── Navigation ─────────────────────────────────────────────────────────────
const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
  { name: "Resume", href: "/resume" },
];

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
const BALL_KEYWORDS = [
  "React", "TypeScript", "Next.js", "FastAPI", "AWS",
  "Docker", "Redis", "Postgres", "Framer", "Canvas",
  "Node.js", "Python", "Spring", "Vertex AI", "k8s",
  "useRef", "rAF", "DynamoDB", "Expo", "Cloudflare",
];
const BALL_COLORS = [
  "#818cf8", "#38bdf8", "#34d399", "#f472b6",
  "#fb923c", "#a78bfa", "#60a5fa", "#4ade80",
];

type PhysBall = {
  x: number; y: number; vx: number; vy: number;
  r: number; mass: number; color: string; label: string;
  trail: [number, number][]; isName?: boolean;
};

function DevModeCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const ballsRef = useRef<PhysBall[]>([]);
  const mouseRef = useRef<{ x: number; y: number; down: boolean }>({
    x: -9999, y: -9999, down: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = () => canvas.width;
    const H = () => canvas.height;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse listeners on canvas
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - r.left;
      mouseRef.current.y = e.clientY - r.top;
    };
    const onDown = () => { mouseRef.current.down = true; };
    const onUp = () => { mouseRef.current.down = false; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup", onUp);

    const GRAVITY = 0.22;
    const FRICTION = 0.988;
    const FLOOR_BOUNCE = 0.62;
    const WALL_BOUNCE = 0.68;

    // Small tech balls
    const small: PhysBall[] = Array.from({ length: 18 }, (_, i) => {
      const r = 24 + Math.random() * 22;
      return {
        x: r + Math.random() * (window.innerWidth - 2 * r),
        y: -r - Math.random() * 320,
        vx: (Math.random() - 0.5) * 5,
        vy: 1 + Math.random() * 3,
        r, mass: r * r,
        color: BALL_COLORS[i % BALL_COLORS.length],
        label: BALL_KEYWORDS[i % BALL_KEYWORDS.length],
        trail: [],
      };
    });

    // Name block — heavy, drops from above center
    const nameBall: PhysBall = {
      x: window.innerWidth / 2,
      y: -180,
      vx: (Math.random() - 0.5) * 2,
      vy: 1.5,
      r: 110,
      mass: 800000,  // very heavy — barely moves when small balls hit it
      color: "#818cf8",
      label: "Kushagra Pandey",
      trail: [],
      isName: true,
    };

    ballsRef.current = [...small, nameBall];

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.16)";
      ctx.fillRect(0, 0, W(), H());

      const balls = ballsRef.current;
      const { x: mx, y: my, down: md } = mouseRef.current;

      // --- Physics tick ---
      balls.forEach(b => {
        // Mouse interaction: move = repel, hold = attract
        const ddx = b.x - mx, ddy = b.y - my;
        const mdist = Math.sqrt(ddx * ddx + ddy * ddy);
        const reach = 180;
        if (mdist < reach && mdist > 0) {
          const strength = ((reach - mdist) / reach) * (md ? -0.7 : 0.4);
          b.vx += (ddx / mdist) * strength;
          b.vy += (ddy / mdist) * strength;
        }

        b.vy += GRAVITY;
        b.vx *= FRICTION;
        b.x += b.vx;
        b.y += b.vy;

        if (b.y + b.r > H()) { b.y = H() - b.r; b.vy *= -FLOOR_BOUNCE; b.vx += (Math.random() - 0.5) * 1.2; }
        if (b.y - b.r < 0) { b.y = b.r; b.vy *= -0.45; }
        if (b.x + b.r > W()) { b.x = W() - b.r; b.vx *= -WALL_BOUNCE; }
        if (b.x - b.r < 0) { b.x = b.r; b.vx *= -WALL_BOUNCE; }

        b.trail.push([b.x, b.y]);
        if (b.trail.length > (b.isName ? 4 : 12)) b.trail.shift();
      });

      // --- Ball-ball collision (mass-weighted impulse) ---
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i], bj = balls[j];
          const dx = bj.x - a.x, dy = bj.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minD = a.r + bj.r;
          if (dist < minD && dist > 0) {
            const nx = dx / dist, ny = dy / dist;
            const ov = (minD - dist) / 2;
            const total = a.mass + bj.mass;
            a.x -= nx * ov * (bj.mass / total) * 2;
            a.y -= ny * ov * (bj.mass / total) * 2;
            bj.x += nx * ov * (a.mass / total) * 2;
            bj.y += ny * ov * (a.mass / total) * 2;
            const relV = (a.vx - bj.vx) * nx + (a.vy - bj.vy) * ny;
            if (relV > 0) {
              const imp = relV * 2 / total;
              a.vx -= imp * bj.mass * nx; a.vy -= imp * bj.mass * ny;
              bj.vx += imp * a.mass * nx; bj.vy += imp * a.mass * ny;
            }
          }
        }
      }

      // --- Draw trails (small balls only) ---
      balls.forEach(b => {
        if (b.isName || b.trail.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(b.trail[0][0], b.trail[0][1]);
        b.trail.forEach(([tx, ty]) => ctx.lineTo(tx, ty));
        ctx.strokeStyle = b.color + "38";
        ctx.lineWidth = b.r * 0.55;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      });

      // --- Draw balls ---
      balls.forEach(b => {
        if (b.isName) {
          // Outer glow
          const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 1.7);
          grd.addColorStop(0, "rgba(99,102,241,0.25)");
          grd.addColorStop(1, "transparent");
          ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 1.7, 0, Math.PI * 2);
          ctx.fillStyle = grd; ctx.fill();

          // Circle body
          ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(15,14,50,0.85)";
          ctx.fill();
          ctx.strokeStyle = "rgba(129,140,248,0.7)";
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Name text (two lines)
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#e0e7ff";
          ctx.font = `bold ${Math.round(b.r * 0.3)}px 'Inter', 'Helvetica Neue', sans-serif`;
          ctx.fillText("Kushagra", b.x, b.y - b.r * 0.17);
          ctx.fillText("Pandey", b.x, b.y + b.r * 0.22);

          // Tiny label
          ctx.font = `${Math.round(b.r * 0.12)}px 'Courier New', monospace`;
          ctx.fillStyle = "rgba(129,140,248,0.5)";
          ctx.fillText("[ physics object ]", b.x, b.y + b.r * 0.58);
        } else {
          // Glow halo
          const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 2.2);
          grd.addColorStop(0, b.color + "50");
          grd.addColorStop(1, "transparent");
          ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = grd; ctx.fill();

          ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = b.color + "18"; ctx.fill();
          ctx.strokeStyle = b.color + "cc"; ctx.lineWidth = 1.5; ctx.stroke();

          ctx.font = `bold ${Math.round(b.r * 0.42)}px 'Courier New', monospace`;
          ctx.fillStyle = b.color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(b.label, b.x, b.y);
        }
      });

      // Mouse cursor ring
      if (mx > 0 && mx < W() && my > 0 && my < H()) {
        ctx.beginPath();
        ctx.arc(mx, my, 10, 0, Math.PI * 2);
        ctx.strokeStyle = md ? "rgba(165,180,252,0.8)" : "rgba(99,102,241,0.45)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = md ? "rgba(165,180,252,0.15)" : "rgba(99,102,241,0.08)";
        ctx.fill();
      }

      // Debug footer
      ctx.font = '9px \'Courier New\', monospace';
      ctx.fillStyle = 'rgba(99,102,241,0.35)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(`balls: ${balls.length - 1} + name block | move = repel, hold = attract`, 16, H() - 12);

      animRef.current = requestAnimationFrame(draw);
    };

    if (active) draw();
    else ctx.clearRect(0, 0, W(), H());

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup", onUp);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[60]"
      style={{
        opacity: active ? 1 : 0,
        transition: "opacity 0.6s ease",
        mixBlendMode: "screen",
        pointerEvents: active ? "auto" : "none",
        cursor: active ? "crosshair" : "default",
      }}
    />
  );
}

// ─── Scroll Progress Bar ─────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #6366f1, #a78bfa, #38bdf8)",
      }}
    />
  );
}

// ─── Home Nav (scroll-aware blur) ──────────────────────────────────────────────
function HomeNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 transition-all duration-500"
      style={{
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        background: scrolled
          ? "linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.6))"
          : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <ul className="flex items-center justify-center gap-8 py-4">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm text-zinc-500 hover:text-white transition-colors duration-300 tracking-widest uppercase font-light"
          >
            {item.name}
          </Link>
        ))}
      </ul>
    </nav>
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

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-kill dev mode after 15s
  useEffect(() => {
    if (!devMode) return;
    const t = setTimeout(() => setDevMode(false), 15000);
    return () => clearTimeout(t);
  }, [devMode]);

  const scrollToNext = useCallback(() => {
    const el = document.getElementById("about-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen w-full bg-black overflow-x-hidden">
      {/* ── Scroll progress ─────────────────────────────── */}
      <ScrollProgress />

      {/* ── Dev Mode Canvas overlay ──────────────────────── */}
      <DevModeCanvas active={devMode} />

      {/* ── Fixed Nav (scroll-aware blur) ──────────────────────── */}
      <HomeNav />

      {/* ══════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section
        id="hero-section"
        className="relative h-screen w-full flex flex-col items-center justify-center"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 80% 70%, rgba(139,92,246,0.09) 0%, transparent 60%), #000",
          overflow: "clip",
        }}
      >
        {/* Fine dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Particles */}
        <Particles
          className="absolute inset-0 z-[3] animate-fade-in"
          quantity={50}
          staticity={45}
          ease={55}
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

        <div className="max-w-2xl mx-auto px-6 text-center relative z-[70]">
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
              <span className="gradient-text-vivid">It's alive. Physics, collisions, gravity.</span>
            ) : (
              <>
                See the code{" "}
                <span className="gradient-text-vivid">come alive.</span>
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
              ? "Physics ball-pit: gravity, wall bounce, collision. Auto-stops in 15s or press Stop."
              : "Toggle developer mode to see a real-time physics simulation rendered with Canvas 2D. Pure React, zero dependencies."}

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
              {devMode ? "Stop" : "Enter Developer Mode"}
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
              requestAnimationFrame loop · Canvas 2D API · gravity + collision physics
            </motion.p>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CLOSING CTA
      ══════════════════════════════════════════════════ */}
      <section className="relative py-28 bg-black border-t border-white/[0.04] overflow-hidden">
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
      </section>
    </div>
  );
}
