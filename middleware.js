import createMiddleware from "next-intl/middleware";
import { localePrefix, locales } from "./navigation";

export default createMiddleware({
	// A list of all locales that are supported
	locales: locales,
	localePrefix: localePrefix,

	// If this locale is matched, pathnames work without a prefix (e.g. `/about`)
	defaultLocale: process.env.DEFAULT_LOCALE || "en",
	localeDetection: false, //required to change default locale
});

export const config = {
	// Skip all paths that should not be internationalized. This example skips
	// certain folders and all pathnames with a dot (e.g. favicon.ico)
	matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
