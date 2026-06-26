// @ts-nocheck
"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useMDXComponent } from "next-contentlayer/hooks";

function clsx(...args: any) {
	return args.filter(Boolean).join(" ");
}

const ImageLightbox = ({ src, alt, className, ...props }: any) => {
	const [isOpen, setIsOpen] = React.useState(false);

	React.useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	return (
		<>
			<div 
				className="relative group cursor-zoom-in overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60 my-8 transition-all duration-300 hover:border-teal-500/30"
				onClick={() => setIsOpen(true)}
			>
				<img
					className={clsx("rounded-xl transition-transform duration-500 group-hover:scale-[1.01] w-full h-auto", className)}
					src={src}
					alt={alt}
					{...props}
				/>
				<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
					<span className="text-xs font-mono text-white/95 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
						Click to Zoom
					</span>
				</div>
			</div>

			{isOpen && (
				<div 
					className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
					onClick={() => setIsOpen(false)}
				>
					<button 
						className="absolute top-6 right-6 text-zinc-400 hover:text-white bg-zinc-900/60 p-2.5 rounded-full border border-white/10 transition-colors duration-200"
						onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
					</button>
					<div className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center justify-center">
						<img
							src={src}
							alt={alt}
							className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-zinc-850 animate-in zoom-in-95 duration-200"
						/>
						{alt && (
							<p className="mt-3 text-center text-sm text-zinc-400 font-mono">
								{alt}
							</p>
						)}
					</div>
				</div>
			)}
		</>
	);
};

const components = {
	h1: ({ className, ...props }: any) => (
		<h1
			className={clsx(
				"mt-2 scroll-m-20 text-4xl font-bold tracking-tight text-white",
				className,
			)}
			{...props}
		/>
	),
	h2: ({ className, ...props }: any) => (
		<h2
			className={clsx(
				"mt-10 scroll-m-20 border-b border-zinc-850 pb-1 text-3xl font-semibold tracking-tight text-white first:mt-0",
				className,
			)}
			{...props}
		/>
	),
	h3: ({ className, ...props }: any) => (
		<h3
			className={clsx(
				"mt-8 scroll-m-20 text-2xl font-semibold tracking-tight text-white",
				className,
			)}
			{...props}
		/>
	),
	h4: ({ className, ...props }: any) => (
		<h4
			className={clsx(
				"mt-8 scroll-m-20 text-xl font-semibold tracking-tight text-white",
				className,
			)}
			{...props}
		/>
	),
	h5: ({ className, ...props }: any) => (
		<h5
			className={clsx(
				"mt-8 scroll-m-20 text-lg font-semibold tracking-tight text-white",
				className,
			)}
			{...props}
		/>
	),
	h6: ({ className, ...props }: any) => (
		<h6
			className={clsx(
				"mt-8 scroll-m-20 text-base font-semibold tracking-tight text-white",
				className,
			)}
			{...props}
		/>
	),
	a: ({ className, ...props }: any) => (
		<Link
			className={clsx(
				"font-medium text-teal-400 hover:text-teal-300 underline underline-offset-4 transition-colors",
				className,
			)}
			{...props}
		/>
	),
	p: ({ className, ...props }: any) => (
		<p
			className={clsx("leading-7 [&:not(:first-child)]:mt-6 text-zinc-300", className)}
			{...props}
		/>
	),
	ul: ({ className, ...props }: any) => (
		<ul className={clsx("my-6 ml-6 list-disc text-zinc-300", className)} {...props} />
	),
	ol: ({ className, ...props }: any) => (
		<ol className={clsx("my-6 ml-6 list-decimal text-zinc-300", className)} {...props} />
	),
	li: ({ className, ...props }: any) => (
		<li className={clsx("mt-2 text-zinc-300", className)} {...props} />
	),
	blockquote: ({ className, ...props }: any) => (
		<blockquote
			className={clsx(
				"mt-6 border-l-4 border-teal-500/50 pl-6 bg-zinc-900/20 py-3 pr-4 rounded-r-lg italic text-zinc-300 [&>*]:text-zinc-400",
				className,
			)}
			{...props}
		/>
	),
	img: ({
		className,
		alt,
		src,
		...props
	}: any) => (
		<ImageLightbox
			src={src}
			alt={alt}
			className={className}
			{...props}
		/>
	),
	hr: ({ ...props }: any) => (
		<hr className="my-4 border-zinc-800 md:my-8" {...props} />
	),
	table: ({ className, ...props }: any) => (
		<div className="w-full my-6 overflow-y-auto">
			<table className={clsx("w-full", className)} {...props} />
		</div>
	),
	tr: ({ className, ...props }: any) => (
		<tr
			className={clsx(
				"m-0 border-t border-zinc-800 p-0 even:bg-zinc-900/20",
				className,
			)}
			{...props}
		/>
	),
	th: ({ className, ...props }: any) => (
		<th
			className={clsx(
				"border border-zinc-800 px-4 py-2 text-left font-bold text-zinc-200 [&[align=center]]:text-center [&[align=right]]:text-right",
				className,
			)}
			{...props}
		/>
	),
	td: ({ className, ...props }: any) => (
		<td
			className={clsx(
				"border border-zinc-850 px-4 py-2 text-left text-zinc-300 [&[align=center]]:text-center [&[align=right]]:text-right",
				className,
			)}
			{...props}
		/>
	),
	pre: ({ className, ...props }: any) => (
		<pre
			className={clsx(
				"mt-6 mb-4 overflow-x-auto rounded-lg bg-zinc-900 py-4 border border-zinc-800",
				className,
			)}
			{...props}
		/>
	),
	code: ({ className, ...props }: any) => (
		<code
			className={clsx(
				"relative rounded border border-zinc-800 bg-zinc-900/80 px-[0.3rem] py-[0.2rem] font-mono text-sm text-zinc-300",
				className,
			)}
			{...props}
		/>
	),
	Image,
};

interface MdxProps {
	code: string;
}

export function Mdx({ code }: MdxProps) {
	const Component = useMDXComponent(code);

	return (
		<div className="mdx">
			<Component components={components} />
		</div>
	);
}
