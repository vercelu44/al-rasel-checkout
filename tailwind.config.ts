import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import containerQueries from "@tailwindcss/container-queries";
import customPlugin from "./config/tailwind-custom-plugin";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				// The CSS variables come from next/font (config/fonts.ts)
				body: ["var(--font-noto-sans-bengali)", ...defaultTheme.fontFamily.sans],
				title: ["var(--font-zen-kaku-gothic-new)", ...defaultTheme.fontFamily.serif],
				poppins: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
			},
			boxShadow: {
				around: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
			},
			screens: {
				sm: "576px",
				md: "768px",
				lg: "992px",
				xl: "1280px",
				"2xl": "1536px"
			},
			container: {
				center: true,
				padding: "1rem",

			},
			colors: {
				primary: {
					DEFAULT: "#222222",
				},
				secondary: {
					700: "#243e8b",
					800: "#00A7B8",
					DEFAULT: "#2980B9",
				},
				amber: {
					200: "#FFF6EB",
					400: "#FDBE68",
				},
				slate: {
					300: "#CBD5E1",
					400: "#94A3B8",
					500: "#64748B",
					700: "#334155",
					900: "#0F172A",
				},
				red: {
					500: "#EF4444",
				},
			},
			maxWidth: {
				"1/2": "50%",
			},
			// animation add
			keyframes: {
				countup: {
					'from': {
						transform: 'translateY(-5px)',
						opacity: '0'
					},
					'to': {
						transform: 'translateY(0)',
						opacity: '1'
					},
				}
			},
			animation: {
				countup: 'countup 0.3s ease-out',
			}
		},
	},
	plugins: [containerQueries, customPlugin],
};

export default config;
