"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring, useMotionTemplate } from "framer-motion";
import { ExternalLink, ChevronDown, ArrowUpRight, Printer, Briefcase, GraduationCap, Award, Terminal, Sliders, X, Sparkles, BookOpen } from "lucide-react";
import { Navigation } from "../components/nav";

// ─── Utilities & Animation Constants ─────────────────────────────────────────

const ease = [0.16, 1, 0.3, 1] as const;

// Text reveal from bottom/clip animation
const ClipReveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = "",
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", paddingBottom: "0.25em", marginBottom: "-0.25em" }} className={className}>
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

// Fade & slide reveal
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right" }> = ({
  children, delay = 0, direction = "up",
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const from =
    direction === "left" ? { opacity: 0, x: -24, y: 0 } :
      direction === "right" ? { opacity: 0, x: 24, y: 0 } :
        { opacity: 0, y: 20, x: 0 };
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

// Magnetic shimmer card with support for dimmed states based on filter matching
const PremiumCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  accent?: string;
  isMatched?: boolean;
  isDimmed?: boolean;
}> = ({
  children, className = "", accent = "rgba(99,102,241,0.04)", isMatched = false, isDimmed = false,
}) => {
    const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(0, { stiffness: 500, damping: 100 });
    const maskImage = useMotionTemplate`radial-gradient(280px at ${mouseX}px ${mouseY}px, ${accent}, transparent)`;

    return (
      <div
        className={`relative rounded-xl border overflow-hidden transition-all duration-500 ${isMatched
            ? "border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.15)] bg-zinc-950/90"
            : "border-zinc-800/60 bg-zinc-950/45 hover:border-zinc-700/60"
          } ${isDimmed ? "opacity-30 saturate-50 scale-[0.98]" : "opacity-100 scale-100"} ${className}`}
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

// ─── Data Definitions ────────────────────────────────────────────────────────

const resumeSummary =
  "Software engineer with over 2 years of experience building and shipping full-stack AI-integrated systems in production. Founded a legal tech SaaS scaled to over 1,000 daily active users at 99.9% uptime. Experienced across the full stack, from React and Node.js frontend interfaces to AWS cloud infrastructure, with hands-on experience in deploying LLMs via Anthropic Claude and OpenAI APIs into real production workflows.";

const experiences = [
  {
    company: "Firmlytic Solutions Private Limited",
    title: "Founder",
    period: "Jan 2024 – Present",
    location: "New Delhi, India",
    tags: ["React", "Node.js", "AWS", "DynamoDB", "Lambda", "Cloudflare", "Anthropic Claude API", "OpenAI API", "REST APIs", "TypeScript", "JavaScript"],
    color: "#14b8a6",
    highlights: [
      "Launched and scaled an AI legal SaaS platform on AWS (React, Node.js, DynamoDB) as sole founder to 1,000+ daily active users at 99.9% uptime in beta phase, automating document intake, routing, and client workflows end to end.",
      "Reduced attorney’s manual processing times by 40% by deploying Anthropic Claude APIs for document summarization, tagging, precedent finding, clause extractions, iterating on model outputs for enhancing results in production.",
      "Shielded confidential and sensitive legal data across all partner firms by deploying Cloudflare WAF at the network edge, and enforcing least-privilege IAM across all the AWS services."
    ],
  },
  {
    company: "ASU - Enterprise Brand and Strategy Management",
    title: "Production Assistant",
    period: "Oct 2024 – May 2026",
    location: "Tempe, Arizona",
    tags: ["NAS Systems", "Wrike", "AudioNetwork", "SRT Workflows", "Workflow Tooling"],
    color: "#fb923c",
    highlights: [
      "Proposed a NAS-based file sharing system and utilized Wrike, AudioNetwork, and SRT workflows to streamline pre-production, production, and post-production handoffs across a high-volume creative team."
    ],
  },
  {
    company: "SS Pandey & Associates",
    title: "Junior Developer",
    period: "Aug 2023 – Jan 2024",
    location: "New Delhi, India",
    tags: ["Spring Boot", "Java", "JWT", "REST APIs", "Caching", "Microservices", "XML"],
    color: "#34d399",
    highlights: [
      "Migrated a legacy LAN-based document collaboration and sharing system to a Spring Boot microservice with JWT-secured REST APIs, cutting the retrieval latency by 20% and enabling remote access to documents for the first time.",
      "Handled 1,000+ daily document transactions through the new ingestion APIs and improved the overall system performance by 30% through request caching and a hybrid cloud based and on-premise infrastructure optimization."
    ],
  },
  {
    company: "CyberSophy",
    title: "Software Intern",
    period: "Jun 2023 – Aug 2023",
    location: "Hyderabad, India",
    tags: ["Python", "MongoDB", "Web Scraping", "Selenium", "BeautifulSoup", "REST APIs"],
    color: "#38bdf8",
    highlights: [
      "Built a distributed Python web scraping framework using Selenium and BeautifulSoup, processing over 10,000 profiles daily at 85% confidence, across multiple sources.",
      "Reduced query latency on a 100K+ document MongoDB collection to under 200ms through schema redesign and indexing, reducing storage overhead by 35% significantly improving data retrieval performance at scale."
    ],
  },
];

const academicProjects = [
  {
    name: "Lyra - AI-Powered Matchmaking Platform",
    role: "Primary Engineer (Capstone, Sponsored)",
    period: "Aug 2025 – May 2026",
    color: "#06b6d4",
    tags: ["FastAPI", "PostgreSQL", "React", "Vercel", "Render", "OpenAI API", "Guardian AI", "TypeScript"],
    highlights: [
      "Led architecture and development of Lyra as the primary engineer, serving as the sole technical point of contact for the project sponsor.",
      "Designed the weighted matchmaking engine and integrated OpenAI API for the recommendation engine and Guardian AI safety filters.",
      "Built and deployed the full stack (FastAPI, PostgreSQL, React, Vercel, Render) with secure token authentication."
    ],
    href: "/projects/Capstone"
  },
  {
    name: "Grocery Price Tracker",
    role: "Database Management Project",
    period: "Jan 2025 – May 2025",
    color: "#34d399",
    tags: ["PostgreSQL", "React", "Node.js", "Web Scraping", "Caching", "Database Management"],
    highlights: [
      "Led development of a full-stack price monitoring system tracking 50+ stores with real-time alerts.",
      "Optimized PostgreSQL to handle 10,000+ daily price updates on items, delivering basket comparisons in under 200ms through indexed aggregations, smart caching, and a robust scraping engine."
    ],
    href: "/projects/priceTracker"
  }
];

const technicalSkills = {
  languages: {
    label: "Languages & Frameworks",
    skills: ["Python", "JavaScript", "React", "Node.js", "TypeScript", "C/C++", "Swift", "Spring Boot", "FastAPI", "Java"]
  },
  cloudData: {
    label: "Cloud, Databases & Tools",
    skills: ["AWS", "Google Cloud", "Docker", "Kubernetes", "Cloudflare", "PostgreSQL", "MongoDB", "Redis", "Git", "Linux", "REST APIs", "Anthropic Claude API", "OpenAI API", "Selenium", "BeautifulSoup"]
  }
};

const courses = [
  {
    name: "Data Structures & Algorithms",
    description: "Algorithmic complexity, advanced tree structures, graph algorithms, and dynamic programming optimizations.",
    application: "Powering weighted matching computations and pricing aggregators efficiently."
  },
  {
    name: "Operating Systems",
    description: "Process synchronization, multi-threading models, memory management, and system caching policies.",
    application: "Tuning distributed scrapers and microservice concurrency threads."
  },
  {
    name: "Database Management Systems",
    description: "Relational database theory, transaction isolation (ACID), index tuning, and schema normalization.",
    application: "Optimizing PostgreSQL aggregations and indexing MongoDB collections."
  },
  {
    name: "Information Assurance",
    description: "Security protocols, public key cryptography, network security, and secure session management.",
    application: "Implementing JWT REST authorizations and setting up Cloudflare WAF."
  },
  {
    name: "Artificial Intelligence",
    description: "Search methodologies, machine learning workflows, and model evaluation parameters.",
    application: "Orchestrating Vertex Pipelines and embedding GPT recommendations."
  },
  {
    name: "Computer Graphics",
    description: "Rendering equations, rasterization pipeline, vector math, and shader programming.",
    application: "Creating fluid user experiences and hardware-accelerated layouts."
  },
  {
    name: "Human-Computer Interaction",
    description: "User-centric research methodologies, interaction patterns, wireframing, and usability verification.",
    application: "Auditing product layouts and prototyping responsive layouts."
  },
  {
    name: "Theoretical Computer Science",
    description: "Automata theory, formal languages, Turing machines, and NP-completeness proofs.",
    application: "Writing structured parsers and processing complex text states."
  }
];

const certifications = [
  {
    name: "Vertex Pipelines: Qwik Start",
    issuer: "Google Cloud · Verified",
    url: "https://coursera.org/share/5a994ca1be192c787bc488cc9c37eade",
    description: "Build modular ML pipelines using Kubeflow pipelines on Vertex AI with automated training, evaluation, and conditional deployment.",
    icon: "G",
    color: "#4285f4",
  },
  {
    name: "Introduction to Docker",
    issuer: "Google Cloud · Verified",
    url: "https://coursera.org/share/756528e70c349650df8df12d756e23d6",
    description: "Containerized application deployment, docker images management, registries, and container lifecycle workflows.",
    icon: "D",
    color: "#2496ed",
  },
];

// ─── Timeline Entry Component ────────────────────────────────────────────────

const TimelineEntry: React.FC<{
  exp: typeof experiences[0];
  index: number;
  isLast: boolean;
  activeFilter: string | null;
  onTagClick: (tag: string) => void;
}> = ({ exp, index, isLast, activeFilter, onTagClick }) => {
  const [open, setOpen] = useState(index === 0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const hasSelectedSkill = activeFilter ? exp.tags.includes(activeFilter) : false;
  const isDimmed = activeFilter !== null && !hasSelectedSkill;
  const isMatched = activeFilter !== null && hasSelectedSkill;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05, ease }}
      className={`relative pl-8 transition-all duration-300`}
    >
      {/* Connector line */}
      {!isLast && (
        <div
          className="absolute left-[11px] top-6 w-px h-full bg-zinc-800 transition-colors"
          style={{
            background: isMatched
              ? `linear-gradient(180deg, ${exp.color}, rgba(24,24,27,0.1))`
              : isDimmed
                ? "rgba(39,39,42,0.15)"
                : `linear-gradient(180deg, ${exp.color}40, rgba(24,24,27,0.1))`
          }}
        />
      )}

      {/* Pulsing indicator dot */}
      <div
        className="absolute left-0 top-2 w-[23px] h-[23px] rounded-full border flex items-center justify-center -translate-x-[6px] transition-all duration-300 cursor-pointer"
        style={{
          borderColor: isMatched ? exp.color : isDimmed ? "#27272a" : `${exp.color}60`,
          backgroundColor: isMatched ? `${exp.color}15` : "rgba(9,9,11,0.6)",
          boxShadow: isMatched ? `0 0 10px ${exp.color}40` : "none"
        }}
        onClick={() => setOpen(!open)}
      >
        <div
          className="w-[9px] h-[9px] rounded-full transition-all duration-300"
          style={{
            backgroundColor: open || isMatched ? exp.color : "#52525b",
          }}
        />
      </div>

      <PremiumCard
        className="p-5 w-full cursor-pointer text-left"
        accent={`${exp.color}10`}
        isMatched={isMatched}
        isDimmed={isDimmed}
      >
        <div onClick={() => setOpen(!open)}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <h3 className="font-semibold text-zinc-100 text-sm group-hover:text-white transition-colors">
                  {exp.title}
                </h3>
                <span className="text-xs font-mono font-medium" style={{ color: exp.color }}>
                  {exp.company}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono mt-1">{exp.period} · {exp.location}</p>
            </div>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 mt-0.5"
            >
              <ChevronDown size={14} className="text-zinc-600 hover:text-zinc-400" />
            </motion.div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              style={{ overflow: "hidden" }}
            >
              <div className="pt-4 mt-4 border-t border-zinc-800/40 space-y-3">
                {exp.highlights.map((bullet, bi) => (
                  <p
                    key={bi}
                    className="text-xs text-zinc-400 leading-relaxed pl-3.5 relative"
                  >
                    <span
                      className="absolute left-0 top-2 w-[4px] h-[4px] rounded-full"
                      style={{ backgroundColor: exp.color }}
                    />
                    {bullet}
                  </p>
                ))}

                <div className="flex flex-wrap gap-1.5 pt-2.5">
                  {exp.tags.map((tag) => {
                    const tagMatched = activeFilter === tag;
                    return (
                      <span
                        key={tag}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTagClick(tag);
                        }}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer border transition-colors ${tagMatched
                            ? "bg-teal-950/80 border-teal-500 text-teal-300 font-bold"
                            : "bg-zinc-900/60 border-zinc-800/60 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
                          }`}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PremiumCard>
    </motion.div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ResumePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Custom states
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Auto trigger printing function
  const handlePrint = () => {
    window.print();
  };

  // Toggle filter logic
  const handleTagClick = (tag: string) => {
    setActiveFilter((prev) => (prev === tag ? null : tag));
  };

  const clearFilter = () => {
    setActiveFilter(null);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white relative selection:bg-teal-500/30 selection:text-teal-200">
      <Navigation />

      {/* Ambient background designs - Screen Only */}
      <div className="fixed inset-0 pointer-events-none grid-bg opacity-30 z-0 no-print" />
      <div
        className="fixed inset-0 pointer-events-none z-0 no-print"
        style={{
          background: "radial-gradient(circle 900px at 50% -100px, rgba(20,184,166,0.06) 0%, transparent 80%)",
        }}
      />
      <div className="fixed top-1/3 left-1/4 w-96 h-96 glow-orb bg-teal-500/5 pointer-events-none no-print" />
      <div className="fixed top-2/3 right-1/4 w-[450px] h-[450px] glow-orb bg-cyan-500/5 pointer-events-none no-print" />

      {/* Floating Interactive Controls - Screen Only */}
      <div className="fixed bottom-6 right-6 z-[50] flex flex-col gap-3 no-print">
        {activeFilter && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={clearFilter}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900 border border-teal-500/30 text-teal-400 hover:text-white hover:border-teal-400 transition-all duration-300 text-xs font-mono font-medium shadow-lg shadow-black/80"
          >
            <Sliders size={12} className="animate-pulse" />
            <span>Active Skill Filter: {activeFilter}</span>
            <X size={12} className="ml-1" />
          </motion.button>
        )}

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 w-12 h-12 md:w-auto md:px-5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition-all duration-300 shadow-xl shadow-black/80 group"
          title="Print or Export PDF"
        >
          <Printer size={15} className="group-hover:scale-110 transition-transform duration-300" />
          <span className="hidden md:inline text-xs font-mono tracking-wider">Export PDF / Print</span>
        </button>
      </div>

      {/* ── SCREEN VIEW LAYOUT ─────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-32 no-print">

        {/* HERO SECTION */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-zinc-900">
            <div className="space-y-4 max-w-2xl">
              <ClipReveal>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-mono tracking-[0.25em] uppercase">
                    Portfolio
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500/50" />
                  <span className="text-[10px] text-teal-400 font-mono tracking-[0.2em] uppercase font-bold animate-pulse">
                    Live resume
                  </span>
                </div>
              </ClipReveal>

              <ClipReveal delay={0.05}>
                <h1 className="text-4xl sm:text-6xl font-bold leading-[1.05] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-teal-200 to-teal-400">
                  Kushagra Pandey
                </h1>
              </ClipReveal>

              <ClipReveal delay={0.1}>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-light">
                  {resumeSummary}
                </p>
              </ClipReveal>

              <Reveal delay={0.15}>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-zinc-500">
                  <a href="mailto:kushagrapandeyy@gmail.com" className="hover:text-white transition-colors">
                    kushagrapandeyy@gmail.com
                  </a>
                  <span className="text-zinc-700">|</span>
                  <span className="hover:text-zinc-300 cursor-default">Tempe, AZ</span>
                  <span className="text-zinc-700">|</span>
                  <a href="https://linkedin.com/in/kushagra--pandey" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    LinkedIn <ExternalLink size={10} />
                  </a>
                  <span className="text-zinc-700">|</span>
                  <a href="https://github.com/kushagrapandeyy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    GitHub <ExternalLink size={10} />
                  </a>
                </div>
              </Reveal>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
              <motion.img
                src="/me.jpg"
                alt="Kushagra Pandey"
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover object-[center_20%] border border-zinc-800 shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="md:text-right">
                <p className="text-xs text-zinc-200 font-semibold flex items-center gap-1.5 md:justify-end">
                  <GraduationCap size={13} className="text-teal-400" />
                  Arizona State University
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">B.S. Computer Science · GPA 3.2</p>
                <p className="text-[11px] text-zinc-600">Graduating May 2026</p>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE SKILL MARQUEE PANEL */}
        <section className="mb-14">
          <Reveal>
            <div className="p-5 rounded-xl border border-zinc-800/40 bg-zinc-950/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sliders size={13} className="text-teal-400" />
                <span className="text-xs text-zinc-400 font-mono tracking-wider uppercase font-semibold">
                  Interactive Skills spotlight
                </span>
                <span className="text-[10px] text-zinc-600 font-mono italic">
                  (Click any tag below to spotlight related experiences & academic projects)
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest block mb-2">
                    {technicalSkills.languages.label}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {technicalSkills.languages.skills.map((skill) => {
                      const isSelected = activeFilter === skill;
                      return (
                        <button
                          key={skill}
                          onClick={() => handleTagClick(skill)}
                          className={`text-xs px-2.5 py-1 rounded-md transition-all duration-300 font-mono border ${isSelected
                              ? "bg-teal-500/20 border-teal-400 text-teal-200 shadow-md shadow-teal-500/10 font-bold"
                              : "bg-zinc-900/40 border-zinc-800/50 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
                            }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest block mb-2">
                    {technicalSkills.cloudData.label}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {technicalSkills.cloudData.skills.map((skill) => {
                      const isSelected = activeFilter === skill;
                      return (
                        <button
                          key={skill}
                          onClick={() => handleTagClick(skill)}
                          className={`text-xs px-2.5 py-1 rounded-md transition-all duration-300 font-mono border ${isSelected
                              ? "bg-teal-500/20 border-teal-400 text-teal-200 shadow-md shadow-teal-500/10 font-bold"
                              : "bg-zinc-900/40 border-zinc-800/50 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
                            }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT 2/3 COLUMN: WORK EXPERIENCE & PROJECTS */}
          <div className="lg:col-span-2 space-y-16">

            {/* WORK EXPERIENCE */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Briefcase size={18} className="text-teal-400" />
                <h2 className="text-xl font-bold tracking-tight text-zinc-100">Work Experience</h2>
                <div className="flex-1 h-px bg-zinc-900" />
              </div>

              <div className="relative space-y-5">
                {experiences.map((exp, index) => (
                  <TimelineEntry
                    key={exp.company}
                    exp={exp}
                    index={index}
                    isLast={index === experiences.length - 1}
                    activeFilter={activeFilter}
                    onTagClick={handleTagClick}
                  />
                ))}
              </div>
            </section>

            {/* ACADEMIC PROJECTS */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Terminal size={18} className="text-teal-400" />
                <h2 className="text-xl font-bold tracking-tight text-zinc-100">Academic Projects</h2>
                <div className="flex-1 h-px bg-zinc-900" />
              </div>

              <div className="grid grid-cols-1 gap-5">
                {academicProjects.map((proj, idx) => {
                  const hasSelectedSkill = activeFilter ? proj.tags.includes(activeFilter) : false;
                  const isDimmed = activeFilter !== null && !hasSelectedSkill;
                  const isMatched = activeFilter !== null && hasSelectedSkill;

                  return (
                    <PremiumCard
                      key={proj.name}
                      accent={`${proj.color}10`}
                      isMatched={isMatched}
                      isDimmed={isDimmed}
                      className="p-6 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                        <div>
                          <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase mb-1">
                            {proj.period}
                          </p>
                          <h3 className="text-base font-semibold text-zinc-200">
                            {proj.name}
                          </h3>
                          <p className="text-xs font-mono mt-0.5" style={{ color: proj.color }}>
                            {proj.role}
                          </p>
                        </div>
                        {proj.href && (
                          <Link href={proj.href}>
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              className="text-xs px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors flex items-center gap-1 font-mono shrink-0"
                            >
                              Case Study <ArrowUpRight size={11} />
                            </motion.span>
                          </Link>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        {proj.highlights.map((bullet, bi) => (
                          <p key={bi} className="text-xs text-zinc-400 leading-relaxed pl-3.5 relative">
                            <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-zinc-700" />
                            {bullet}
                          </p>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-900/60">
                        {proj.tags.map((tag) => {
                          const tagMatched = activeFilter === tag;
                          return (
                            <span
                              key={tag}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTagClick(tag);
                              }}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer border transition-colors ${tagMatched
                                  ? "bg-teal-950/80 border-teal-500 text-teal-300 font-bold"
                                  : "bg-zinc-900/60 border-zinc-800/60 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
                                }`}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    </PremiumCard>
                  );
                })}
              </div>
            </section>

          </div>

          {/* RIGHT 1/3 COLUMN: EDUCATION, CERTIFICATIONS & COURSEWORK */}
          <div className="space-y-12">

            {/* EDUCATION */}
            <section className="space-y-5">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-teal-400" />
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">
                  Education
                </span>
              </div>

              <PremiumCard className="p-5">
                <h3 className="text-sm font-semibold text-zinc-200">
                  Arizona State University
                </h3>
                <p className="text-xs text-teal-400 mt-1">Ira A. Fulton Schools of Engineering</p>

                <div className="mt-4 space-y-2 text-xs text-zinc-400 leading-relaxed font-light">
                  <p>
                    <span className="font-semibold text-zinc-300">Degree:</span> Bachelor of Science, Computer Science
                  </p>
                  <p>
                    <span className="font-semibold text-zinc-300">Minor:</span> Film and Media Production
                  </p>
                  <p>
                    <span className="font-semibold text-zinc-300">GPA:</span> 3.2
                  </p>
                  <p>
                    <span className="font-semibold text-zinc-300">Completion:</span> May 2026
                  </p>
                </div>
              </PremiumCard>
            </section>

            {/* CERTIFICATIONS */}
            <section className="space-y-5">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-teal-400" />
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">
                  Certifications
                </span>
              </div>

              <div className="space-y-3">
                {certifications.map((cert) => (
                  <a
                    key={cert.name}
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <PremiumCard className="p-4 hover:border-zinc-700/60" accent={`${cert.color}08`}>
                      <div className="flex gap-3">
                        <div
                          className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border"
                          style={{
                            backgroundColor: `${cert.color}15`,
                            borderColor: `${cert.color}30`,
                            color: cert.color
                          }}
                        >
                          {cert.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5 mb-0.5">
                            <h4 className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors truncate">
                              {cert.name}
                            </h4>
                            <ExternalLink size={10} className="text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                          </div>
                          <p className="text-[9px] text-zinc-500 font-mono">{cert.issuer}</p>
                          <p className="text-[10px] text-zinc-500 line-clamp-2 mt-1.5 leading-normal font-light">
                            {cert.description}
                          </p>
                        </div>
                      </div>
                    </PremiumCard>
                  </a>
                ))}
              </div>
            </section>

            {/* RELEVANT COURSEWORK CARDS */}
            <section className="space-y-5">
              <div className="flex items-center gap-2.5">
                <BookOpen size={16} className="text-teal-400" />
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">
                  Relevant Coursework
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {courses.map((course, idx) => (
                  <div
                    key={course.name}
                    className="p-4 rounded-xl border border-zinc-800/60 bg-zinc-950/45 hover:border-zinc-700/50 hover:bg-zinc-950/70 transition-all duration-300 relative group overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-zinc-500/80">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500/20 group-hover:bg-teal-400/40 transition-colors" />
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-200 mt-1.5 group-hover:text-white transition-colors duration-200">
                      {course.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed mt-2 font-light">
                      {course.description}
                    </p>
                    <div className="text-[10px] font-mono text-teal-400/90 mt-2.5 pt-2.5 border-t border-zinc-900/60 leading-normal">
                      <span className="text-zinc-500 uppercase tracking-widest text-[8px] mr-1.5 font-sans font-bold">Applied:</span>
                      {course.application}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

        </div>

      </main>


      {/* ── PRINT-ONLY TRADITIONAL RESUME SHEET ──────────────────────────────── */}
      {/* Renders when window.print() is called, hides entirely on screen.       */}
      <div className="hidden print:block text-black bg-white p-12 max-w-4xl mx-auto font-sans leading-relaxed text-xs">

        {/* Print Header */}
        <div className="text-center pb-4 border-b border-zinc-300 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-black">Kushagra Pandey</h1>
          <p className="text-[10px] text-zinc-700">
            kushagrapandeyy@gmail.com | Tempe, AZ
          </p>
          <p className="text-[9px] text-zinc-500 font-mono">
            LinkedIn: linkedin.com/in/kushagra--pandey | GitHub: github.com/kushagrapandeyy | Web: www.kushagrapandey.com
          </p>
        </div>

        {/* Summary */}
        <div className="py-4 space-y-1.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">Summary</h2>
          <p className="text-[10px] text-zinc-800 text-justify">
            {resumeSummary}
          </p>
        </div>

        {/* Technical Skills */}
        <div className="py-2 space-y-1.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">Technical Skills</h2>
          <div className="space-y-1 text-[9.5px]">
            <p>
              <strong className="text-black font-semibold">Languages & Frameworks:</strong> {technicalSkills.languages.skills.join(", ")}
            </p>
            <p>
              <strong className="text-black font-semibold">Cloud, Databases & Tools:</strong> {technicalSkills.cloudData.skills.join(", ")}
            </p>
          </div>
        </div>

        {/* Work Experience */}
        <div className="py-3 space-y-2">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">Work Experience</h2>

          {experiences.map((exp) => (
            <div key={exp.company} className="space-y-1 text-[10px] mb-3">
              <div className="flex justify-between font-bold text-black">
                <span>{exp.company}</span>
                <span>{exp.location}</span>
              </div>
              <div className="flex justify-between text-zinc-700 italic text-[9.5px]">
                <span>{exp.title}</span>
                <span>{exp.period}</span>
              </div>
              <ul className="list-disc pl-4 text-[9.5px] text-zinc-800 space-y-0.5">
                {exp.highlights.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Academic Projects */}
        <div className="py-3 space-y-2">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">Academic Projects</h2>

          {academicProjects.map((proj) => (
            <div key={proj.name} className="space-y-1 text-[10px] mb-3">
              <div className="flex justify-between font-bold text-black">
                <span>{proj.name}</span>
                <span>{proj.period}</span>
              </div>
              <p className="text-[9.5px] text-zinc-700 italic font-semibold">{proj.role}</p>
              <ul className="list-disc pl-4 text-[9.5px] text-zinc-800 space-y-0.5">
                {proj.highlights.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="py-3 space-y-1.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">Education</h2>
          <div className="space-y-0.5 text-[10px]">
            <div className="flex justify-between font-bold text-black">
              <span>Arizona State University, Ira A. Fulton Schools of Engineering</span>
              <span>Tempe, Arizona</span>
            </div>
            <div className="flex justify-between text-zinc-700 italic text-[9.5px]">
              <span>Bachelor of Science, Computer Science, Minor in Film and Media Production (GPA 3.2)</span>
              <span>Graduating May 2026</span>
            </div>
            <p className="text-[9px] text-zinc-600 mt-1 leading-normal">
              <strong className="text-black">Relevant Coursework:</strong> {courses.map(c => c.name).join(", ")}
            </p>
          </div>
        </div>

        {/* Certifications */}
        <div className="py-2 space-y-1.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">Certifications</h2>
          <ul className="list-disc pl-4 text-[9.5px] text-zinc-800 space-y-0.5">
            {certifications.map((cert) => (
              <li key={cert.name}>
                <strong className="text-black">{cert.name}</strong> ({cert.issuer}) : {cert.description}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Media print style overrides */}
      <style jsx global>{`
        @media print {
          /* Hide all screen components */
          .no-print {
            display: none !important;
          }
          
          /* Show print components */
          .print\\:block {
            display: block !important;
          }

          body {
            background-color: white !important;
            color: black !important;
            font-size: 10px !important;
          }

          @page {
            size: letter;
            margin: 0.4in;
          }

          header, footer, nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
