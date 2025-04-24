// src/pages/resume.tsx
"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Mail, Linkedin, Phone, MapPin } from "lucide-react";
import { Navigation } from "../components/nav";

export default function ResumePage() {
  const cursorRef = useRef<HTMLDivElement>(null);

  // Move our custom blurred pointer
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    document.addEventListener("mousemove", move);
    return () => document.removeEventListener("mousemove", move);
  }, []);

  const workExperience = [
    {
      title: "Production Assistant",
      company: "Enterprise Brand and Strategy Management, ASU",
      date: "Oct 2024 – Present",
      location: "Tempe, AZ",
      bullets: [
        "Created high-quality videography and photography aligning with ASU’s brand identity.",
        "Led pre-production, logistics, and post-production—boosting efficiency by 25%.",
        "Integrated automation tools and live-streaming systems to enhance workflow by 30%."
      ]
    },
    {
      title: "Director of Technical Services",
      company: "Unnamed LLP",
      date: "Jan 2024 – Present",
      location: "New Delhi, India",
      bullets: [
        "Built and managed full-stack web app with end-to-end testing, using AWS S3, DynamoDB, EC2.",
        "Led mobile app (Swift/Kotlin) and UI/UX design—reducing user friction by 35%.",
        "Developed analytics dashboards to improve operational efficiency by 25% and cut resolution time by 15%.",
        "Optimized performance/security with Cloudflare—reducing load times by 40%."
      ]
    },
    {
      title: "IT Intern",
      company: "SS Pandey & Associates",
      date: "Aug 2023 – Jan 2024",
      location: "New Delhi, India",
      bullets: [
        "Implemented document-management system—boosting productivity by 35% and cutting retrieval times by 45%.",
        "Drove digital transformation, increasing online presence by 20% and optimizing web/data processes."
      ]
    },
    {
      title: "Software Intern",
      company: "CyberSophy",
      date: "Jun 2023 – Aug 2023",
      location: "Hyderabad, India",
      bullets: [
        "Built Python-based cybersecurity tool—improving efficiency by 40% (APIs, JSON, Pandas).",
        "Designed UI with HTML, CSS, JS, and Beautiful Soup to enhance user interaction."
      ]
    }
  ];

  const leadership = [
    {
      title: "Director",
      company: "F2.8 Films",
      date: "Aug 2024 – Present",
      location: "Delhi, India",
      text: "Directing IMDb-featured film productions and spearheading new industry-leading projects."
    },
    {
      title: "Director of Media & Productions",
      company: "VentureVerse",
      date: "Aug 2024 – Present",
      location: "Tempe, AZ",
      text: "Leading content strategy to engage and empower the next generation of ASU innovators."
    },
    {
      title: "Member",
      company: "Software Developers Association",
      date: "Aug 2022 – Present",
      location: "Tempe, AZ",
      text: "Participated in technical workshops and networking events with engineers from Google and Microsoft."
    }
  ];

  return (
    <div className="relative pb-12 bg-zinc-900 text-zinc-200 min-h-screen overflow-hidden">
      <Navigation />

      {/* custom blurred pointer */}
      <div ref={cursorRef} className="cursor-ball" />

      <div className="max-w-4xl px-4 py-12 mx-auto lg:px-6 space-y-10">
        {/* Header */}
        <header className="space-y-3 text-center">
          <h1 className="text-4xl font-bold text-white">Kushagra Pandey</h1>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
            <Link href="https://www.linkedin.com/in/kushagrapandeyy/" target="_blank" className="flex items-center gap-1">
              <Linkedin size={16} /> LinkedIn
            </Link>
            <a href="mailto:kushagrapandey2004@gmail.com" className="flex items-center gap-1">
              <Mail size={16} /> kushagrapandey2004@gmail.com
            </a>
            <a href="tel:6232816677" className="flex items-center gap-1">
              <Phone size={16} /> (623) 281-6677
            </a>
            <span className="flex items-center gap-1">
              <MapPin size={16} /> Tempe, Arizona
            </span>
          </div>
        </header>

        {/* Education */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Education</h2>
          <div className="border border-white p-4 text-left space-y-2 text-sm leading-relaxed">
            <p className="font-medium">
              Arizona State University, Ira A. Fulton Schools of Engineering — B.S. Computer Science; Minor in Film & Media Production{" "}
              <span className="text-zinc-400">• May 2026</span>
            </p>
            <p>GPA 3.52 / 4.0 • Dean’s List Academic Achievement Award</p>
            <p>
              Relevant Coursework: Data Structures & Algorithms; Digital Design Fundamentals; Database Management; Foundations of Data Visualization; OOP; Software Engineering; Theoretical CS; Assembly Programming; Information Assurance
            </p>
          </div>
        </section>

        {/* Technical Skills */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Technical Skills</h2>
          <div className="border border-white p-4 text-left space-y-2 text-sm leading-relaxed">
            <p>
              <strong>Programming:</strong> Java, JavaScript, HTML, CSS, Bash, Scheme, C, C++, Python, MySQL, PostgreSQL, MIPS Assembly, PHP, JavaFX, AngularJS, ReactJS, TypeScript, Swift, Kotlin, Cloud Computing, Docker, Kubernetes
            </p>
            <p>
              <strong>Methodologies &amp; Tools:</strong> Figma, Git/GitHub, VS Code, Microsoft Office, Data Modeling, Agile, DevSecOps
            </p>
          </div>
        </section>

        {/* Work Experience */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-center">Work Experience</h2>
          {workExperience.map((item, idx) => (
            <div key={idx} className="border border-white p-4 text-left space-y-1 text-sm leading-relaxed">
              <p className="font-medium">{item.title} — {item.company}</p>
              <p className="text-zinc-400 text-xs">{item.date} • {item.location}</p>
              {item.bullets.map((b, i) => <p key={i}>{b}</p>)}
            </div>
          ))}
        </section>

        {/* Leadership Experience */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-center">Leadership Experience</h2>
          {leadership.map((item, idx) => (
            <div key={idx} className="border border-white p-4 text-left space-y-1 text-sm leading-relaxed">
              <p className="font-medium">{item.title} — {item.company}</p>
              <p className="text-zinc-400 text-xs">{item.date} • {item.location}</p>
              <p>{item.text}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
