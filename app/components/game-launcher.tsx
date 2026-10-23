"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const Chronos = dynamic(() => import("./chronos-game"), { ssr: false, loading: () => <p role="status" className="text-sm text-secondary">Loading Chronos…</p> });

export function GameLauncher() {
  const [open, setOpen] = useState(false);
  return <><button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className="button-primary group">Play Chronos <ArrowUpRight size={18} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></button>{open && <Chronos onClose={() => setOpen(false)} />}</>;
}
