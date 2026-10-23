import { withContentlayer } from "next-contentlayer";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	async redirects() {
		return [{ source: "/projects/OnlineBrand", destination: "/projects", permanent: true }];
	},
	experimental: {
		mdxRs: true,
	},
};

export default (phase) => withContentlayer({
	...nextConfig,
	// Keep a running editor preview separate from production build output.
	distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
});
