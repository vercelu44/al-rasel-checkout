import { Noto_Sans_Bengali, Poppins, Zen_Kaku_Gothic_New } from "next/font/google";

/**
 * Site fonts, self-hosted by Next.js (`next/font`).
 *
 * They used to be loaded with `@import url(https://fonts.googleapis.com/...)`
 * in globals.css, which blocks rendering until Google's CSS and font files
 * arrive. `next/font` downloads them at build time, serves them from our own
 * domain and preloads them, so text shows sooner and without layout shift.
 *
 * Each font exposes a CSS variable that `tailwind.config.ts` uses for the
 * `font-body`, `font-title` and `font-poppins` classes.
 */

/** `font-body`: variable font, covers every weight 100–900 */
export const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  display: "swap",
  variable: "--font-noto-sans-bengali",
});

/** `font-title` */
export const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-zen-kaku-gothic-new",
});

/** `font-poppins` */
export const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

/** Class names to put on <html> so the CSS variables exist on every page */
export const fontVariables = [
  notoSansBengali.variable,
  zenKakuGothicNew.variable,
  poppins.variable,
].join(" ");
