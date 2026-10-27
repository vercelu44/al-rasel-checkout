import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const dev = process.env.NODE_ENV !== "production";

/** `https://software.example.com/api/v5` -> `software.example.com` */
const getHostname = (url?: string): string | undefined => {
	try {
		return url ? new URL(url).hostname : undefined;
	} catch {
		return undefined;
	}
};

/**
 * Hosts whose images Next.js may resize and convert to WebP.
 * Product/banner images live on the backend, so its host is always allowed;
 * `IMAGE_HOSTNAME` can add another (e.g. a separate CDN).
 */
const imageHosts = [
	...new Set(
		[process.env.IMAGE_HOSTNAME, getHostname(process.env.API_BASE_URL)].filter(
			Boolean
		)
	),
];

const nextConfig: NextConfig = {
	env: {
		server: dev ? process.env.API_BASE_URL : process.env.API_BASE_URL,
		amsPublickey: process.env.AMS_PUBLIC_KEY,
		// amsPrivateKey: process.env.AMS_PRIVATE_KEY,
		// serverBaseUrl: process.env.API_BASE_URL.split("/api")[0],
	},
	images: {
		// Escape hatch: set NEXT_IMAGE_UNOPTIMIZED=YES to serve the original files again
		unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED === "YES",
		remotePatterns: imageHosts.map((hostname) => ({
			protocol: "https" as const,
			hostname,
			pathname: "/**",
		})),
		// Next 16 only allows the qualities listed here (default is [75] only)
		qualities: [75, 80, 85],
		// Uploaded files get a new name when they change, so cache resized copies for 31 days
		minimumCacheTTL: 2678400,
	},
	// `experimental.serverActions` removed: Server Actions are stable since Next.js 14.
};

const withNextIntl = createNextIntlPlugin(
	// Request config for next-intl (locale + messages)
	"./i18n.ts"
);

export default withNextIntl(nextConfig);
