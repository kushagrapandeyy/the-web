"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export const Navigation: React.FC = () => {
	const [scrolled, setScrolled] = useState(false);
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<>
			{/* Scroll progress */}
			<motion.div
				className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left pointer-events-none"
				style={{
					scaleX,
					background: "linear-gradient(90deg, #6366f1, #a78bfa, #38bdf8)",
				}}
			/>

			<header
				className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
				style={{
					backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
					WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
					background: scrolled
						? "linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.6))"
						: "transparent",
					borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
				}}
			>
				<div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
					{/* Back to home */}
					<Link
						href="/"
						className="text-zinc-500 hover:text-white transition-colors duration-300 text-sm font-mono tracking-widest uppercase"
					>
						← KP
					</Link>

					{/* Nav links */}
					<ul className="flex items-center gap-8">
						{[
							{ name: "Projects", href: "/projects" },
							{ name: "Contact", href: "/contact" },
							{ name: "Resume", href: "/resume" },
						].map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									className="text-sm text-zinc-500 hover:text-white transition-colors duration-300 tracking-widest uppercase font-light"
								>
									{item.name}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</header>
		</>
	);
};
