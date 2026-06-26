"use client";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

type Props = {
	project: {
		url?: string;
		title: string;
		description: string;
		repository?: string;
		category?: string;
	};

	views: number;
};

export const Header: React.FC<Props> = ({ project, views }) => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);

	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	const links: { label: string; href: string }[] = [];
	if (project.repository) {
		links.push({
			label: "GitHub",
			href: `https://github.com/${project.repository}`,
		});
	}
	if (project.url) {
		links.push({
			label: "Website",
			href: project.url,
		});
	}
	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<header
			ref={ref}
			className="relative isolate overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950 border-b border-zinc-900"
		>
			{/* Scroll Progress Bar */}
			<motion.div
				className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-500 origin-left z-[100]"
				style={{ scaleX }}
			/>

			<div
				className={`fixed inset-x-0 top-0 z-50 backdrop-blur duration-200 border-b ${
					isIntersecting
						? "bg-zinc-950/0 border-transparent"
						: "bg-zinc-950/80 border-zinc-900/80"
				}`}
			>
				<div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
					<div className="flex justify-between gap-8">
						<span
							title="View counter for this page"
							className={`duration-200 hover:font-medium flex items-center gap-1.5 ${
								isIntersecting
									? "text-zinc-400 hover:text-zinc-100"
									: "text-zinc-300 hover:text-teal-400"
							} `}
						>
							<Eye className="w-5 h-5" />{" "}
							{Intl.NumberFormat("en-US", { notation: "compact" }).format(
								views,
							)}
						</span>
					</div>

					<Link
						href={project.category === "design" ? "/design" : "/projects"}
						className={`duration-200 hover:font-medium ${
							isIntersecting
								? "text-zinc-400 hover:text-zinc-100"
								: "text-zinc-300 hover:text-teal-400"
						} `}
					>
						<ArrowLeft className="w-6 h-6 " />
					</Link>
				</div>
			</div>

			<div className="container mx-auto relative isolate overflow-hidden py-28 sm:py-36">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
					<div className="mx-auto max-w-2xl lg:mx-0">
						<h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-display leading-tight">
							{project.title}
						</h1>
						<p className="mt-6 text-lg leading-8 text-zinc-350 max-w-xl mx-auto">
							{project.description}
						</p>
					</div>

					{links.length > 0 && (
						<div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
							<div className="flex flex-wrap items-center justify-center gap-4">
								{links.map((link) => (
									<Link 
										target="_blank" 
										key={link.label} 
										href={link.href}
										className="px-5 py-2 text-sm font-medium rounded-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-white hover:border-teal-500/40 hover:bg-zinc-900 transition-all duration-300 flex items-center gap-1.5 shadow-lg shadow-black/40"
									>
										{link.label} <span aria-hidden="true">&rarr;</span>
									</Link>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};
