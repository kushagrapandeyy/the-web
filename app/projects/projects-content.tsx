"use client";

import Link from "next/link";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card } from "../components/card";
import { Article } from "./article";
import { Eye } from "lucide-react";

// Scroll-based reveal with optimized timing
const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 1.3", "end 0.3"] });
  
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.6, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.3], [6, 0]);
  
  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay }}
    >
      <motion.div style={{ filter: blur }}>
        {children}
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

export const ProjectsContent: React.FC<Props> = ({ featured, top2, top3, sorted, views }) => {
  return (
    <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
      <ScrollReveal>
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Projects
          </h2>
          <p className="mt-4 text-zinc-400">These are the projects I have done.</p>
        </div>
      </ScrollReveal>

      <motion.div
        className="w-full h-px bg-zinc-800"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
      />

      {/* Featured */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ScrollReveal delay={0.1}>
          <Card>
            <Link href={`/projects/${featured.slug}`}>
              <article className="relative w-full p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-zinc-100">
                    {featured.date ? (
                      <time dateTime={new Date(featured.date).toISOString()}>
                        {Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                          new Date(featured.date)
                        )}
                      </time>
                    ) : (
                      <span>SOON</span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <Eye className="w-4 h-4" />
                    {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                      views[featured.slug] ?? 0
                    )}
                  </span>
                </div>
                <h2 className="mt-4 text-3xl font-bold text-zinc-100 sm:text-4xl font-display group-hover:text-white">
                  {featured.title}
                </h2>
                <p className="mt-4 leading-8 text-zinc-400 group-hover:text-zinc-300 pb-12">
                  {featured.description}
                </p>
                <div>
                  <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                    Read more <span aria-hidden="true">&rarr;</span>
                  </p>
                </div>
              </article>
            </Link>
          </Card>
        </ScrollReveal>

        {/* Top 2 & 3 */}
        <div className="flex flex-col gap-8">
          {[top2, top3].map((project, idx) => (
            <ScrollReveal key={project.slug} delay={0.15 + idx * 0.1}>
              <Card>
                <Article project={project} views={views[project.slug] ?? 0} />
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <motion.div
        className="hidden w-full h-px md:block bg-zinc-800"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
      />

      {/* Remaining */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {sorted.map((project, idx) => (
          <ScrollReveal key={project.slug} delay={idx * 0.05}>
            <Card>
              <Article project={project} views={views[project.slug] ?? 0} />
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};
