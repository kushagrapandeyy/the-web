"use client";
import { Github, Mail, Linkedin } from "lucide-react";
import Link from "next/link";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";

const socials = [
  {
    icon: <Mail size={22} />,
    href: "mailto:kushagrapandeyy@gmail.com",
    label: "Email",
    handle: "kushagrapandeyy@gmail.com",
  },
  {
    icon: <Linkedin size={22} />,
    href: "https://www.linkedin.com/in/kushagrapandeyy/",
    label: "LinkedIn",
    handle: "kushagrapandeyy",
  },
  {
    icon: <Github size={20} />,
    href: "https://github.com/kushagrapandeyy",
    label: "GitHub",
    handle: "kushagrapandeyy",
  },
];

export default function Example() {
  return (
    <div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <Navigation />
      <div className="container mx-auto min-h-screen px-4 flex items-center justify-center">
        <div
          className="
            mx-auto mt-32 sm:mt-0 w-full
            grid gap-8 lg:gap-12
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
          "
        >
          {socials.map((s) => (
            <Card key={s.label}>
              <Link
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="
                  relative w-full overflow-hidden
                  flex flex-col items-center gap-4 md:gap-8
                  p-4 md:p-16 md:py-24 lg:pb-48
                  duration-700 group
                "
              >
                {/* keeps the vertical accent line inside the box */}
                <span
                  className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
                  aria-hidden="true"
                />
                <span
                  className="
                    relative z-10 flex items-center justify-center
                    w-12 h-12 rounded-full border
                    text-zinc-200 group-hover:text-white
                    bg-zinc-900 group-hover:bg-zinc-900
                    border-zinc-500 group-hover:border-zinc-200
                    duration-1000 drop-shadow-orange
                  "
                >
                  {s.icon}
                </span>

                <div className="z-10 flex flex-col items-center text-center w-full min-w-0 max-w-full">
                  <span
                    className="
                      font-display font-medium text-zinc-200
                      group-hover:text-white duration-150
                      lg:text-xl xl:text-3xl
                      w-full max-w-full break-words
                    "
                  >
                    {s.handle}
                  </span>
                  <span
                    className="
                      mt-4 text-sm text-zinc-400
                      group-hover:text-zinc-200 duration-1000
                      w-full max-w-full break-words
                    "
                  >
                    {s.label}
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
