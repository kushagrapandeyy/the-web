"use client";

import Link from "next/link";
import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Eye, ArrowUpRight } from "lucide-react";

// Scroll-based reveal
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right" }> = ({
  children,
  delay = 0,
  direction = "up",
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const initial =
    direction === "left" ? { opacity: 0, x: -32 } :
      direction === "right" ? { opacity: 0, x: 32 } :
        { opacity: 0, y: 28 };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Project card with tilt
const ProjectCard: React.FC<{
  children: React.ReactNode;
  delay?: number;
  featured?: boolean;
  accent?: string;
}> = ({ children, delay = 0, featured = false, accent = "rgba(99,102,241,0.15)" }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    setTilt({ x: (cy / rect.height) * 6, y: (-cx / rect.width) * 6 });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
        animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: hovered ? 1.012 : 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
        className="relative group h-full"
      >
        {/* Glow border */}
        <motion.div
          className="absolute -inset-px rounded-2xl pointer-events-none"
          animate={{
            opacity: hovered ? 1 : 0,
            background: featured
              ? "linear-gradient(135deg, rgba(99,102,241,0.5), rgba(139,92,246,0.25), transparent 60%)"
              : `linear-gradient(135deg, ${accent}, transparent 60%)`,
          }}
          transition={{ duration: 0.4 }}
          style={{ borderRadius: 16 }}
        />

        {/* Top shimmer line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none rounded-t-2xl"
          animate={{ opacity: hovered ? 1 : 0.2, scaleX: hovered ? 1 : 0.3 }}
          style={{
            background: featured
              ? "linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            transformOrigin: "center",
          }}
          transition={{ duration: 0.5 }}
        />

        <div
          className="relative rounded-2xl border border-white/[0.05] bg-zinc-950/80 overflow-hidden h-full"
          style={{
            boxShadow: hovered
              ? featured
                ? "0 24px 80px rgba(99,102,241,0.18), 0 0 0 1px rgba(99,102,241,0.25)"
                : "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)"
              : "none",
            transition: "box-shadow 0.4s ease",
          }}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

type Props = {
  featured: any;
  top2: any;
  top3: any;
  sorted: any[];
  views: Record<string, number>;
};

const formatViews = (n: number) =>
  Intl.NumberFormat("en-US", { notation: "compact" }).format(n);

const formatDate = (d: string) =>
  Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(d));

export const ProjectsContent: React.FC<Props> = ({ featured, top2, top3, sorted, views }) => {
  return (
    <div className="min-h-screen bg-black">
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 10%, rgba(99,102,241,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 px-6 pt-24 mx-auto max-w-7xl lg:px-8 md:pt-32 pb-24">

        {/* ── Header ── */}
        <div className="mb-20">
          <Reveal>
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono mb-5">
              portfolio · {sorted.length + 3} projects
            </p>
          </Reveal>
          <div className="flex items-end justify-between flex-wrap gap-6">
            <Reveal delay={0.05}>
              <h1 className="text-5xl sm:text-6xl font-bold text-white leading-[1.05] tracking-tight">
                What I've{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Engineered
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.1} direction="right">
              <p className="text-zinc-600 text-sm leading-relaxed max-w-xs text-right">
                AI platforms · Full-stack systems
              </p>
            </Reveal>
          </div>

          {/* Animated divider */}
          <motion.div
            className="mt-10 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.25), rgba(255,255,255,0.04), transparent)" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* ── Featured (full-width banner) ── */}
        <ProjectCard delay={0} featured>
          <Link href={`/projects/${featured.slug}`} className="block">
            <article className="relative p-8 md:p-12 lg:p-14">
              {/* Background grain texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
              />

              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-indigo-400/20 bg-indigo-400/5">
                    Featured
                  </span>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-zinc-700 font-mono">
                  <Eye className="w-3.5 h-3.5" />
                  {formatViews(views[featured.slug] ?? 0)}
                </span>
              </div>

              <div className="flex items-end justify-between gap-8 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-100 group-hover:text-white transition-colors duration-400 leading-tight mb-4">
                    {featured.title}
                  </h2>
                  <p className="text-zinc-500 text-base leading-relaxed max-w-xl group-hover:text-zinc-400 transition-colors duration-300">
                    {featured.description}
                  </p>
                </div>

                <motion.div
                  className="flex items-center gap-2 text-indigo-400 text-sm font-medium shrink-0"
                  initial={{ x: -4, opacity: 0.5 }}
                  whileHover={{ x: 0, opacity: 1 }}
                >
                  <span>Read case study</span>
                  <ArrowUpRight className="w-4 h-4" />
                </motion.div>
              </div>

              {featured.date && (
                <p className="mt-8 text-xs text-zinc-700 font-mono">
                  {formatDate(featured.date)}
                </p>
              )}
            </article>
          </Link>
        </ProjectCard>

        {/* ── Tier 2: 60/40 split ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mt-5">
          {/* 60% */}
          <div className="lg:col-span-3">
            <ProjectCard delay={0.08} accent="rgba(56,189,248,0.12)">
              <Link href={`/projects/${top2.slug}`} className="block">
                <article className="p-7 md:p-9">
                  <div className="flex justify-between gap-2 items-center mb-5">
                    <span className="text-xs text-zinc-600 font-mono">
                      {top2.date ? formatDate(top2.date) : "SOON"}
                    </span>
                    <span className="text-zinc-600 text-xs flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {formatViews(views[top2.slug] ?? 0)}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-200 group-hover:text-white transition-colors duration-300 mb-3 leading-snug">
                    {top2.title}
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors duration-300">
                    {top2.description}
                  </p>
                  <div className="mt-6 flex items-center gap-1.5 text-xs text-zinc-700 group-hover:text-sky-400 transition-colors duration-300">
                    <span>View project</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </article>
              </Link>
            </ProjectCard>
          </div>

          {/* 40% */}
          <div className="lg:col-span-2">
            <ProjectCard delay={0.14} accent="rgba(52,211,153,0.12)">
              <Link href={`/projects/${top3.slug}`} className="block">
                <article className="p-7 md:p-9 h-full flex flex-col">
                  <div className="flex justify-between gap-2 items-center mb-5">
                    <span className="text-xs text-zinc-600 font-mono">
                      {top3.date ? formatDate(top3.date) : "SOON"}
                    </span>
                    <span className="text-zinc-600 text-xs flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {formatViews(views[top3.slug] ?? 0)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-200 group-hover:text-white transition-colors duration-300 mb-3 leading-snug flex-1">
                    {top3.title}
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors duration-300 line-clamp-3">
                    {top3.description}
                  </p>
                  <div className="mt-6 flex items-center gap-1.5 text-xs text-zinc-700 group-hover:text-emerald-400 transition-colors duration-300">
                    <span>View project</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </article>
              </Link>
            </ProjectCard>
          </div>
        </div>

        {/* ── Divider ── */}
        {sorted.length > 0 && (
          <motion.div
            className="my-16 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />
        )}

        {/* ── Other projects: staggered 3-col ── */}
        {sorted.length > 0 && (
          <>
            <Reveal>
              <p className="text-xs text-zinc-700 uppercase tracking-widest font-mono mb-8">
                More work
              </p>
            </Reveal>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sorted.map((project, idx) => (
                <ProjectCard key={project.slug} delay={idx * 0.06} accent="rgba(167,139,250,0.1)">
                  <Link href={`/projects/${project.slug}`} className="block h-full">
                    <article className="p-6 h-full flex flex-col">
                      <div className="flex justify-between gap-2 items-center mb-4">
                        <span className="text-xs text-zinc-700 font-mono">
                          {project.date ? formatDate(project.date) : "SOON"}
                        </span>
                        <span className="text-zinc-700 text-xs flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatViews(views[project.slug] ?? 0)}
                        </span>
                      </div>
                      <h2 className="text-base font-semibold text-zinc-300 group-hover:text-white transition-colors duration-300 mb-2 flex-1 leading-snug">
                        {project.title}
                      </h2>
                      <p className="text-zinc-600 text-sm leading-relaxed line-clamp-2 group-hover:text-zinc-500 transition-colors duration-300">
                        {project.description}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-xs text-zinc-700 group-hover:text-violet-400 transition-colors duration-300">
                        <span>Read</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </article>
                  </Link>
                </ProjectCard>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
