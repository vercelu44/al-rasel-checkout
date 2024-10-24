/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["Noto Sans Bengali", ...defaultTheme.fontFamily.sans],
        title: ["Hind Siliguri", ...defaultTheme.fontFamily.serif],
      },
      boxShadow: {
        top: "0 -4px 16px 0 rgba(0, 0, 0, 0.08)",
      },
      screens: {
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
      },
      container: {
        center: true,
        // padding: "0.75rem",
        padding: {
          DEFAULT: "0.75rem",
          xl: "0", // Set padding to 0 for xl screen size (desktop)
        },
        margin: {
          DEFAULT: "0",
          xl: "0.75rem",
        },
      },
      colors: {
        primary: {
          DEFAULT: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#283990",
          50: "#FFF6EB",
          200: "#483990",
        },
        secondary: {
          700: "#D82E86",
          800: "#D94E96",
        },
        amber: {
          200: "#FFF6EB",
          400: "#683990",
        },
        slate: {
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          700: "#334155",
          900: "#0F172A",
        },
        red: {
          500: "#EB2D85",
        },
        header: {
          DEFAULT:process.env.NEXT_PUBLIC_HEADER_BACKGROUND ||"#283990",
          foreground: process.env.NEXT_PUBLIC_HEADER_FOREGROUND || "#FFF",
        },
        "custom-bg": process.env.NEXT_PUBLIC_CUSTOM_BG || "#FFF",
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(90deg, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%)',
      },
      maxWidth: {
        "1/2": "50%",
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("./config/tailwind-custom-plugin"),
  ],
};
