"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { Mail, Linkedin, MapPin, ExternalLink, ChevronDown } from "lucide-react";
import { Navigation } from "../components/nav";

const InteractiveCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const maskImage = useMotionTemplate`radial-gradient(280px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div
      onMouseMove={onMouseMove}
      className="overflow-hidden relative duration-700 border rounded-lg hover:bg-zinc-800/10 group hover:border-zinc-400/50 border-zinc-700/50"
    >
      <div className="pointer-events-none">
        <motion.div
          className="absolute inset-0 z-10 bg-gradient-to-br opacity-100 via-zinc-100/10 transition duration-1000 group-hover:opacity-50"
          style={style}
        />
        <motion.div
          className="absolute inset-0 z-10 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100"
          style={style}
        />
      </div>
      {children}
    </div>
  );
};

// Advanced scroll-based reveal with parallax - optimized for readability
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

// Highlight item with staggered animation - safer for readability
const AnimatedHighlight: React.FC<{ text: string; index: number }> = ({ text, index }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.1"] });
  
  const x = useTransform(scrollYProgress, [0, 1], [-30, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0.5, 1]);
  
  return (
    <motion.div
      ref={ref}
      style={{ 
        opacity,
        x,
      }}
    >
      <li className="text-xs text-zinc-400 leading-relaxed">
        • {text}
      </li>
    </motion.div>
  );
};

interface ExperienceItem {
  company: string;
  title: string;
  period: string;
  location: string;
  highlights: string[];
  tags: string[];
}

interface ProjectItem {
  name: string;
  period: string;
  description: string;
  highlights: string[];
  tech: string[];
}

interface CertificationItem {
  name: string;
  issuer: string;
  url: string;
  description: string;
}

const experiences: ExperienceItem[] = [
  {
    company: "Firmlytic Solutions Private Limited",
    title: "Founder",
    period: "January 2024 - Present",
    location: "New Delhi, India",
    tags: ["React", "Node.js", "AWS", "DynamoDB", "Lambda"],
    highlights: [
      "Architected and scaled an AI-driven legal platform (React, Node.js, AWS) serving 500+ Daily Active Users with 99.9% uptime",
      "Designed serverless REST APIs using AWS Lambda and DynamoDB, automating document workflows and reducing manual effort by 40%",
      "Implemented Cloudflare WAF and least-privilege IAM policies to mitigate security risks and protect sensitive user data"
    ]
  },
  {
    company: "Arizona State University",
    title: "Production Assistant",
    period: "October 2024 - Present",
    location: "Tempe, Arizona",
    tags: ["Automation", "Production"],
    highlights: [
      "Automated internal media workflows reducing production cycles by 30%, implementing Python scripts for asset management and automated file processing",
      "Leading pre-production planning, equipment logistics, and post-production coordination for high-volume media projects and university broadcasts",
      "Architected custom workflow management tools with React frontend and Node.js backend to streamline team collaboration and reduce manual overhead"
    ]
  },
  {
    company: "SS Pandey & Associates",
    title: "Junior Developer",
    period: "August 2023 - January 2024",
    location: "New Delhi, India",
    tags: ["Spring Boot", "Microservices"],
    highlights: [
      "Built and deployed Spring Boot microservice for document lifecycle management with JWT authentication, reducing data retrieval latency by 45% through query optimization",
      "Designed RESTful API endpoints for document ingestion, processing, and retrieval workflows handling 10K+ daily transactions",
      "Contributed to cloud migration initiatives, optimizing database queries and implementing caching strategies to improve platform performance by 20%"
    ]
  },
  {
    company: "CyberSophy",
    title: "Software Intern",
    period: "June 2023 - August 2023",
    location: "Hyderabad, India",
    tags: ["Python", "MongoDB"],
    highlights: [
      "Engineered distributed web scraping framework in Python processing 10,000+ profiles daily with 95% data accuracy and built-in error recovery",
      "Designed MongoDB schema with strategic indexing and aggregation pipelines for real-time filtering, enabling sub-100ms query responses on 5M+ documents",
      "Implemented data validation and deduplication logic reducing storage overhead by 35% while maintaining data integrity"
    ]
  }
];

const projects: ProjectItem[] = [
  {
    name: "Lyra - AI-Powered Dating App",
    period: "August 2025 - May 2026",
    description: "Capstone Final Year Project",
    tech: ["FastAPI", "PostgreSQL", "React", "Python", "TypeScript", "Expo"],
    highlights: [
      "Built a scalable, full-stack matchmaking platform using FastAPI, PostgreSQL, React, Python, TypeScript, and Expo",
      "Architected modular REST APIs for onboarding, personalized recommendations, and real-time messaging",
      "Developed an AI-based ranking algorithm using weighted preference scoring and implemented secure authentication, protected routes, and backend request validation"
    ]
  },
  {
    name: "Grocery Price Tracking Application",
    period: "January 2025 - May 2026",
    description: "Database Management Project",
    tech: ["PostgreSQL", "Node.js", "React"],
    highlights: [
      "Developed a full-stack price monitoring system using PostgreSQL, Node.js, and React, enabling basket tracking and store comparison",
      "Implemented query-optimized schema design for anomaly detection through efficient aggregations",
      "Designed watchlists and alert workflows with performance-focused queries to support low-latency data retrieval"
    ]
  }
];

const certifications: CertificationItem[] = [
  {
    name: "Vertex Pipelines: Qwik Start",
    issuer: "Google Cloud - Verified",
    url: "https://coursera.org/share/5a994ca1be192c787bc488cc9c37eade",
    description: "Built modular ML pipelines using Kubeflow Pipelines on Vertex AI with automated training, evaluation, and conditional deployment."
  },
  {
    name: "Introduction to Docker",
    issuer: "Google Cloud - Verified",
    url: "https://coursera.org/share/756528e70c349650df8df12d756e23d6",
    description: "Built and deployed containerized applications using Docker. Managed images, registries, and container lifecycle workflows for reproducible deployments."
  }
];

// Parallax Card component - subtle and safe
const ParallaxCard: React.FC<{ children: React.ReactNode; offset?: number }> = ({ children, offset = 0 }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 1.1", "start 0.2"] });
  
  const y = useTransform(scrollYProgress, [0, 1], [offset * 0.3, offset * -0.3]);
  
  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
};

// Skill tag with staggered animation
const SkillTag: React.FC<{ skill: string; index: number }> = ({ skill, index }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 1", "start 0.5"] });
  
  const scale = useTransform(scrollYProgress, [0, 0.7], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  
  return (
    <motion.span
      ref={ref}
      style={{ scale, opacity }}
      className="text-xs px-2.5 py-1 bg-zinc-800/40 rounded text-zinc-300"
    >
      {skill}
    </motion.span>
  );
};

export default function ResumePage() {
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation />

      <main className="max-w-7xl px-6 py-20 mx-auto space-y-16">
        {/* Header with parallax */}
        <ScrollReveal>
          <header className="pt-8 space-y-4">
            <div className="flex items-start gap-8 flex-col-reverse lg:flex-row">
              <div className="flex-1">
                <motion.h1 
                  className="text-4xl font-bold text-zinc-100"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                >
                  Kushagra Pandey
                </motion.h1>
                <motion.p 
                  className="text-zinc-400 text-sm max-w-2xl mt-2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
                >
                  Full-stack engineer and technical founder with experience building AI-driven applications from frontend interface to scalable backend architecture. Passionate about modular system design, performance-aware engineering, and building products that are both technically sound and user-centered.
                </motion.p>
              </div>
              <motion.img
                src="/me.jpg"
                alt="Kushagra Pandey"
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-xl object-cover flex-shrink-0 border border-zinc-700/50 shadow-lg shadow-zinc-900/50"
                initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                whileHover={{ scale: 1.05, rotate: 2 }}
              />
            </div>

            <motion.div 
              className="flex items-center gap-6 text-sm pt-4 flex-wrap"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link 
                href="https://www.linkedin.com/in/kushagrapandeyy/" 
                target="_blank"
                className="text-zinc-400 hover:text-white transition-colors duration-200"
              >
                LinkedIn
              </Link>
              <a 
                href="mailto:kushagrapandeyy@gmail.com"
                className="text-zinc-400 hover:text-white transition-colors duration-200"
              >
                Email
              </a>
              <span className="text-zinc-500">
                Tempe, AZ
              </span>
            </motion.div>
          </header>
        </ScrollReveal>

        <motion.div 
          className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        />

        {/* Education & Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-max lg:auto-rows-fr">
          <ScrollReveal>
            <ParallaxCard>
              <InteractiveCard>
                <div className="relative p-6 md:p-8">
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                    Education
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-100 mb-3">
                    Arizona State University
                  </h2>
                  <p className="text-sm text-zinc-300 mb-4">
                    Bachelor of Science in Computer Science
                  </p>
                  <div className="space-y-2 text-sm text-zinc-400">
                    <p>Minor in Film and Media Production</p>
                    <p>August 2022 - May 2026</p>
                    <p className="pt-2 text-zinc-300">✓ Dean's List Academic Achievement Award</p>
                  </div>
                </div>
              </InteractiveCard>
            </ParallaxCard>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <ParallaxCard offset={20}>
              <InteractiveCard>
                <div className="relative p-6 md:p-8">
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                    Core Stack
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-zinc-300 mb-2">Frontend</p>
                      <div className="flex flex-wrap gap-2">
                        {["React", "TypeScript", "Tailwind CSS"].map((skill, i) => (
                          <SkillTag key={skill} skill={skill} index={i} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-300 mb-2">Backend</p>
                      <div className="flex flex-wrap gap-2">
                        {["Node.js", "FastAPI", "Spring Boot"].map((skill, i) => (
                          <SkillTag key={skill} skill={skill} index={i + 3} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-300 mb-2">Cloud & Infrastructure</p>
                      <div className="flex flex-wrap gap-2">
                        {["AWS Lambda", "DynamoDB", "PostgreSQL"].map((skill, i) => (
                          <SkillTag key={skill} skill={skill} index={i + 6} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </InteractiveCard>
            </ParallaxCard>
          </ScrollReveal>
        </div>

        {/* Featured Experience */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          <ParallaxCard offset={-12}>
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-zinc-100">Work Experience</h2>
              </div>
              <InteractiveCard>
                <div className="relative p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Featured</div>
                    <h2 className="text-3xl font-bold text-zinc-100 mb-2">
                      Firmlytic Solutions
                    </h2>
                    <p className="text-sm text-zinc-400 mb-1">Founder</p>
                    <p className="text-xs text-zinc-500 mb-4">January 2024 - Present • New Delhi, India</p>
                    
                    <ul className="space-y-3">
                      {experiences[0].highlights.map((h, i) => (
                        <motion.li
                          key={i}
                          className="text-xs text-zinc-400 leading-relaxed"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: false, margin: "-100px" }}
                          transition={{ delay: i * 0.08, duration: 0.4 }}
                        >
                          • {h}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-3">Tech Stack</div>
                    <div className="space-y-2">
                      {experiences[0].tags.map((tag, i) => (
                        <motion.div 
                          key={tag} 
                          className="text-xs px-3 py-2 bg-zinc-800/40 rounded border border-zinc-700/50 text-zinc-300"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: false, margin: "-100px" }}
                          transition={{ delay: i * 0.08, duration: 0.4 }}
                        >
                          {tag}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </InteractiveCard>
            </div>
          </ParallaxCard>
        </motion.div>

        {/* Other Experience */}
        <ScrollReveal>
          <div>
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Other Roles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiences.slice(1).map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.33, 1, 0.68, 1] }}
                  className="h-full"
                >
                  <ParallaxCard offset={idx * 8}>
                    <InteractiveCard>
                      <button
                        onClick={() => setExpandedRole(expandedRole === idx ? null : idx)}
                        className="w-full text-left relative p-6 focus:outline-none group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-zinc-100 text-sm mb-1 group-hover:text-white transition-colors">
                              {exp.title}
                            </h3>
                            <p className="text-xs text-zinc-400 mb-2">
                              {exp.company}
                            </p>
                            <p className="text-xs text-zinc-500 mb-3">
                              {exp.period} • {exp.location}
                            </p>
                            
                            {expandedRole !== idx && (
                              <ul className="space-y-1">
                                {exp.highlights.slice(0, 1).map((h, i) => (
                                  <li key={i} className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                                    • {h}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <motion.div
                            animate={{ rotate: expandedRole === idx ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0 mt-1"
                          >
                            <ChevronDown size={16} className="text-zinc-600 group-hover:text-zinc-500" />
                          </motion.div>
                        </div>

                        {expandedRole === idx && (
                          <div className="border-t border-zinc-700/30 pt-4 mt-4">
                            <ul className="space-y-2 mb-4">
                              {exp.highlights.map((h, i) => (
                                <li
                                  key={i}
                                  className="text-xs text-zinc-400 leading-relaxed"
                                >
                                  • {h}
                                </li>
                              ))}
                            </ul>

                            <div className="flex flex-wrap gap-1.5">
                              {exp.tags.map((tag) => (
                                <span 
                                  key={tag}
                                  className="text-xs px-2 py-1 rounded bg-zinc-800/50 border border-zinc-700/50 text-zinc-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </button>
                    </InteractiveCard>
                  </ParallaxCard>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Projects */}
        <ScrollReveal>
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-100">Key Projects</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Featured Project */}
              <ScrollReveal>
                <ParallaxCard offset={-10}>
                  <Link href="/projects/capstone">
                    <InteractiveCard>
                      <div className="relative p-6 md:p-8 cursor-pointer">
                        <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Featured Project</div>
                        <h2 className="text-2xl font-bold text-zinc-100 mb-3">
                          {projects[0].name}
                        </h2>
                        <p className="text-sm text-zinc-400 mb-1">{projects[0].description}</p>
                        <p className="text-xs text-zinc-500 mb-4">{projects[0].period}</p>
                        
                        <ul className="space-y-2 mb-6">
                          {projects[0].highlights.map((h, i) => (
                            <motion.li 
                              key={i} 
                              className="text-sm text-zinc-400"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.08 }}
                            >
                              • {h}
                            </motion.li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap gap-2">
                          {projects[0].tech.map((tech, i) => (
                            <motion.span 
                              key={tech} 
                              className="text-xs px-2.5 py-1 rounded bg-zinc-800/50 border border-zinc-700/50 text-zinc-300"
                              initial={{ opacity: 0, y: 5 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.05 }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </InteractiveCard>
                  </Link>
                </ParallaxCard>
              </ScrollReveal>

              {/* Other Project */}
              <ScrollReveal delay={0.1}>
                <ParallaxCard offset={10}>
                  <Link href="/projects/priceTracker">
                    <InteractiveCard>
                      <div className="relative p-6 md:p-8 cursor-pointer">
                        <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Project</div>
                        <h2 className="text-2xl font-bold text-zinc-100 mb-3">
                          {projects[1].name}
                        </h2>
                        <p className="text-sm text-zinc-400 mb-1">{projects[1].description}</p>
                        <p className="text-xs text-zinc-500 mb-4">{projects[1].period}</p>
                        
                        <ul className="space-y-2 mb-6">
                          {projects[1].highlights.map((h, i) => (
                            <motion.li 
                              key={i} 
                              className="text-sm text-zinc-400"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.08 }}
                            >
                              • {h}
                            </motion.li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap gap-2">
                          {projects[1].tech.map((tech, i) => (
                            <motion.span 
                              key={tech} 
                              className="text-xs px-2.5 py-1 rounded bg-zinc-800/50 border border-zinc-700/50 text-zinc-300"
                              initial={{ opacity: 0, y: 5 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.05 }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </InteractiveCard>
                  </Link>
                </ParallaxCard>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>

        {/* All Skills */}
        <ScrollReveal>
          <ParallaxCard offset={15}>
            <InteractiveCard>
              <div className="relative p-6 md:p-8">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-6">
                  Complete Technical Skills
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <p className="text-sm font-medium text-zinc-300 mb-3">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {["Java", "Python", "C++", "JavaScript", "TypeScript", "Swift"].map((skill, i) => (
                        <SkillTag key={skill} skill={skill} index={i} />
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <p className="text-sm font-medium text-zinc-300 mb-3">Cloud & DevOps</p>
                    <div className="flex flex-wrap gap-2">
                      {["AWS", "Google Cloud", "Docker", "Kubernetes", "Cloudflare"].map((skill, i) => (
                        <SkillTag key={skill} skill={skill} index={i + 6} />
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <p className="text-sm font-medium text-zinc-300 mb-3">Databases</p>
                    <div className="flex flex-wrap gap-2">
                      {["PostgreSQL", "MongoDB", "Redis", "MySQL"].map((skill, i) => (
                        <SkillTag key={skill} skill={skill} index={i + 12} />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </InteractiveCard>
          </ParallaxCard>
        </ScrollReveal>

        {/* Certifications */}
        <ScrollReveal>
          <ParallaxCard offset={-8}>
            <InteractiveCard>
              <div className="relative p-6 md:p-8">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-6">
                  Certifications
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {certifications.map((cert, idx) => (
                    <motion.div
                      key={cert.name}
                      initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      viewport={{ once: false }}
                      transition={{ delay: idx * 0.12, duration: 0.5 }}
                    >
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <h3 className="font-semibold text-zinc-100 group-hover:text-white transition-colors flex items-center gap-2 text-sm mb-1">
                          {cert.name}
                          <ExternalLink size={14} className="text-zinc-500 group-hover:text-zinc-400" />
                        </h3>
                        <p className="text-xs text-zinc-400 mb-2">{cert.issuer}</p>
                        <p className="text-sm text-zinc-400">{cert.description}</p>
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            </InteractiveCard>
          </ParallaxCard>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal>
          <div className="pt-8 text-center">
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.08, letterSpacing: "0.05em" }}
              whileTap={{ scale: 0.95 }}
              className="text-zinc-400 hover:text-white transition-colors text-sm inline-block"
            >
              Get in touch
            </motion.a>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
