"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

export const Navigation: React.FC = () => {
	const [scrolled, setScrolled] = useState(false);
	const pathname = usePathname();
	const isHome = pathname === "/";
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const navItems = [
		{ name: "Projects", href: "/projects" },
		{ name: "Contact", href: "/contact" },
		{ name: "Resume", href: "/resume" },
	];

	return (
		<>
			{/* Scroll progress */}
			<motion.div
				className="fixed top-0 left-0 right-0 h-[2px] z-[410] origin-left pointer-events-none"
				style={{
					scaleX,
					background: "linear-gradient(90deg, #6366f1, #a78bfa, #38bdf8)",
				}}
			/>

			<header
				className="fixed inset-x-0 top-0 z-[400] transition-all duration-500"
				style={{
					backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
					WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
					background: scrolled
						? "linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.6))"
						: "transparent",
					borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
				}}
			>
				{/* Scanning Light Beam (Teal-to-Gold Tarantula theme) */}
				<motion.div
					initial={{ x: "-100%" }}
					animate={{ x: "100%" }}
					transition={{ duration: 1.2, ease: "linear", repeat: 0 }}
					className="absolute bottom-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent z-10"
				/>

				<div className={`max-w-7xl mx-auto flex items-center px-6 py-4 transition-all duration-700 ${isHome ? "justify-center" : "justify-between"
					}`}>
					<AnimatePresence>
						{!isHome && (
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
							>
								<Link
									href="/"
									className="text-zinc-500 hover:text-white transition-colors duration-300 text-sm font-mono tracking-widest uppercase flex items-center gap-2 group"
								>
									<span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
									<span>KP</span>
								</Link>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Nav links with staggered reveal and layout animation */}
					<motion.ul
						layout
						className="flex items-center gap-8"
						transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
					>
						<AnimatePresence mode="wait">
							{navItems.map((item, i) => {
								const isActive = pathname === item.href;
								return (
									<motion.li
										key={item.href}
										layout
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.5,
											delay: isHome ? (0.2 + (i * 0.1)) : 0,
											ease: [0.16, 1, 0.3, 1]
										}}
										className="relative"
									>
										<Link
											href={item.href}
											className={`text-sm tracking-widest uppercase transition-all duration-300 ${isActive
												? "text-white font-medium"
												: "text-zinc-500 hover:text-zinc-200 font-light"
												}`}
										>
											{item.name}
										</Link>
										{isActive && (
											<motion.div
												layoutId="active-nav"
												className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-teal-500/0 via-teal-400/60 to-teal-500/0"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ duration: 0.3 }}
											/>
										)}
									</motion.li>
								);
							})}
						</AnimatePresence>
					</motion.ul>
				</div>
			</header>
		</>
	);
};
