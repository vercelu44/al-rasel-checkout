import { defineRouting } from "next-intl/routing";

export const locales = ["en", "bn"] as const;
export const localePrefix = "as-needed";
export const defaultLocale = "en";

export const routing = defineRouting({
	// A list of all locales that are supported
	locales,
	// If this locale is matched, pathnames work without a prefix (e.g. `/about`)
	defaultLocale,
	localePrefix,
	localeDetection: false, //required to change default locale
});
