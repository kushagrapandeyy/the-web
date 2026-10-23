"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { createRef, useEffect, useMemo, useRef, useState, type PointerEvent, type RefObject } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { TextReveal } from "./text-reveal";

const projects = [
  {
    slug: "firmlyticSolutions",
    title: "Firmlytic Solutions",
    role: "Founder · Product & engineering",
    image: "/ProjectPngs/firmlyticSolutions.png",
    alt: "Firmlytic Solutions company website, separate from the private legal beta",
    description: "From a legal practice’s daily workflow to a working beta. I founded Firmlytic and build Sainya Mitra, bringing case records, tracking, and client access together.",
    architecture: "React handles the case interface, Hasura supports data access, and AWS hosts the backend infrastructure.",
    status: "Sainya Mitra · Beta",
    caption: "Company website. The legal application is a separate beta.",
  },
  {
    slug: "Capstone",
    title: "Lyra",
    role: "Primary engineer",
    image: "/ProjectPngs/capstone-dating.png",
    alt: "Lyra application interface",
    description: "A sponsored ASU capstone connecting matching, conversation, and community. As primary engineer, I led the architecture and full-stack build for Endless Moments LLC.",
    architecture: "React delivers the interface; FastAPI runs weighted matching. PostgreSQL stores preferences, matches, and conversations.",
    status: "Completed ASU capstone · Spring 2026",
    caption: "Application interface. Sponsored by Endless Moments LLC.",
  },
  {
    slug: "sspandey",
    title: "SS Pandey & Associates",
    role: "Junior developer",
    image: "/ProjectPngs/sspandey.png",
    alt: "SS Pandey & Associates public website",
    description: "Giving a legal team remote access to documents that were tied to the office network. I built Spring Boot services, secured the APIs, and added caching.",
    architecture: "Spring Boot services and JWT-secured REST APIs connect remote staff to the existing document workflow. Caching reduces repeat retrievals.",
    status: "Legacy systems & remote access",
    caption: "Public website. My contribution was the internal document system.",
  },
];

function ProjectPanel({ project, index, panelRef, nextRef, enhanced, tilt }: {
  project: typeof projects[number];
  index: number;
  panelRef: RefObject<HTMLElement | null>;
  nextRef?: RefObject<HTMLElement | null>;
  enhanced: boolean;
  tilt: boolean;
}) {
  const pointerFrame = useRef<HTMLDivElement>(null);
  const mediaFrame = useRef<HTMLDivElement>(null);
  const mediaVisible = useInView(mediaFrame, { once: true, amount: 0.2 });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 260, damping: 30, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 260, damping: 30, mass: 0.6 });
  const rotateX = useTransform(smoothY, [-1, 1], [1.25, -1.25]);
  const rotateY = useTransform(smoothX, [-1, 1], [-1.75, 1.75]);
  const imageX = useTransform(smoothX, [-1, 1], [-3, 3]);
  const imageY = useTransform(smoothY, [-1, 1], [-2, 2]);
  const { scrollYProgress: incoming } = useScroll({ target: nextRef ?? panelRef, offset: ["start end", "start 25%"] });
  const remaining = projects.length - index - 1;
  const scale = useTransform(incoming, [0.4, 1], [1, 1 - remaining * 0.025]);
  const active = hovered || focused;

  function movePointer(event: PointerEvent<HTMLDivElement>) {
    if (!tilt || event.pointerType !== "mouse" || !pointerFrame.current) return;
    const bounds = pointerFrame.current.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    pointerX.set(Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)));
    pointerY.set(Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)));
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
    setHovered(false);
  }

  return (
    <article
      ref={panelRef}
      className="project-reel-panel relative"
      style={{ zIndex: focused ? 20 : index + 1 }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <motion.div className="project-reel-depth scroll-art origin-top" style={{ scale: enhanced && !focused ? scale : 1 }}>
        <motion.div ref={pointerFrame} className="project-reel-pointer scroll-art" style={{ perspective: 1200 }} initial={{ y: reduce ? 0 : 12 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduce ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }} onPointerMove={movePointer} onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }} onPointerLeave={resetPointer}>
          <motion.div
            className="project-reel-surface scroll-art rounded-2xl transition-shadow duration-200"
            style={{ rotateX: tilt && !focused ? rotateX : 0, rotateY: tilt && !focused ? rotateY : 0, boxShadow: active ? "var(--project-shadow-active)" : "var(--project-shadow)" }}
            animate={{ y: active && !reduce ? -3 : 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
          >
            <Link
              href={`/projects/${project.slug}`}
              aria-labelledby={`work-${project.slug}-title`}
              aria-describedby={`work-${project.slug}-description`}
              className="group grid overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-200 hover:border-paper/[0.18] focus-visible:border-accent-300 lg:min-h-[32rem] lg:grid-cols-[0.82fr_1.18fr]"
            >
              <div className="flex min-w-0 flex-col p-5 sm:p-8">
                <p className="text-xs leading-5 text-secondary sm:text-sm">{project.role}</p>
                <div className="mt-3 flex items-start justify-between gap-3 sm:mt-4 sm:gap-4">
                  <h3 id={`work-${project.slug}-title`} className="min-w-0 font-display text-[1.65rem] leading-[1.08] tracking-tight text-paper sm:text-3xl lg:text-4xl">{project.title}</h3>
                  <motion.span aria-hidden="true" className="mt-1 shrink-0 text-accent-300" animate={{ x: active && !reduce ? 3 : 0, y: active && !reduce ? -3 : 0 }} transition={{ type: "spring", stiffness: 340, damping: 36 }}><ArrowUpRight size={22} /></motion.span>
                </div>
                <p id={`work-${project.slug}-description`} className="mt-4 text-sm leading-6 text-secondary sm:mt-5 sm:text-base sm:leading-7">{project.description}</p>
                <div className="mt-6 hidden border-t border-paper/10 pt-5 sm:block">
                  <p className="text-xs text-secondary">Architecture</p>
                  <p className="mt-2 text-sm leading-6 text-secondary">{project.architecture}</p>
                </div>
                <p className="mt-auto pt-5 text-xs leading-5 text-secondary sm:pt-6">{project.status}</p>
              </div>
              <figure className="order-first flex min-w-0 flex-col justify-center px-4 pt-4 sm:px-8 sm:pt-8 lg:order-none lg:py-8 lg:pl-0">
                <div ref={mediaFrame} className="relative aspect-[16/10] overflow-hidden rounded-lg border border-paper/10 bg-canvas">
                  <motion.div className="project-reel-media scroll-art absolute inset-0" initial={{ clipPath: reduce ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }} animate={{ clipPath: mediaVisible || reduce ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }} transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ x: tilt && !focused ? imageX : 0, y: tilt && !focused ? imageY : 0 }}>
                    <Image src={project.image} alt={project.alt} fill sizes="(max-width: 1023px) 100vw, 60vw" className="object-contain p-3 sm:p-5" />
                  </motion.div>
                </div>
                <figcaption className="mt-3 text-xs leading-5 text-secondary">{project.caption}</figcaption>
              </figure>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </article>
  );
}

export function SelectedWork() {
  const section = useRef<HTMLElement>(null);
  const panelRefs = useMemo(() => projects.map(() => createRef<HTMLElement>()), []);
  const [enhanced, setEnhanced] = useState(false);
  const [tilt, setTilt] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const panels = Array.from(section.current?.querySelectorAll<HTMLElement>(".project-reel-panel") ?? []);
    const update = () => {
      // Sticky cards must fit below the final 8.5rem offset, including after fonts load or zoom changes.
      const tallest = Math.max(0, ...panels.map(panel => panel.offsetHeight));
      const stickyTop = 8.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
      setEnhanced(media.matches && tallest > 0 && tallest + stickyTop + 24 <= window.innerHeight);
      setTilt(media.matches && pointer.matches);
    };
    const observer = new ResizeObserver(update);
    panels.forEach(panel => observer.observe(panel));
    update();
    media.addEventListener("change", update);
    pointer.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
      pointer.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section ref={section} id="selected-work" className="project-reel work-section page-width section-space border-t border-paper/15" data-reel-motion={enhanced ? "on" : "off"}>
      <TextReveal className="work-heading mb-10 font-display tracking-tight text-paper">Selected work.</TextReveal>
      <div className="project-reel-list grid gap-8">
        {projects.map((project, index) => <ProjectPanel key={project.slug} project={project} index={index} panelRef={panelRefs[index]} nextRef={panelRefs[index + 1]} enhanced={enhanced} tilt={tilt} />)}
      </div>
    </section>
  );
}
