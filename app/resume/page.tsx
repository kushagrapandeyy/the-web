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
    <div className="bg-white/5 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-6 hover:scale-[1.01] transition-transform duration-300">
      <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-center">
        {title}
      </h2>
      <div className="space-y-3 text-sm">{children}</div>
    </div>
  );

  const workExperience = [
    {
      title: "Production Assistant",
      company: "Enterprise Brand and Strategy Management, ASU",
      date: "Oct 2024 – Present",
      location: "Tempe, AZ",
      bullets: [
        "Produced visuals aligning with ASU’s brand, enhancing its digital presence.",
        "Directed pre-production, logistics, and post-production—boosting efficiency by 25%.",
        "Integrated automation tools and live-streaming systems—improving workflows by 30%."
      ]
    },
    {
      title: "Co-Founder",
      company: "Firmlytic Solutions Pvt. Ltd.",
      date: "Jan 2024 – Present",
      location: "New Delhi, India",
      bullets: [
        "Architected and scaled an AI-driven legal platform to 500+ DAU with 99.9% uptime.",
        "Automated workflows via AWS Lambda, cutting manual effort by 40% and latency to <200ms.",
        "Enhanced security using Cloudflare WAF and IAM—reducing incident exposure by 35%."
      ]
    },
    {
      title: "IT Intern",
      company: "SS Pandey & Associates",
      date: "Aug 2023 – Jan 2024",
      location: "New Delhi, India",
      bullets: [
        "Built Spring Boot microservice for document management—retrieval speed +45%.",
        "Led digital transformation—boosted digital presence by 20% and optimized web/data pipelines."
      ]
    },
    {
      title: "Software Intern",
      company: "CyberSophy",
      date: "Jun 2023 – Aug 2023",
      location: "Hyderabad, India",
      bullets: [
        "Developed Python-based scraping framework—collected 10k+ LinkedIn profiles daily at 95% accuracy.",
        "Automated pipelines with multithreading/proxy rotation—reduced collection time by 60%.",
        "Built MongoDB storage with real-time filtering—streamlined analysis workflows."
      ]
    }
  ];

  const leadership = [
    {
      title: "Director",
      company: "F2.8 Films",
      date: "Aug 2024 – Present",
      location: "Delhi, India",
      text: "Directed a 35-member team for an IMDb-featured film, overseeing end-to-end production."
    },
    {
      title: "Director of Media & Productions",
      company: "VentureVerse",
      date: "Aug 2024 – May 2025",
      location: "Tempe, AZ",
      text: "Designed and executed a content strategy that increased event attendance by 50%."
    },
    {
      title: "Member",
      company: "Software Developers Association",
      date: "Aug 2022 – Present",
      location: "Tempe, AZ",
      text: "Engaged in hackathons, networking with Google & Microsoft engineers, and technical workshops."
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-zinc-200">
      <Navigation />

      {/* custom blurred pointer */}
      <div
        ref={cursorRef}
        className="cursor-ball fixed top-0 left-0 w-32 h-32 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"
      />

      <main className="max-w-5xl px-6 py-16 mx-auto space-y-16">
        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Kushagra Pandey
          </h1>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
            <Link href="https://www.linkedin.com/in/kushagrapandeyy/" target="_blank" className="flex items-center gap-1 hover:text-blue-400">
              <Linkedin size={16} /> LinkedIn
            </Link>
            <a href="mailto:kushagrapandey2004@gmail.com" className="flex items-center gap-1 hover:text-blue-400">
              <Mail size={16} /> kushagrapandey2004@gmail.com
            </a>
            <a href="tel:6232816677" className="flex items-center gap-1 hover:text-blue-400">
              <Phone size={16} /> (623) 281-6677
            </a>
            <span className="flex items-center gap-1">
              <MapPin size={16} /> Tempe, Arizona
            </span>
          </div>
        </header>

        {/* Education */}
        <SectionCard title="Education">
          <p className="font-medium">
            Arizona State University — B.S. Computer Science; Minor in Film & Media Production{" "}
            <span className="text-zinc-400">• May 2026</span>
          </p>
          <p>GPA 3.00 (Cumulative) • Dean’s List Academic Achievement Award</p>
          <p>
            <span className="font-semibold">Relevant Coursework:</span> Data Structures & Algorithms, Digital Design, Database Management, Data Visualization, OOP, Software Engineering, Theoretical CS, Assembly, Information Assurance.
          </p>
        </SectionCard>

        {/* Technical Skills */}
        <SectionCard title="Technical Skills">
          <p>
            <strong>Languages & Frameworks:</strong> Java, C++, Python, JavaScript, TypeScript, PHP, Swift, Kotlin, React, Angular, Node, Express, JavaFX, HTML5, CSS3
          </p>
          <p>
            <strong>Cloud & DevOps:</strong> AWS (EC2, S3, DynamoDB, Lambda), Docker, Kubernetes, Jenkins, Cloudflare, CI/CD pipelines
          </p>
          <p>
            <strong>Databases & Data:</strong> PostgreSQL, MySQL, MongoDB, Redis, D3.js
          </p>
        </SectionCard>

        {/* Work Experience */}
        <SectionCard title="Work Experience">
          {workExperience.map((item, idx) => (
            <div key={idx} className="pb-3 border-b border-white/10 last:border-none">
              <p className="font-semibold">{item.title} — {item.company}</p>
              <p className="text-xs text-zinc-400">{item.date} • {item.location}</p>
              <ul className="list-disc list-inside text-zinc-300 mt-1 space-y-1">
                {item.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          ))}
        </SectionCard>

        {/* Leadership Experience */}
        <SectionCard title="Leadership Experience">
          {leadership.map((item, idx) => (
            <div key={idx} className="pb-3 border-b border-white/10 last:border-none">
              <p className="font-semibold">{item.title} — {item.company}</p>
              <p className="text-xs text-zinc-400">{item.date} • {item.location}</p>
              <p>{item.text}</p>
            </div>
          ))}
        </SectionCard>
      </main>
    </div>
  );
}
