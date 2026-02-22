"use client";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Navigation } from "../components/nav";

const contactLinks = [
  {
    label: "Email",
    value: "kushagrapandeyy@gmail.com",
    href: "mailto:kushagrapandeyy@gmail.com",
    description: "Best for opportunities & project inquiries",
    icon: "✉",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.18)",
    from: { x: -60, opacity: 0 },
  },
  {
    label: "LinkedIn",
    value: "/in/kushagrapandeyy",
    href: "https://www.linkedin.com/in/kushagrapandeyy/",
    description: "Professional background & network",
    icon: "◈",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.18)",
    from: { y: 60, opacity: 0 },
    external: true,
  },
  {
    label: "GitHub",
    value: "kushagrapandeyy",
    href: "https://github.com/kushagrapandeyy",
    description: "Code, experiments & open source",
    icon: "⌥",
    color: "#34d399",
    glow: "rgba(52,211,153,0.18)",
    from: { x: 60, opacity: 0 },
    external: true,
  },
];

// Tilt card with magnetic hover
const TiltCard: React.FC<{
  children: React.ReactNode;
  color: string;
  glow: string;
}> = ({ children, color, glow }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); setHovered(false); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, perspective: 800, transformStyle: "preserve-3d" }}
      className="relative rounded-2xl p-[1px] cursor-pointer"
    >
      {/* Animated border gradient */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          background: hovered
            ? `linear-gradient(135deg, ${color}60, ${color}20, transparent 60%)`
            : `linear-gradient(135deg, ${color}20, transparent 60%)`,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Inner card */}
      <div
        className="relative rounded-2xl bg-zinc-950 overflow-hidden h-full"
        style={{ boxShadow: hovered ? `0 20px 60px ${glow}, inset 0 0 40px ${glow}` : `inset 0 0 20px ${glow}` }}
      >
        {/* Bloom on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: `radial-gradient(circle at 50% -20%, ${glow} 0%, transparent 65%)`,
          }}
        />

        {/* Top glow line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px]"
          animate={{ opacity: hovered ? 1 : 0.3, scaleX: hovered ? 1 : 0.4 }}
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, transformOrigin: "center" }}
          transition={{ duration: 0.5 }}
        />

        {/* Arrow */}
        <motion.div
          className="absolute top-6 right-6 text-lg"
          animate={{ x: hovered ? 0 : 4, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ color }}
        >
          ↗
        </motion.div>

        {children}
      </div>
    </motion.div>
  );
};

const ContactCard: React.FC<{ link: typeof contactLinks[0]; index: number }> = ({ link, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.a
      ref={ref}
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
      initial={link.from}
      animate={inView ? { x: 0, y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="block"
    >
      <TiltCard color={link.color} glow={link.glow}>
        <div className="relative z-10 p-8">
          <div className="flex items-center gap-3 mb-6">
            <motion.span
              className="text-xl w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.15, rotate: 8 }}
              style={{ background: `${link.color}15`, color: link.color }}
            >
              {link.icon}
            </motion.span>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: link.color }}>
              {link.label}
            </span>
          </div>

          <p className="text-lg font-medium text-zinc-200 mb-2 break-all group-hover:text-white transition-colors duration-300">
            {link.value}
          </p>
          <p className="text-zinc-600 text-sm">{link.description}</p>
        </div>
      </TiltCard>
    </motion.a>
  );
};

export default function ContactPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const words = ["Let's", "build", "something", "remarkable."];

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <Navigation />

      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(99,102,241,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-36 pb-24">
        {/* Header - word-by-word reveal with blur */}
        <div ref={heroRef} className="mb-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs text-zinc-600 uppercase tracking-widest font-mono mb-6"
          >
            get in touch
          </motion.p>

          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
            <span className="flex flex-wrap justify-center gap-x-[0.3em]">
              {words.map((word, i) => (
                <motion.span
                  key={word}
                  className={i === words.length - 1 ? "gradient-text-vivid" : ""}
                  initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                  animate={heroInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-zinc-500 text-base max-w-md mx-auto leading-relaxed"
          >
            Whether a role, a collaboration, or just a conversation worth having.
          </motion.p>

          {/* Status pulse */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-2 mt-6"
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
              style={{ boxShadow: "0 0 6px 2px rgba(52,211,153,0.5)" }}
            />
            <span className="text-xs text-zinc-600 font-mono tracking-wide">Available for SWE roles · May 2026</span>
          </motion.div>
        </div>

        {/* Separator line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={heroInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-px mb-12"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
        />

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4">
          {contactLinks.map((link, i) => (
            <ContactCard key={link.label} link={link} index={i} />
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="text-center text-zinc-700 text-xs font-mono mt-16"
        >
          Tempe, AZ · Arizona State University · CS '26
        </motion.p>
      </main>
    </div>
  );
}
