"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => { setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark"); }, []);
  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try { localStorage.setItem("portfolio-theme", next); } catch { /* Theme switching still works when storage is blocked. */ }
  }
  return <button type="button" onClick={toggle} aria-label={label} title={label} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-paper transition-colors hover:bg-raised focus-visible:bg-raised">{theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}</button>;
}
