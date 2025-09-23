"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Particles from "./components/particles";

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
  { name: "Resume", href: "/resume" },
];

export default function Home() {
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setLocked(false);
      document.body.style.overflow = "auto";
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="scroll-smooth">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="sticky top-0 flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
          <nav className="my-16 animate-fade-in">
            <ul className="flex items-center justify-center gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
                >
                  {item.name}
                </Link>
              ))}
            </ul>
          </nav>

          <Particles
            className="absolute inset-0 -z-10 animate-fade-in"
            quantity={30}
          />

          <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text">
            Kushagra Pandey
          </h1>

          <div className="my-16 text-center animate-fade-in">
            <h2 className="text-sm text-zinc-500">
              I am a developer based in Phoenix, AZ. Currently a Senior at Arizona State University-Tempe.
            </h2>
          </div>
        </div>
      </section>

      {/* Resume / About Section */}
      <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-tl from-black via-zinc-600/20 to-black text-zinc-200">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="flex justify-center">
            <img
              src="/me.jpg" // put your picture in public/me.jpg
              alt="Kushagra Pandey"
              className="w-72 h-72 object-cover rounded-xl border-4 border-white/10 shadow-lg"
            />
          </div>

          {/* Text */}
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-4xl font-bold text-white">About Me</h2>
            <p className="text-zinc-400 leading-relaxed text-lg">
              I'm Kushagra Pandey, a passionate developer and creative with
              experience across software engineering, film, and design. Currently
              pursuing Computer Science at Arizona State University, I specialize
              in full-stack development, cloud solutions, and building visually
              impactful experiences.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
