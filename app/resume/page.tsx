// src/pages/resume.tsx
"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Mail, Linkedin, Phone, MapPin } from "lucide-react";
import { Navigation } from "../components/nav";

export default function ResumePage() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    document.addEventListener("mousemove", move);
    return () => document.removeEventListener("mousemove", move);
  }, []);

  const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="relative group rounded-xl border border-transparent bg-white/5 p-[1px] transition-transform duration-300 hover:scale-[1.01]">
      <div className="relative rounded-xl bg-zinc-900 p-6 overflow-hidden">
        {/* Spotlight effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent blur-2xl" />
        </div>

        <h2 className="text-2xl font-semibold text-center text-zinc-100">
          {title}
        </h2>
        <div className="space-y-3 text-sm mt-4">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-zinc-200">
      <Navigation />

      {/* custom blurred pointer */}
      <div ref={cursorRef} className="cursor-ball fixed top-0 left-0 w-36 h-36 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

      <main className="max-w-5xl px-6 py-16 mx-auto space-y-16">
        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="relative text-5xl font-extrabold text-white py-2 group">
            Kushagra Pandey
            <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 group-hover:opacity-100 blur-2xl transition duration-500"></span>
          </h1>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
            <Link href="https://www.linkedin.com/in/kushagrapandeyy/" target="_blank" className="flex items-center gap-1 hover:text-blue-400">
              <Linkedin size={16} /> LinkedIn
            </Link>
            <a href="mailto:kushagrapandey2004@gmail.com" className="flex items-center gap-1 hover:text-blue-400">
              <Mail size={16} /> kushagrapandey2004@gmail.com
            </a>
{/*
            <a href="tel:6232816677" className="flex items-center gap-1 hover:text-blue-400">
              <Phone size={16} /> (623) 281-6677
            </a>
*/}
            <span className="flex items-center gap-1">
              <MapPin size={16} /> Tempe, Arizona
            </span>
          </div>
        </header>

        {/* Education */}
        <SectionCard title="Education">
          <p className="font-medium">
            ARIZONA STATE UNIVERSITY, Ira A. Fulton Schools of Engineering — Bachelor of Science, Computer Science; Minor in Film and Media Production
            <span className="text-zinc-400"> • August 2022 - May 2026 • Tempe, Arizona</span>
          </p>
          <p>GPA 3.00 (Cumulative)</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Dean's List Academic Achievement Award.</li>
            <li>Relevant Coursework: Data Structures and Algorithms, Digital Design Fundamentals, Database Management, Foundations of Data Visualization, Object-Oriented Programming, Intro to Software Engineering, Intro to Theoretical Computer Science, Computer Language/Assembly Language Programming, Computer Security/Information Assurance, Embedded Microprocessor Systems, Understanding Innovation in Corporate Technology.</li>
          </ul>
        </SectionCard>

        {/* Technical Skills */}
        <SectionCard title="Technical Skills">
          <p><strong>Languages & Frameworks:</strong> Java, C++, Python, JavaScript, TypeScript, PHP, Swift, Kotlin, React.js, AngularJS, Node.js, Express.js, JavaFX, HTML5, CSS3</p>
          <p><strong>Cloud & DevOps:</strong> AWS (EC2, S3, DynamoDB, Lambda), Docker, Kubernetes, Jenkins, Cloudflare, CI/CD pipelines</p>
          <p><strong>Databases & Data:</strong> PostgreSQL, MySQL, MongoDB, Redis, Data Visualization (D3.js)</p>
        </SectionCard>

        {/* Work Experience */}
        <SectionCard title="Work Experience">
          <div className="pb-3 border-b border-white/10 last:border-none">
            <p className="font-semibold">Firmlytic Solutions Private Limited — Co-Founder</p>
            <p className="text-xs text-zinc-400">January 2024 – Present • New Delhi, India</p>
            <ul className="list-disc list-inside text-zinc-300 mt-1 space-y-1">
              <li>Architected and scaled an AI-driven legal platform (React, Node.js, AWS) to 500+ DAU with 99.9% uptime.</li>
              <li>Automated document workflows via server-less REST APIs & AWS Lambda, cutting manual effort by 40% and latency to &lt;200 ms.</li>
              <li>Enhanced security measures using Cloudflare WAF and least-privilege IAM, lowering incident exposure by 35%.</li>
            </ul>
          </div>

          <div className="pb-3 border-b border-white/10 last:border-none">
            <p className="font-semibold">Enterprise Brand and Strategy Management - Arizona State University — Production Assistant</p>
            <p className="text-xs text-zinc-400">October 2024 – Present • Tempe, Arizona</p>
            <ul className="list-disc list-inside text-zinc-300 mt-1 space-y-1">
              <li>Producing visuals in alignment with ASU's brand, significantly enhancing the university's visual presence.</li>
              <li>Leading pre-production, logistics, and post-production, contributing to a 25% increase in production efficiency.</li>
              <li>Integrating tech solutions (automation tools, live-streaming systems) that enhance workflow efficiency by 30%.</li>
            </ul>
          </div>

          <div className="pb-3 border-b border-white/10 last:border-none">
            <p className="font-semibold">SS Pandey & Associates — IT Intern</p>
            <p className="text-xs text-zinc-400">August 2023 – January 2024 • New Delhi, India</p>
            <ul className="list-disc list-inside text-zinc-300 mt-1 space-y-1">
              <li>Developed a Spring Boot microservice for document management, speeding retrieval by 45%.</li>
              <li>Led critical aspects of digital transformation that resulted in a 20% increase in digital presence, optimizing key functions such as web performance and data transfer.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold">CyberSophy — Software Intern</p>
            <p className="text-xs text-zinc-400">June 2023 – August 2023 • Hyderabad, India</p>
            <ul className="list-disc list-inside text-zinc-300 mt-1 space-y-1">
              <li>Designed and implemented a Python-based web-scraping framework using BeautifulSoup, Selenium, and Requests to collect 10,000+ LinkedIn profiles daily for technical and management roles, achieving 95% data accuracy.</li>
              <li>Automated scraping pipelines with multithreading and proxy rotation, reducing profile collection time by 60%.</li>
              <li>Implemented a data storage and retrieval system in MongoDB, facilitating real-time filtering that improved efficiency.</li>
            </ul>
          </div>
        </SectionCard>

        {/* Leadership Experience */}
        <SectionCard title="Leadership Experience">
          <div className="pb-3 border-b border-white/10 last:border-none">
            <p className="font-semibold">F2.8 Films — Director</p>
            <p className="text-xs text-zinc-400">August 2024 – Present • Delhi, India</p>
            <p>Directed and coordinated a 35-member team for an IMDb-featured film, steering the project through complex challenges across pre and post-production phases.</p>
          </div>

          <div className="pb-3 border-b border-white/10 last:border-none">
            <p className="font-semibold">VentureVerse — Director of Media and Productions</p>
            <p className="text-xs text-zinc-400">August 2024 – May 2025 • Tempe, Arizona</p>
            <p>Developed content strategy, increasing event attendance by 50%.</p>
          </div>

          <div>
            <p className="font-semibold">Software Developers Association — Member</p>
            <p className="text-xs text-zinc-400">August 2022 – Present • Tempe, Arizona</p>
            <p>Collaborated with engineers from Google and Microsoft, enhancing skills in networking, project development through active participation in hackathons and technical workshops.</p>
          </div>
        </SectionCard>
      </main>
    </div>
  );
}
