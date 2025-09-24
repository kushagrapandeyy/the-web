"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Particles from "./components/particles";

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
  { name: "Resume", href: "/resume" },
];

export default function Home() {
  const [locked, setLocked] = useState(true);
  const [navAtTop, setNavAtTop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter state
  const [displayed, setDisplayed] = useState("");
  const text = "Hello.";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setLocked(false);
      document.body.style.overflow = "auto";
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter
  useEffect(() => {
    let i = 0;
    let forward = true;
    let timeout: NodeJS.Timeout;

    const type = () => {
      if (forward) {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i === text.length) {
          forward = false;
          timeout = setTimeout(type, 2750); // pause when fully typed
          return;
        }
      } else {
        setDisplayed(text.slice(0, i - 1));
        i--;
        if (i === 0) forward = true;
      }
      timeout = setTimeout(type, 150);
    };

    type();
    return () => clearTimeout(timeout);
  }, []);

  // Observe when #about-section is in view
  useEffect(() => {
    const root = containerRef.current;
    const about = document.getElementById("about-section");
    if (!root || !about) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        setNavAtTop(e.isIntersecting && e.intersectionRatio >= 0.55);
      },
      { root, threshold: [0, 0.55, 1] }
    );

    io.observe(about);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
    >
      {/* Fixed top nav */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out ${
          navAtTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        } bg-black/40 backdrop-blur-md border-b border-white/10`}
      >
        <ul className="flex items-center justify-center gap-4 py-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm duration-500 text-zinc-300 hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </nav>

      {/* Hero Section */}
      <section
        id="hero-section"
        className="relative h-screen snap-start flex flex-col items-center justify-center bg-gradient-to-tl from-black via-zinc-600/20 to-black"
      >
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

          <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-750 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text">
            Kushagra Pandey
          </h1>

          {/* Arrow */}
          <div className="my-16 text-center animate-fade-in">
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pt-[15px]">
              <button
                onClick={() =>
                  document
                    .getElementById("about-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="p-2 rounded-full border border-white/40 hover:border-white transition motion-safe:animate-[bounce_2.5s_infinite]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="11"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 10l6 6 6-6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about-section"
        className="relative h-screen snap-start flex flex-col items-center justify-center px-6 
                  bg-black text-zinc-200 overflow-hidden"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900/90 to-black z-0" />

        {/* Particles above gradient */}
        <Particles
          className="absolute inset-0 z-10 animate-fade-in"
          quantity={25}
        />

        <div className="relative z-20 max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <img
              src="/me.jpg"
              alt="Kushagra Pandey"
              className="w-72 h-72 object-cover rounded-xl border-4 border-white/10 shadow-lg"
            />
          </div>
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-4xl font-bold text-white font-mono">
              {displayed}
              <span className="animate-pulse">|</span>
            </h2>
            <p className="text-zinc-300 leading-relaxed text-lg">
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
