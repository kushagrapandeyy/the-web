"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Calendar, Award, Code, Globe, Github } from "lucide-react";

interface SidebarProps {
	tags?: string[];
	role?: string;
	date?: string;
	status?: string;
	url?: string;
	repository?: string;
}

export const ProjectSidebar: React.FC<SidebarProps> = ({
	tags = [],
	role,
	date,
	status,
	url,
	repository,
}) => {
	const formatDate = (dateString?: string) => {
		if (!dateString) return "";
		try {
			return new Intl.DateTimeFormat("en-US", {
				month: "long",
				year: "numeric",
			}).format(new Date(dateString));
		} catch (e) {
			return dateString;
		}
	};

	const displayStatus = status || "Completed";

	return (
		<aside className="lg:col-span-1 pt-12">
			<div className="sticky top-28 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden group hover:border-teal-500/20 transition-all duration-500">
				{/* Background ambient glow inside the sidebar */}
				<div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-teal-500/5 blur-3xl pointer-events-none group-hover:bg-teal-500/10 transition-all duration-500" />
				
				<h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-6 font-mono border-b border-zinc-800 pb-2">
					Project details
				</h3>

				<div className="space-y-4 mb-8">
					{role && (
						<div className="flex items-start gap-3">
							<div className="p-2 rounded-lg bg-zinc-850 border border-zinc-800 text-zinc-400">
								<User className="w-4 h-4" />
							</div>
							<div>
								<p className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono leading-none">Role</p>
								<p className="text-sm font-medium text-zinc-200 mt-1">{role}</p>
							</div>
						</div>
					)}

					{date && (
						<div className="flex items-start gap-3">
							<div className="p-2 rounded-lg bg-zinc-850 border border-zinc-800 text-zinc-400">
								<Calendar className="w-4 h-4" />
							</div>
							<div>
								<p className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono leading-none">Timeline</p>
								<p className="text-sm font-medium text-zinc-200 mt-1">{formatDate(date)}</p>
							</div>
						</div>
					)}

					<div className="flex items-start gap-3">
						<div className="p-2 rounded-lg bg-zinc-850 border border-zinc-800 text-zinc-400">
							<Award className="w-4 h-4" />
						</div>
						<div>
							<p className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono leading-none">Status</p>
							<div className="flex items-center gap-2 mt-1">
								<span className="relative flex h-2 w-2">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
									<span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
								</span>
								<p className="text-sm font-medium text-zinc-200 capitalize">{displayStatus}</p>
							</div>
						</div>
					</div>
				</div>

				{tags.length > 0 && (
					<div>
						<h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4 font-mono flex items-center gap-2">
							<Code className="w-3.5 h-3.5 text-teal-500" />
							Core Stack
						</h4>
						<div className="flex flex-wrap gap-2">
							{tags.map((tag) => (
								<motion.span
									key={tag}
									whileHover={{ y: -2, scale: 1.03 }}
									className="text-xs px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:text-white hover:border-teal-500/30 hover:bg-zinc-900/50 hover:shadow-[0_4px_12px_rgba(20,184,166,0.1)] transition-colors duration-200 cursor-default"
								>
									{tag}
								</motion.span>
							))}
						</div>
					</div>
				)}

				{(url || repository) && (
					<div className="mt-8 pt-6 border-t border-zinc-850 space-y-3">
						{url && (
							<a
								href={url}
								target="_blank"
								rel="noreferrer"
								className="flex items-center justify-between text-xs text-zinc-400 hover:text-teal-400 group/link transition-colors duration-200"
							>
								<span className="flex items-center gap-2">
									<Globe className="w-3.5 h-3.5" />
									Visit live site
								</span>
								<span className="opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-200">&rarr;</span>
							</a>
						)}
						{repository && (
							<a
								href={`https://github.com/${repository}`}
								target="_blank"
								rel="noreferrer"
								className="flex items-center justify-between text-xs text-zinc-400 hover:text-teal-400 group/link transition-colors duration-200"
							>
								<span className="flex items-center gap-2">
									<Github className="w-3.5 h-3.5" />
									View source code
								</span>
								<span className="opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-200">&rarr;</span>
							</a>
						)}
					</div>
				)}
			</div>
		</aside>
	);
};
