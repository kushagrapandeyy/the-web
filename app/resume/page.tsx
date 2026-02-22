"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronDown, ArrowUpRight } from "lucide-react";
import { Navigation } from "../components/nav";

// ─── Utilities ───────────────────────────────────────────────────────────────

const ease = [0.16, 1, 0.3, 1] as const;

// Clip-path text reveal from left
const ClipReveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = "",
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} style={{ overflow: "hidden" }} className={className}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : {}}
        transition={{ duration: 0.75, delay, ease }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Fade slide in
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right" }> = ({
  children, delay = 0, direction = "up",
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const from =
    direction === "left" ? { opacity: 0, x: -28, y: 0 } :
      direction === "right" ? { opacity: 0, x: 28, y: 0 } :
        { opacity: 0, y: 24, x: 0 };
  return (
    <motion.div ref={ref}
      initial={from}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
};

// Magnetic shimmer card
const Card: React.FC<{ children: React.ReactNode; className?: string; accent?: string }> = ({
  children, className = "", accent = "rgba(255,255,255,0.03)",
}) => {
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });
  const maskImage = useMotionTemplate`radial-gradient(300px at ${mouseX}px ${mouseY}px, ${accent}, transparent)`;
  return (
    <div
      className={`relative rounded-xl border border-zinc-800/50 bg-zinc-950/60 overflow-hidden hover:border-zinc-700/50 transition-colors duration-500 ${className}`}
      onMouseMove={(e) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
      }}
    >
      <motion.div className="pointer-events-none absolute inset-0 z-10" style={{ backgroundImage: maskImage }} />
      {children}
    </div>
  );
};

// Animated skill bar
const SkillBar: React.FC<{ label: string; level: number; color?: string; delay?: number }> = ({
  label, level, color = "#818cf8", delay = 0,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-zinc-400">{label}</span>
        <span className="text-[10px] text-zinc-700 font-mono">{level}%</span>
      </div>
      <div className="h-px bg-zinc-900 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}cc, ${color})` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
};

// Tag
const Tag: React.FC<{ label: string; index?: number }> = ({ label, index = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.35, delay: index * 0.035, ease }}
      className="text-xs px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800/80 text-zinc-500 hover:text-zinc-200 hover:border-zinc-600 transition-colors duration-300 cursor-default"
    >
      {label}
    </motion.span>
  );
};

// Section label above divider
const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <Reveal>
    <div className="flex items-center gap-4 mb-12">
      <span className="text-[10px] text-zinc-600 uppercase tracking-[0.25em] font-mono">{label}</span>
      <motion.div
        className="flex-1 h-px"
        style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.3), transparent)" }}
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease }}
      />
      <div className="w-1 h-1 rounded-full bg-indigo-500/40" />
    </div>
  </Reveal>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const experiences = [
  {
    company: "Firmlytic Solutions",
    title: "Founder & Lead Engineer",
    period: "Jan 2024 – Present",
    location: "New Delhi, India",
    tags: ["React", "Node.js", "AWS", "DynamoDB", "Lambda", "Cloudflare"],
    color: "#818cf8",
    highlights: [
      "Architected and scaled an AI-driven legal platform (React, Node.js, AWS) serving 500+ Daily Active Users with 99.9% uptime",
      "Designed serverless REST APIs using AWS Lambda + DynamoDB, automating document workflows and reducing manual effort by 40%",
      "Implemented Cloudflare WAF and least-privilege IAM policies to protect sensitive user data",
    ],
  },
  {
    company: "Arizona State University",
    title: "Production Assistant",
    period: "Oct 2024 – Present",
    location: "Tempe, AZ",
    tags: ["Python", "React", "Node.js", "Automation"],
    color: "#38bdf8",
    highlights: [
      "Automated internal media workflows reducing production cycles by 30% with Python asset-management scripts",
      "Architected custom workflow management tools with React + Node.js to streamline team collaboration",
      "Leading pre-production, equipment logistics, and post-production coordination for high-volume projects",
    ],
  },
  {
    company: "SS Pandey & Associates",
    title: "Junior Developer",
    period: "Aug 2023 – Jan 2024",
    location: "New Delhi, India",
    tags: ["Spring Boot", "Java", "Microservices", "JWT"],
    color: "#34d399",
    highlights: [
      "Built Spring Boot microservice for document lifecycle management with JWT auth, cutting retrieval latency by 45%",
      "Designed RESTful APIs for document ingestion handling 10K+ daily transactions",
      "Contributed to cloud migration and implemented caching strategies improving performance by 20%",
    ],
  },
  {
    company: "CyberSophy",
    title: "Software Intern",
    period: "Jun 2023 – Aug 2023",
    location: "Hyderabad, India",
    tags: ["Python", "MongoDB", "Web Scraping"],
    color: "#fb923c",
    highlights: [
      "Engineered distributed web scraping framework processing 10,000+ profiles daily with 95% accuracy",
      "Designed MongoDB schema with strategic indexing enabling sub-100ms queries on 5M+ documents",
      "Implemented deduplication logic reducing storage overhead by 35%",
    ],
  },
];

const skillGroups = [
  {
    label: "Frontend",
    color: "#818cf8",
    skills: [
      { label: "React / Next.js", level: 92 },
      { label: "TypeScript", level: 88 },
      { label: "CSS / Tailwind", level: 85 },
    ],
  },
  {
    label: "Backend",
    color: "#34d399",
    skills: [
      { label: "Node.js / FastAPI", level: 87 },
      { label: "Spring Boot / Java", level: 78 },
      { label: "Python", level: 85 },
    ],
  },
  {
    label: "Cloud & Data",
    color: "#38bdf8",
    skills: [
      { label: "AWS (Lambda, DynamoDB)", level: 82 },
      { label: "PostgreSQL / MongoDB", level: 84 },
      { label: "Docker / Kubernetes", level: 72 },
    ],
  },
];

const allSkillTags = {
  Languages: ["Java", "Python", "C++", "JavaScript", "TypeScript", "Swift"],
  "Cloud & DevOps": ["AWS Lambda", "Google Cloud", "Docker", "Kubernetes", "Cloudflare", "Redis"],
  "Databases": ["PostgreSQL", "MongoDB", "DynamoDB", "MySQL", "Redis"],
  "Frameworks": ["React", "Next.js", "FastAPI", "Spring Boot", "Node.js", "Expo"],
};

const certifications = [
  {
    name: "Vertex Pipelines: Qwik Start",
    issuer: "Google Cloud · Verified",
    url: "https://coursera.org/share/5a994ca1be192c787bc488cc9c37eade",
    description: "Modular ML pipelines on Vertex AI with automated training, evaluation, and conditional deployment.",
    icon: "G",
    color: "#4285f4",
  },
  {
    name: "Introduction to Docker",
    issuer: "Google Cloud · Verified",
    url: "https://coursera.org/share/756528e70c349650df8df12d756e23d6",
    description: "Containerized application deployment, image management, and container lifecycle workflows.",
    icon: "D",
    color: "#2496ed",
  },
];

// ─── Timeline Experience Entry ─────────────────────────────────────────────────
const TimelineEntry: React.FC<{ exp: typeof experiences[0]; index: number; isLast: boolean }> = ({
  exp, index, isLast,
}) => {
  const [open, setOpen] = useState(index === 0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.07, ease }}
      className="relative pl-8"
    >
      {/* Timeline line */}
      {!isLast && (
        <motion.div
          className="absolute left-[11px] top-6 w-px"
          style={{ background: `linear-gradient(180deg, ${exp.color}50, transparent)` }}
          initial={{ height: 0 }}
          animate={inView ? { height: "calc(100% + 24px)" } : {}}
          transition={{ duration: 0.8, delay: index * 0.07 + 0.3, ease }}
        />
      )}

      {/* Dot */}
      <motion.div
        className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2"
        style={{
          borderColor: exp.color,
          background: open ? exp.color : "transparent",
          boxShadow: open ? `0 0 12px ${exp.color}60` : "none",
        }}
        animate={{
          background: open ? exp.color : "transparent",
          boxShadow: open ? `0 0 12px ${exp.color}60` : "none",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Card */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left group"
      >
        <div className="border border-zinc-800/50 rounded-xl bg-zinc-950/40 hover:border-zinc-700/50 transition-colors duration-300 overflow-hidden">
          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2.5 flex-wrap mb-1">
                  <h3 className="font-semibold text-zinc-100 text-sm group-hover:text-white transition-colors">
                    {exp.title}
                  </h3>
                  <span className="text-xs font-mono" style={{ color: `${exp.color}99` }}>
                    {exp.company}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 font-mono">{exp.period} · {exp.location}</p>
                {!open && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {exp.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="flex-shrink-0 mt-0.5"
              >
                <ChevronDown size={14} className="text-zinc-700 group-hover:text-zinc-500 transition-colors" />
              </motion.div>
            </div>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="pt-4 mt-4 border-t border-zinc-800/50 space-y-2.5">
                    {exp.highlights.map((h, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.4 }}
                        className="text-xs text-zinc-400 leading-relaxed pl-3"
                        style={{ borderLeft: `2px solid ${exp.color}30` }}
                      >
                        {h}
                      </motion.p>
                    ))}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.tags.map((t, i) => <Tag key={t} label={t} index={i} />)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </button>
    </motion.div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResumePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const gradientStop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white relative">
      <Navigation />

      {/* Fixed scroll progress bar (left edge) */}
      <motion.div
        className="fixed left-0 top-0 w-[2px] bg-gradient-to-b from-indigo-400 via-violet-400 to-transparent origin-top z-50"
        style={{ scaleY: scrollYProgress }}
      />

      {/* Ambient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 35% at 50% 0%, rgba(99,102,241,0.05) 0%, transparent 70%)" }}
      />

      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-28">

        {/* ═══════════════════════════════════════════════════════════
              INTRO — full viewport, bold
        ═══════════════════════════════════════════════════════════ */}
        <section className="flex flex-col justify-center min-h-[85vh] pt-28 pb-16">
          <div className="flex items-start justify-between gap-8 flex-col lg:flex-row">
            <div className="flex-1 space-y-6">

              <div>
                <ClipReveal>
                  <p className="text-xs text-zinc-600 font-mono tracking-widest uppercase mb-4">
                    Software Engineer
                  </p>
                </ClipReveal>
                <ClipReveal delay={0.05}>
                  <h1
                    className="text-5xl sm:text-6xl font-bold leading-[1.04] tracking-tight"
                    style={{
                      background: "linear-gradient(135deg, #f1f5f9 25%, #c7d2fe 60%, #818cf8 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Kushagra<br />Pandey
                  </h1>
                </ClipReveal>
              </div>

              <ClipReveal delay={0.1}>
                <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
                  Full-stack engineer with experience building AI-driven applications from frontend interface to scalable backend architecture. Passionate about modular system design, performance-aware engineering, and products that are technically sound and user-centered.
                </p>
              </ClipReveal>

              <Reveal delay={0.2}>
                <div className="flex flex-wrap items-center gap-5 text-xs">
                  <a href="https://www.linkedin.com/in/kushagrapandeyy/" target="_blank" rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                    LinkedIn <ExternalLink size={10} />
                  </a>
                  <a href="mailto:kushagrapandeyy@gmail.com"
                    className="text-zinc-500 hover:text-white transition-colors">
                    kushagrapandeyy@gmail.com
                  </a>
                  <span className="text-zinc-700">Tempe, AZ</span>
                </div>
              </Reveal>

              <Reveal delay={0.25}>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
                  style={{
                    background: "linear-gradient(135deg, rgba(52,211,153,0.08), rgba(52,211,153,0.03))",
                    border: "1px solid rgba(52,211,153,0.2)",
                    color: "#34d399",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                    style={{ boxShadow: "0 0 6px rgba(52,211,153,0.5)" }} />
                  Open to SWE Roles · May 2026
                </div>
              </Reveal>
            </div>

            {/* Photo + education callout */}
            <div className="flex flex-col items-end gap-5">
              <motion.img
                src="/me.jpg"
                alt="Kushagra Pandey"
                className="w-28 h-28 lg:w-36 lg:h-36 rounded-xl object-cover border border-zinc-800 shadow-xl shadow-black/60"
                initial={{ opacity: 0, scale: 0.82, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.9, ease }}
                whileHover={{ scale: 1.04, rotate: 1.5 }}
              />
              <Reveal direction="right" delay={0.15}>
                <div className="text-right space-y-0.5">
                  <p className="text-xs text-zinc-300 font-medium">Arizona State University</p>
                  <p className="text-xs text-zinc-600">B.S. Computer Science · '26</p>
                  <p className="text-xs text-zinc-700">Dean's List</p>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Scroll invitation */}
          <motion.div
            className="flex items-center gap-2 mt-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={14} className="text-zinc-700" />
            </motion.div>
            <span className="text-[10px] text-zinc-700 font-mono tracking-widest uppercase">Scroll to explore</span>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
              SKILLS — visual bars + tags
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 space-y-14 border-t border-zinc-900">
          <div>
            <ClipReveal>
              <p className="text-3xl sm:text-4xl font-bold text-zinc-100 leading-tight mb-1">
                What I
                <span
                  style={{
                    background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                > Build With</span>
              </p>
            </ClipReveal>
            <Reveal delay={0.05}>
              <p className="text-zinc-600 text-sm mt-2">Depth across the full stack</p>
            </Reveal>
          </div>

          {/* Bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {skillGroups.map((group, gi) => (
              <Reveal key={group.label} delay={gi * 0.1}>
                <Card className="p-6" accent={`${group.color}15`}>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono mb-5">
                    {group.label}
                  </p>
                  <div className="space-y-4">
                    {group.skills.map((s, si) => (
                      <SkillBar
                        key={s.label}
                        label={s.label}
                        level={s.level}
                        color={group.color}
                        delay={gi * 0.12 + si * 0.08}
                      />
                    ))}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* All tags */}
          <Card className="p-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(allSkillTags).map(([cat, items]) => (
                <div key={cat}>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono mb-3">{cat}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((item, i) => <Tag key={item} label={item} index={i} />)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ═══════════════════════════════════════════════════════════
              EXPERIENCE — vertical timeline
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 border-t border-zinc-900">
          <div className="mb-12">
            <ClipReveal>
              <p className="text-3xl sm:text-4xl font-bold text-zinc-100 leading-tight mb-1">
                Where I've
                <span
                  style={{
                    background: "linear-gradient(135deg, #34d399, #38bdf8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                > Shipped</span>
              </p>
            </ClipReveal>
            <Reveal delay={0.05}>
              <p className="text-zinc-600 text-sm mt-2">4 roles · 2 countries</p>
            </Reveal>
          </div>

          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <TimelineEntry key={exp.company} exp={exp} index={i} isLast={i === experiences.length - 1} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
              PROJECTS
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 border-t border-zinc-900">
          <div className="mb-12">
            <ClipReveal>
              <p className="text-3xl sm:text-4xl font-bold text-zinc-100 leading-tight mb-1">
                What I've
                <span
                  style={{
                    background: "linear-gradient(135deg, #a78bfa, #f0abfc)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                > Launched</span>
              </p>
            </ClipReveal>
            <Reveal delay={0.05}>
              <p className="text-zinc-600 text-sm mt-2">Selected projects</p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "Lyra - AI Dating Platform",
                href: "/projects/Capstone",
                stack: ["FastAPI", "PostgreSQL", "React", "Expo"],
                desc: "Capstone project. Full-stack matchmaking platform with AI ranking, real-time messaging, and secure auth.",
                label: "Capstone · 2025–26",
                color: "#a78bfa",
              },
              {
                name: "Grocery Price Tracker",
                href: "/projects/priceTracker",
                stack: ["PostgreSQL", "Node.js", "React"],
                desc: "Query-optimized price monitoring with basket tracking, store comparison, and alert workflows.",
                label: "DB Engineering · 2025",
                color: "#34d399",
              },
            ].map((p, i) => (
              <Reveal key={p.name} delay={i * 0.1}>
                <Link href={p.href}>
                  <Card className="p-6 hover:border-zinc-700/80 group cursor-pointer h-full" accent={`${p.color}12`}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">{p.label}</p>
                      <ArrowUpRight size={13} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors mb-2">
                      {p.name}
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.stack.map((t, i) => <Tag key={t} label={t} index={i} />)}
                    </div>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-5">
              <Link href="/projects"
                className="text-xs text-zinc-600 hover:text-white transition-colors flex items-center gap-1.5">
                View all projects <ArrowUpRight size={11} />
              </Link>
            </div>
          </Reveal>
        </section>

        {/* ═══════════════════════════════════════════════════════════
              CERTIFICATIONS
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 border-t border-zinc-900">
          <SectionLabel label="Certifications" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert, i) => (
              <Reveal key={cert.name} delay={i * 0.08}>
                <a href={cert.url} target="_blank" rel="noopener noreferrer" className="block group">
                  <Card className="p-6 hover:border-zinc-700/80" accent={`${cert.color}15`}>
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: `${cert.color}15`, color: cert.color, border: `1px solid ${cert.color}30` }}
                      >
                        {cert.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors leading-tight">
                            {cert.name}
                          </h3>
                          <ExternalLink size={11} className="text-zinc-700 group-hover:text-zinc-400 transition-colors mt-0.5 flex-shrink-0" />
                        </div>
                        <p className="text-[10px] text-zinc-600 font-mono mb-2">{cert.issuer}</p>
                        <p className="text-xs text-zinc-500 leading-relaxed">{cert.description}</p>
                      </div>
                    </div>
                  </Card>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
              FOOTER CTA
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-12 border-t border-zinc-900">
          <Reveal>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-zinc-300 font-medium text-sm">Let's build something.</p>
                <p className="text-zinc-600 text-xs mt-1">Open to full-time SWE roles starting May 2026</p>
              </div>
              <Link
                href="/contact"
                className="group flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-600 rounded-lg px-4 py-2.5"
              >
                Get in touch
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </Reveal>
        </section>

      </main>
    </div>
  );
}
