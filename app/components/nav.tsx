"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

const items = [
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
  { name: "Resume", href: "/resume" },
];

export function Navigation() {
  const pathname = usePathname() ?? "/";
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <header className="site-nav fixed inset-x-0 top-0 z-40 print:hidden">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
        <Link href="/" aria-label="Kushagra Pandey, home" className="inline-flex min-h-[44px] items-center font-display text-lg text-zinc-200">KP</Link>
        <ul className="flex items-center gap-5 sm:gap-9">
          {items.map(({ name, href }) => {
            const active = pathname.startsWith(href) || (href === "/projects" && pathname === "/design");
            return <li key={href}><Link href={href} aria-current={active ? "page" : undefined} className={`nav-link group relative inline-flex min-h-[44px] items-center text-[13px] sm:text-sm ${active ? "text-accent-300" : "text-zinc-400 hover:text-zinc-100"}`}>
              <span className="transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5">{name}</span>
              {active && <motion.span aria-hidden="true" layoutId="main-nav-location" className="absolute inset-x-0 bottom-1 h-px bg-accent-300" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }} />}
            </Link></li>;
          })}
        </ul>
      </nav>
      <motion.div aria-hidden="true" className="nav-progress h-px origin-left bg-accent-400/50" style={{ scaleX }} />
    </header>
  );
}
